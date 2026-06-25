import type { Caregiver, Shift } from "@/types";

/** Parse an ISO datetime or "HH:mm" string into minutes from midnight. */
export function toMinutes(value: string): number {
  const time = value.includes("T") ? value.slice(11, 16) : value.slice(0, 5);
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + (minutes || 0);
}

/** Format minutes from midnight as "HH:mm". */
export function fromMinutes(totalMinutes: number): string {
  const clamped = Math.max(0, Math.min(24 * 60, Math.round(totalMinutes)));
  const hours = Math.floor(clamped / 60);
  const minutes = clamped % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

/** A shift's start/end as "HH:mm". */
export function shiftWindow(shift: Shift): { start: string; end: string } {
  return { start: fromMinutes(toMinutes(shift.startsAt)), end: fromMinutes(toMinutes(shift.endsAt)) };
}

/** Whether a caregiver's availability spans the whole shift. */
export function coversFullShift(caregiver: Caregiver, shift: Shift): boolean {
  return (
    toMinutes(caregiver.availableFrom) <= toMinutes(shift.startsAt) &&
    toMinutes(caregiver.availableUntil) >= toMinutes(shift.endsAt)
  );
}

export interface MomentaryCoverage {
  /** "HH:mm" when the momentary coverage ends. */
  coveredUntil: string;
  /** Whole hours the caregiver can cover from the shift start. */
  hours: number;
  /** "HH:mm" range that remains uncovered, or null if the shift is fully covered. */
  remainingFrom: string | null;
  remainingUntil: string | null;
}

/**
 * Coverage a caregiver can provide from the shift start, bounded by their
 * availability and the shift end. Used to offer momentary replacements and
 * surface the schedule still to be covered.
 */
export function momentaryCoverage(caregiver: Caregiver, shift: Shift): MomentaryCoverage {
  const shiftStart = toMinutes(shift.startsAt);
  const shiftEnd = toMinutes(shift.endsAt);
  const availableUntil = toMinutes(caregiver.availableUntil);
  const coveredUntilMin = Math.min(shiftEnd, Math.max(shiftStart, availableUntil));
  const hours = Math.max(0, Math.round(((coveredUntilMin - shiftStart) / 60) * 10) / 10);
  const hasRemaining = coveredUntilMin < shiftEnd;
  return {
    coveredUntil: fromMinutes(coveredUntilMin),
    hours,
    remainingFrom: hasRemaining ? fromMinutes(coveredUntilMin) : null,
    remainingUntil: hasRemaining ? fromMinutes(shiftEnd) : null,
  };
}
