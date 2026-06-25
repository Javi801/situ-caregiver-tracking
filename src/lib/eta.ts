import { DELAY_THRESHOLD_MINUTES, SIMULATED_DELAY_MINUTES } from "@/config/constants";

/**
 * Minutes of delay relative to the original scheduled ETA.
 * Returns 0 when the current ETA is at or below the scheduled one.
 */
export function getDelayMinutes(scheduledEtaMinutes: number, currentEtaMinutes: number): number {
  return Math.max(0, currentEtaMinutes - scheduledEtaMinutes);
}

/** A shift is considered delayed once it exceeds the delay threshold. */
export function isDelayed(scheduledEtaMinutes: number, currentEtaMinutes: number): boolean {
  return getDelayMinutes(scheduledEtaMinutes, currentEtaMinutes) >= DELAY_THRESHOLD_MINUTES;
}

/** Apply a simulated delay to an ETA, returning the new ETA in minutes. */
export function applySimulatedDelay(currentEtaMinutes: number): number {
  return currentEtaMinutes + SIMULATED_DELAY_MINUTES;
}
