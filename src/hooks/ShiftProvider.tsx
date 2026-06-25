import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { HandoffReport, RecordAuthor, ReplacementType, Shift, ShiftStatus } from "@/types";
import { ACTIVE_SHIFT_ID, getActiveShift, getShift, shifts } from "@/data/shifts";
import { getCaregiver } from "@/data/caregivers";
import { fromMinutes, toMinutes } from "@/lib/schedule";
import {
  ShiftContext,
  type ShiftContextValue,
  type ShiftRuntimeState,
} from "@/hooks/shift-context";

const STORAGE_KEY = "situ.shiftStates.v2";

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

export function ShiftProvider({ children }: { children: ReactNode }) {
  const baselineActive = useMemo(getActiveShift, []);

  const [states, setStates] = useState<StatesMap>(() => {
    const initial = buildInitialStates();
    const persisted = loadPersisted();
    // Merge so newly added shifts still appear alongside persisted overrides.
    return persisted ? { ...initial, ...persisted } : initial;
  });

  useEffect(() => {
    persist(states);
  }, [states]);

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
          // The original caregiver is fully replaced by default.
          status: "cancelled",
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
    } catch {
      // Ignore storage failures.
    }
    setStates(buildInitialStates());
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
  const assignReplacement = useCallback(
    (caregiverId: string) =>
      assignReplacementTo(
        ACTIVE_SHIFT_ID,
        caregiverId,
        "full",
        fromMinutes(toMinutes(baselineActive.endsAt)),
      ),
    [assignReplacementTo, baselineActive.endsAt],
  );

  const value = useMemo<ShiftContextValue>(
    () => ({
      shift,
      scheduledEtaMinutes: baselineActive.scheduledEtaMinutes,
      setStatus,
      setEtaMinutes,
      assignedReplacementId: activeState.replacement?.caregiverId ?? null,
      assignReplacement,
      familyWaitingEtaMinutes: activeState.familyWaitingEtaMinutes,
      markFamilyWaiting,
      hasCheckedIn: CHECKED_IN_STATUSES.includes(activeState.status),
      record: activeState.record,
      saveRecord,
      getShiftState,
      getEffectiveShift,
      opsAssignReplacement: assignReplacementTo,
      opsReassignOriginal,
      reset,
    }),
    [
      shift,
      baselineActive.scheduledEtaMinutes,
      setStatus,
      setEtaMinutes,
      activeState,
      assignReplacement,
      markFamilyWaiting,
      saveRecord,
      getShiftState,
      getEffectiveShift,
      assignReplacementTo,
      opsReassignOriginal,
      reset,
    ],
  );

  return <ShiftContext.Provider value={value}>{children}</ShiftContext.Provider>;
}
