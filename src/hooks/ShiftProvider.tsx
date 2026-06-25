import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type {
  HandoffReport,
  RecordAuthor,
  ReplacementType,
  Shift,
  ShiftStatus,
  SwapPartyDecision,
  SwapPartyRole,
  SwapProposal,
} from "@/types";
import { ACTIVE_SHIFT_ID, getActiveShift, getShift, shifts } from "@/data/shifts";
import { getCaregiver } from "@/data/caregivers";
import { fromMinutes, toMinutes } from "@/lib/schedule";
import { deriveSwapStatus, proposedSwapDecisions } from "@/lib/swap";
import {
  ShiftContext,
  type ShiftContextValue,
  type ShiftRuntimeState,
} from "@/hooks/shift-context";

const STORAGE_KEY = "situ.shiftStates.v2";
const SWAP_STORAGE_KEY = "situ.swapProposals.v1";

/** Statuses in which the caregiver is considered to have checked in (arrived). */
const CHECKED_IN_STATUSES: ShiftStatus[] = ["arrived", "shift_started", "completed"];

type StatesMap = Record<string, ShiftRuntimeState>;

function buildInitialStates(): StatesMap {
  const initial: StatesMap = {};
  for (const shift of shifts) {
    initial[shift.id] = {
      status: shift.status,
      etaMinutes: shift.etaMinutes,
      record: null,
      familyWaitingEtaMinutes: null,
      replacement: null,
    };
  }
  return initial;
}

function loadPersisted(): StatesMap | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StatesMap) : null;
  } catch {
    return null;
  }
}

function persist(states: StatesMap): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(states));
  } catch {
    // Ignore storage failures (private mode, quota, SSR).
  }
}

function loadPersistedSwaps(): SwapProposal[] {
  try {
    const raw = window.localStorage.getItem(SWAP_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SwapProposal[]) : [];
  } catch {
    return [];
  }
}

function persistSwaps(proposals: SwapProposal[]): void {
  try {
    window.localStorage.setItem(SWAP_STORAGE_KEY, JSON.stringify(proposals));
  } catch {
    // Ignore storage failures.
  }
}

export function ShiftProvider({ children }: { children: ReactNode }) {
  const baselineActive = useMemo(getActiveShift, []);

  const [states, setStates] = useState<StatesMap>(() => {
    const initial = buildInitialStates();
    const persisted = loadPersisted();
    // Merge so newly added shifts still appear alongside persisted overrides.
    return persisted ? { ...initial, ...persisted } : initial;
  });

  const [swapProposals, setSwapProposals] = useState<SwapProposal[]>(loadPersistedSwaps);

  useEffect(() => {
    persist(states);
  }, [states]);

  useEffect(() => {
    persistSwaps(swapProposals);
  }, [swapProposals]);

  const updateState = useCallback((shiftId: string, partial: Partial<ShiftRuntimeState>) => {
    setStates((current) => ({
      ...current,
      [shiftId]: { ...current[shiftId], ...partial },
    }));
  }, []);

  const getShiftState = useCallback(
    (shiftId: string): ShiftRuntimeState =>
      states[shiftId] ?? {
        status: "scheduled",
        etaMinutes: 0,
        record: null,
        familyWaitingEtaMinutes: null,
        replacement: null,
      },
    [states],
  );

  const getEffectiveShift = useCallback(
    (shiftId: string): Shift | undefined => {
      const base = getShift(shiftId);
      if (!base) {
        return undefined;
      }
      const state = states[shiftId];
      return state ? { ...base, status: state.status, etaMinutes: state.etaMinutes } : base;
    },
    [states],
  );

  const assignReplacementTo = useCallback(
    (shiftId: string, caregiverId: string, type: ReplacementType, coveredUntil: string) => {
      const caregiver = getCaregiver(caregiverId);
      setStates((current) => ({
        ...current,
        [shiftId]: {
          ...current[shiftId],
          // A momentary replacement keeps the shift active (covered by the
          // replacement, then the original returns); a full replacement
          // cancels the original assignment.
          status: type === "momentary" ? "replacement_assigned" : "cancelled",
          etaMinutes: caregiver?.etaMinutes ?? current[shiftId].etaMinutes,
          replacement: { caregiverId, type, coveredUntil, originalReassigned: false },
        },
      }));
    },
    [],
  );

  const opsReassignOriginal = useCallback((shiftId: string) => {
    setStates((current) => {
      const state = current[shiftId];
      if (!state.replacement) {
        return current;
      }
      return {
        ...current,
        [shiftId]: {
          ...state,
          replacement: { ...state.replacement, originalReassigned: true },
        },
      };
    });
  }, []);

  // --- Caregiver rotation (swap) ---
  const getSwapById = useCallback(
    (proposalId: string): SwapProposal | null =>
      swapProposals.find((proposal) => proposal.id === proposalId) ?? null,
    [swapProposals],
  );

  const getSwapForShift = useCallback(
    (shiftId: string): SwapProposal | null =>
      swapProposals.find(
        (proposal) => proposal.shiftAId === shiftId || proposal.shiftBId === shiftId,
      ) ?? null,
    [swapProposals],
  );

  const proposeSwap = useCallback((shiftAId: string, shiftBId: string): string | null => {
    const shiftA = getShift(shiftAId);
    const shiftB = getShift(shiftBId);
    if (!shiftA || !shiftB) {
      return null;
    }
    const id = `swap-${shiftAId}-${shiftBId}-${new Date().toISOString()}`;
    const proposal: SwapProposal = {
      id,
      shiftAId,
      shiftBId,
      caregiverAId: shiftA.caregiverId,
      caregiverBId: shiftB.caregiverId,
      familyAId: shiftA.familyId,
      familyBId: shiftB.familyId,
      decisions: proposedSwapDecisions(),
      status: "proposed",
      createdAt: new Date().toISOString(),
      resolvedAt: null,
    };
    // Newest first; a fresh proposal supersedes any open one for the same shift.
    setSwapProposals((current) => [proposal, ...current]);
    return id;
  }, []);

  const setSwapDecision = useCallback(
    (proposalId: string, role: SwapPartyRole, decision: SwapPartyDecision) => {
      setSwapProposals((current) =>
        current.map((proposal) => {
          if (proposal.id !== proposalId) {
            return proposal;
          }
          const decisions = { ...proposal.decisions, [role]: decision };
          const derived = deriveSwapStatus(decisions);
          // "accepted" stays pending an explicit operator apply; only a
          // rejection resolves the proposal here.
          return {
            ...proposal,
            decisions,
            status: derived,
            resolvedAt: derived === "rejected" ? new Date().toISOString() : proposal.resolvedAt,
          };
        }),
      );
    },
    [],
  );

  const applySwap = useCallback((proposalId: string) => {
    setSwapProposals((currentProposals) => {
      const proposal = currentProposals.find((item) => item.id === proposalId);
      if (!proposal || proposal.status !== "accepted") {
        return currentProposals;
      }
      const shiftA = getShift(proposal.shiftAId);
      const shiftB = getShift(proposal.shiftBId);
      if (!shiftA || !shiftB) {
        return currentProposals;
      }
      const caregiverB = getCaregiver(proposal.caregiverBId);
      const caregiverA = getCaregiver(proposal.caregiverAId);
      // Reassign each caregiver to the other shift, keeping both shifts active.
      setStates((current) => ({
        ...current,
        [proposal.shiftAId]: {
          ...current[proposal.shiftAId],
          status: "replacement_assigned",
          etaMinutes: caregiverB?.etaMinutes ?? current[proposal.shiftAId].etaMinutes,
          replacement: {
            caregiverId: proposal.caregiverBId,
            type: "full",
            coveredUntil: fromMinutes(toMinutes(shiftA.endsAt)),
            originalReassigned: false,
          },
        },
        [proposal.shiftBId]: {
          ...current[proposal.shiftBId],
          status: "replacement_assigned",
          etaMinutes: caregiverA?.etaMinutes ?? current[proposal.shiftBId].etaMinutes,
          replacement: {
            caregiverId: proposal.caregiverAId,
            type: "full",
            coveredUntil: fromMinutes(toMinutes(shiftB.endsAt)),
            originalReassigned: false,
          },
        },
      }));
      return currentProposals.map((item) =>
        item.id === proposalId
          ? { ...item, status: "applied", resolvedAt: new Date().toISOString() }
          : item,
      );
    });
  }, []);

  const saveRecord = useCallback((report: HandoffReport, recordedBy: RecordAuthor) => {
    setStates((current) => {
      const state = current[ACTIVE_SHIFT_ID];
      return {
        ...current,
        [ACTIVE_SHIFT_ID]: {
          ...state,
          record: {
            ...report,
            id: `record-${ACTIVE_SHIFT_ID}`,
            shiftId: ACTIVE_SHIFT_ID,
            recordedAt: new Date().toISOString(),
            recordedBy,
          },
          // A caregiver completing the ficha closes out the shift; a family
          // filling it in while the caregiver is late only records information.
          status: recordedBy === "caregiver" ? "completed" : state.status,
        },
      };
    });
  }, []);

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(SWAP_STORAGE_KEY);
    } catch {
      // Ignore storage failures.
    }
    setStates(buildInitialStates());
    setSwapProposals([]);
  }, []);

  // --- Active-shift convenience API ---
  const activeState = states[ACTIVE_SHIFT_ID];
  const shift = useMemo<Shift>(
    () => ({ ...baselineActive, status: activeState.status, etaMinutes: activeState.etaMinutes }),
    [baselineActive, activeState.status, activeState.etaMinutes],
  );

  const setStatus = useCallback(
    (status: ShiftStatus) => updateState(ACTIVE_SHIFT_ID, { status }),
    [updateState],
  );
  const setEtaMinutes = useCallback(
    (etaMinutes: number) => updateState(ACTIVE_SHIFT_ID, { etaMinutes }),
    [updateState],
  );
  const markFamilyWaiting = useCallback(
    (atEtaMinutes: number) => updateState(ACTIVE_SHIFT_ID, { familyWaitingEtaMinutes: atEtaMinutes }),
    [updateState],
  );

  const value = useMemo<ShiftContextValue>(
    () => ({
      shift,
      scheduledEtaMinutes: baselineActive.scheduledEtaMinutes,
      setStatus,
      setEtaMinutes,
      assignedReplacementId: activeState.replacement?.caregiverId ?? null,
      familyWaitingEtaMinutes: activeState.familyWaitingEtaMinutes,
      markFamilyWaiting,
      hasCheckedIn: CHECKED_IN_STATUSES.includes(activeState.status),
      record: activeState.record,
      saveRecord,
      getShiftState,
      getEffectiveShift,
      opsAssignReplacement: assignReplacementTo,
      opsReassignOriginal,
      swapProposals,
      getSwapForShift,
      getSwapById,
      proposeSwap,
      setSwapDecision,
      applySwap,
      reset,
    }),
    [
      shift,
      baselineActive.scheduledEtaMinutes,
      setStatus,
      setEtaMinutes,
      activeState,
      markFamilyWaiting,
      saveRecord,
      getShiftState,
      getEffectiveShift,
      assignReplacementTo,
      opsReassignOriginal,
      swapProposals,
      getSwapForShift,
      getSwapById,
      proposeSwap,
      setSwapDecision,
      applySwap,
      reset,
    ],
  );

  return <ShiftContext.Provider value={value}>{children}</ShiftContext.Provider>;
}
