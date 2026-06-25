import type { Shift } from "@/types";
import { PRIMARY_CAREGIVER_ID } from "@/data/caregivers";
import { PRIMARY_FAMILY_ID } from "@/data/families";

export const shifts: Shift[] = [
  {
    id: "shift-1",
    caregiverId: PRIMARY_CAREGIVER_ID,
    familyId: PRIMARY_FAMILY_ID,
    startsAt: "2026-06-24T09:00:00",
    status: "scheduled",
    etaMinutes: 18,
  },
];

export const PRIMARY_SHIFT_ID = "shift-1";

export function getInitialShift(): Shift {
  return { ...shifts[0] };
}
