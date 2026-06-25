import type { ShiftStatus } from "@/types";

/** Operations triage state for a shift. */
export type OpsState = "ok" | "pending" | "late";

/**
 * Triage a shift for the operations board:
 * - "late" (red): running late or being managed; needs action.
 * - "pending" (yellow): no departure/arrival info yet.
 * - "ok" (green): on track, arrived, or already covered by a replacement.
 */
export function getOpsState(status: ShiftStatus, delayed: boolean): OpsState {
  switch (status) {
    case "delay_detected":
    case "replacement_requested":
      return "late";
    case "scheduled":
      return "pending";
    case "trip_started":
      return delayed ? "late" : "ok";
    default:
      // arrived, shift_started, completed, replacement_assigned, cancelled
      return "ok";
  }
}
