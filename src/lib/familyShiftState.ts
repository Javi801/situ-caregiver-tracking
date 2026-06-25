import type { ShiftStatus } from "@/types";

/** Family-facing visual state of the live shift card. */
export type FamilyShiftState =
  | "ok"
  | "late"
  | "replacementRequested"
  | "replacementInProgress"
  | "replacementAccepted";

export interface FamilyShiftStateInput {
  /** Whether the (assigned) caregiver is currently running late. */
  delayed: boolean;
  status: ShiftStatus;
  /** A caregiver rotation is proposed and still awaiting confirmation. */
  hasOpenSwap: boolean;
  /** A replacement is in place (assigned/accepted). */
  hasAssignedReplacement: boolean;
}

/**
 * Derive the family-facing card state. A confirmed replacement reads as
 * resolved (accepted); an open rotation reads as in progress; a requested
 * replacement shares the "late" look with an extra note; otherwise it is just
 * late or on track.
 */
export function getFamilyShiftState({
  delayed,
  status,
  hasOpenSwap,
  hasAssignedReplacement,
}: FamilyShiftStateInput): FamilyShiftState {
  if (hasAssignedReplacement) {
    return "replacementAccepted";
  }
  if (hasOpenSwap) {
    return "replacementInProgress";
  }
  if (status === "replacement_requested") {
    return "replacementRequested";
  }
  return delayed ? "late" : "ok";
}
