/** Minutes from `now` until the shift starts (negative once it has started). */
export function minutesUntilStart(startsAt: string, now: Date): number {
  const startMs = new Date(startsAt).getTime();
  if (Number.isNaN(startMs)) {
    return Number.POSITIVE_INFINITY;
  }
  return (startMs - now.getTime()) / 60000;
}

/**
 * True once we are inside the pre-shift arrival window (from `windowMinutes`
 * before the start onwards). The family can use this to flag a caregiver that
 * should already be arriving but hasn't checked in.
 */
export function isWithinArrivalWindow(
  startsAt: string,
  windowMinutes: number,
  now: Date,
): boolean {
  return minutesUntilStart(startsAt, now) <= windowMinutes;
}
