import { createContext, useContext } from "react";
import type {
  MedicalRecord,
  RecordAuthor,
  ReplacementType,
  Shift,
  ShiftStatus,
  HandoffReport,
  SwapPartyDecision,
  SwapPartyRole,
  SwapProposal,
} from "@/types";

/** A replacement assigned to a shift by operations. */
export interface ReplacementAssignment {
  caregiverId: string;
  type: ReplacementType;
  /** "HH:mm" up to which the replacement covers the shift. */
  coveredUntil: string;
  /** Whether the original caregiver was reassigned to the remaining hours. */
  originalReassigned: boolean;
}

/** Mutable runtime state layered on top of a shift's static definition. */
export interface ShiftRuntimeState {
  status: ShiftStatus;
  etaMinutes: number;
  record: MedicalRecord | null;
  familyWaitingEtaMinutes: number | null;
  replacement: ReplacementAssignment | null;
}

export interface ShiftContextValue {
  // --- Active shift (caregiver & family views) ---
  shift: Shift;
  /** The originally scheduled ETA, used as the baseline for delay/risk calculations. */
  scheduledEtaMinutes: number;
  setStatus: (status: ShiftStatus) => void;
  setEtaMinutes: (etaMinutes: number) => void;
  assignedReplacementId: string | null;
  familyWaitingEtaMinutes: number | null;
  markFamilyWaiting: (atEtaMinutes: number) => void;
  hasCheckedIn: boolean;
  record: MedicalRecord | null;
  saveRecord: (report: HandoffReport, recordedBy: RecordAuthor) => void;

  // --- Any shift (operations views) ---
  getShiftState: (shiftId: string) => ShiftRuntimeState;
  /** A shift's static definition merged with its live status/ETA. */
  getEffectiveShift: (shiftId: string) => Shift | undefined;
  opsAssignReplacement: (
    shiftId: string,
    caregiverId: string,
    type: ReplacementType,
    coveredUntil: string,
  ) => void;
  /** Reassign the original caregiver to the remaining (uncovered) hours. */
  opsReassignOriginal: (shiftId: string) => void;

  // --- Caregiver rotation (swap between two families) ---
  /** Every swap proposal, newest first. */
  swapProposals: SwapProposal[];
  /** The most recent swap proposal touching a shift (as A or B), or null. */
  getSwapForShift: (shiftId: string) => SwapProposal | null;
  getSwapById: (proposalId: string) => SwapProposal | null;
  /** Create a swap proposal between an at-risk shift A and a donor shift B. */
  proposeSwap: (shiftAId: string, shiftBId: string) => string | null;
  /** Record a single party's decision; resolves the proposal when complete. */
  setSwapDecision: (
    proposalId: string,
    role: SwapPartyRole,
    decision: SwapPartyDecision,
  ) => void;
  /** Apply an accepted swap: reassign each caregiver to the other shift. */
  applySwap: (proposalId: string) => void;

  reset: () => void;
}

export const ShiftContext = createContext<ShiftContextValue | null>(null);

export function useShift(): ShiftContextValue {
  const context = useContext(ShiftContext);
  if (!context) {
    throw new Error("useShift must be used within a ShiftProvider");
  }
  return context;
}
