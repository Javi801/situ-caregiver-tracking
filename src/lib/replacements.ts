import type { Caregiver } from "@/types";

/**
 * Score a replacement candidate. Lower ETA and distance are better, higher
 * reliability is better. The result is a single comparable number where a
 * higher score means a better match.
 */
export function scoreCandidate(caregiver: Caregiver): number {
  const etaPenalty = caregiver.etaMinutes * 1.5;
  const distancePenalty = caregiver.distanceKm * 1;
  const reliabilityBonus = caregiver.reliabilityScore * 40;
  return reliabilityBonus - etaPenalty - distancePenalty;
}

/** Rank replacement candidates from best to worst match. */
export function rankReplacements(candidates: Caregiver[]): Caregiver[] {
  return [...candidates].sort((a, b) => scoreCandidate(b) - scoreCandidate(a));
}

/** The single best replacement candidate, or undefined if none are available. */
export function getBestReplacement(candidates: Caregiver[]): Caregiver | undefined {
  return rankReplacements(candidates)[0];
}
