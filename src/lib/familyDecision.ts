import type { ShiftStatus } from "@/types";

/** What the family chose to do about a delay (for the operations board). */
export type FamilyDecision = "waiting" | "requested";

/**
 * Derive the family's delay decision from a shift's runtime state:
 * a requested replacement takes precedence over a decision to wait.
 */
export function getFamilyDecision(
  status: ShiftStatus,
  familyWaitingEtaMinutes: number | null,
): FamilyDecision | null {
  if (status === "replacement_requested") {
    return "requested";
  }
  if (familyWaitingEtaMinutes !== null) {
    return "waiting";
  }
  return null;
}
