import { HIGH_RISK_DELAY_MINUTES, MEDIUM_RISK_DELAY_MINUTES } from "@/config/constants";
import type { RiskLevel } from "@/types";
import { getDelayMinutes } from "@/lib/eta";

/** Determine risk level from the delay relative to the scheduled ETA. */
export function getRiskLevel(scheduledEtaMinutes: number, currentEtaMinutes: number): RiskLevel {
  const delay = getDelayMinutes(scheduledEtaMinutes, currentEtaMinutes);
  if (delay >= HIGH_RISK_DELAY_MINUTES) {
    return "high";
  }
  if (delay >= MEDIUM_RISK_DELAY_MINUTES) {
    return "medium";
  }
  return "low";
}
