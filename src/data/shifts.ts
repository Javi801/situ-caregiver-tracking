import type { Shift } from "@/types";
import { PRIMARY_CAREGIVER_ID } from "@/data/caregivers";
import { PRIMARY_FAMILY_ID } from "@/data/families";

/** The shift currently in progress that drives the live tracking flow. */
export const ACTIVE_SHIFT_ID = "shift-active";

const ACTIVE_DATE = "2026-06-25";

export const shifts: Shift[] = [
  // Past, completed (for record history)
  {
    id: "shift-prev-2",
    caregiverId: PRIMARY_CAREGIVER_ID,
    familyId: PRIMARY_FAMILY_ID,
    startsAt: "2026-06-23T09:00:00",
    endsAt: "2026-06-23T17:00:00",
    status: "completed",
    etaMinutes: 18,
    scheduledEtaMinutes: 18,
  },
  {
    id: "shift-prev-1",
    caregiverId: PRIMARY_CAREGIVER_ID,
    familyId: PRIMARY_FAMILY_ID,
    startsAt: "2026-06-24T09:00:00",
    endsAt: "2026-06-24T17:00:00",
    status: "completed",
    etaMinutes: 18,
    scheduledEtaMinutes: 18,
  },
  // Today — the live shift (context-driven)
  {
    id: ACTIVE_SHIFT_ID,
    caregiverId: PRIMARY_CAREGIVER_ID,
    familyId: PRIMARY_FAMILY_ID,
    startsAt: "2026-06-25T09:00:00",
    endsAt: "2026-06-25T17:00:00",
    status: "scheduled",
    etaMinutes: 18,
    scheduledEtaMinutes: 18,
  },
  // Today — other active shifts for the operations board
  {
    id: "shift-ops-green",
    caregiverId: "cg-2",
    familyId: "fam-2",
    startsAt: "2026-06-25T09:30:00",
    endsAt: "2026-06-25T13:30:00",
    status: "trip_started",
    etaMinutes: 20,
    scheduledEtaMinutes: 22,
  },
  {
    id: "shift-ops-yellow",
    caregiverId: "cg-3",
    familyId: "fam-3",
    startsAt: "2026-06-25T10:00:00",
    endsAt: "2026-06-25T18:00:00",
    status: "scheduled",
    etaMinutes: 16,
    scheduledEtaMinutes: 16,
  },
  {
    id: "shift-ops-red",
    caregiverId: "cg-4",
    familyId: "fam-4",
    startsAt: "2026-06-25T08:30:00",
    endsAt: "2026-06-25T16:30:00",
    status: "delay_detected",
    etaMinutes: 42,
    scheduledEtaMinutes: 20,
  },
  // Upcoming days
  {
    id: "shift-next-1",
    caregiverId: PRIMARY_CAREGIVER_ID,
    familyId: "fam-2",
    startsAt: "2026-06-26T08:30:00",
    endsAt: "2026-06-26T12:30:00",
    status: "scheduled",
    etaMinutes: 24,
    scheduledEtaMinutes: 24,
  },
  {
    id: "shift-next-2",
    caregiverId: PRIMARY_CAREGIVER_ID,
    familyId: PRIMARY_FAMILY_ID,
    startsAt: "2026-06-27T14:00:00",
    endsAt: "2026-06-27T20:00:00",
    status: "scheduled",
    etaMinutes: 18,
    scheduledEtaMinutes: 18,
  },
];

function datePart(isoDate: string): string {
  return isoDate.slice(0, 10);
}

/** The active shift definition (baseline; live state lives in ShiftProvider). */
export function getActiveShift(): Shift {
  const active = shifts.find((shift) => shift.id === ACTIVE_SHIFT_ID);
  if (!active) {
    throw new Error(`Active shift "${ACTIVE_SHIFT_ID}" not found in mock data`);
  }
  return { ...active };
}

/** Back-compat alias used by tests and providers for the live shift baseline. */
export function getInitialShift(): Shift {
  return getActiveShift();
}

export function getShift(id: string): Shift | undefined {
  const shift = shifts.find((item) => item.id === id);
  return shift ? { ...shift } : undefined;
}

/** All shifts assigned to a caregiver, ordered by start time (soonest first). */
export function getCaregiverShifts(caregiverId: string): Shift[] {
  return shifts
    .filter((shift) => shift.caregiverId === caregiverId)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    .map((shift) => ({ ...shift }));
}

/** All shifts for a family, ordered by start time (soonest first). */
export function getFamilyShifts(familyId: string): Shift[] {
  return shifts
    .filter((shift) => shift.familyId === familyId)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    .map((shift) => ({ ...shift }));
}

/** A family's upcoming shifts (active or scheduled, not completed), soonest first. */
export function getUpcomingFamilyShifts(familyId: string): Shift[] {
  return getFamilyShifts(familyId).filter((shift) => shift.status !== "completed");
}

/** Operations: shifts happening today (the active board), soonest first. */
export function getOpsActiveShifts(): Shift[] {
  return shifts
    .filter((shift) => datePart(shift.startsAt) === ACTIVE_DATE && shift.status !== "completed")
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    .map((shift) => ({ ...shift }));
}

/** Operations: shifts scheduled for future days, soonest first. */
export function getOpsUpcomingShifts(): Shift[] {
  return shifts
    .filter((shift) => datePart(shift.startsAt) > ACTIVE_DATE && shift.status !== "completed")
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    .map((shift) => ({ ...shift }));
}

/** Operations: every non-completed shift, for the calendar view. */
export function getOpsCalendarShifts(): Shift[] {
  return [...getOpsActiveShifts(), ...getOpsUpcomingShifts()];
}

export function isActiveShift(id: string): boolean {
  return id === ACTIVE_SHIFT_ID;
}
