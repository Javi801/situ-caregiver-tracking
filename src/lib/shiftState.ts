import type { ShiftStatus } from "@/types";

/** Caregiver-facing summary of where the active shift stands right now. */
export type CaregiverShiftState =
  | "start"
  | "onTheWay"
  | "delayed"
  | "inProgress"
  | "replacementRequested"
  | "replacementAssigned"
  | "cancelled"
  | "done";

/**
 * Derive the caregiver-facing state of a shift from its status and whether it is
 * currently delayed. Drives the highlight and call-to-action on the dashboard.
 */
export function getCaregiverShiftState(
  status: ShiftStatus,
  delayed: boolean,
): CaregiverShiftState {
  switch (status) {
    case "scheduled":
      return "start";
    case "trip_started":
      return delayed ? "delayed" : "onTheWay";
    case "delay_detected":
      return "delayed";
    case "replacement_requested":
      return "replacementRequested";
    case "replacement_assigned":
      return "replacementAssigned";
    case "cancelled":
      return "cancelled";
    case "arrived":
    case "shift_started":
      return "inProgress";
    case "completed":
      return "done";
    default:
      return "onTheWay";
  }
}
