import type {
  Caregiver,
  Shift,
  SwapDecisions,
  SwapPartyRole,
  SwapProposal,
} from "@/types";
import { coversFullShift } from "@/lib/schedule";

/** The four parties whose agreement a swap requires, in display order. */
export const SWAP_PARTY_ROLES: SwapPartyRole[] = [
  "caregiverA",
  "caregiverB",
  "familyA",
  "familyB",
];

/** Fresh decisions with every party pending. */
export function initialSwapDecisions(): SwapDecisions {
  return {
    caregiverA: "pending",
    caregiverB: "pending",
    familyA: "pending",
    familyB: "pending",
  };
}

/**
 * Decisions for a newly proposed swap. The operator never answers on behalf of
 * the parties: only the affected family and the delayed caregiver respond here.
 * For the demo, the donor side (the other family and the other caregiver) is
 * assumed to have already agreed, so it starts accepted.
 */
export function proposedSwapDecisions(): SwapDecisions {
  return {
    caregiverA: "pending",
    familyA: "pending",
    caregiverB: "accepted",
    familyB: "accepted",
  };
}

/** How many parties have accepted so far (for "n/4 accepted" progress). */
export function acceptedCount(decisions: SwapDecisions): number {
  return SWAP_PARTY_ROLES.filter((role) => decisions[role] === "accepted").length;
}

/**
 * Derive the swap state from the four party decisions, ignoring whether it has
 * been applied (the provider layers "applied" on top once accepted).
 * - any rejection wins → "rejected" (aborts the swap)
 * - all four accepted → "accepted"
 * - otherwise → "proposed"
 */
export function deriveSwapStatus(
  decisions: SwapDecisions,
): "proposed" | "accepted" | "rejected" {
  if (SWAP_PARTY_ROLES.some((role) => decisions[role] === "rejected")) {
    return "rejected";
  }
  if (SWAP_PARTY_ROLES.every((role) => decisions[role] === "accepted")) {
    return "accepted";
  }
  return "proposed";
}

export interface SwapViability {
  /** Whether the swap is worth proposing at all. */
  viable: boolean;
  /** Caregiver B reaches shift A's home sooner than the at-risk caregiver's current ETA. */
  newArrivesEarlier: boolean;
  /** The at-risk caregiver's availability fully covers the donor shift. */
  originalCoversOther: boolean;
}

/**
 * A swap is only worth proposing when the new caregiver (B) can reach the
 * affected home sooner than the delayed caregiver (A), and caregiver A can in
 * turn cover the donor shift (B) without a significant delay. Mirrors §2.2.4.
 */
export function isSwapViable(
  shiftA: Shift,
  caregiverA: Caregiver,
  shiftB: Shift,
  caregiverB: Caregiver,
): SwapViability {
  const newArrivesEarlier = caregiverB.etaMinutes < shiftA.etaMinutes;
  const originalCoversOther = coversFullShift(caregiverA, shiftB);
  return {
    viable: newArrivesEarlier && originalCoversOther,
    newArrivesEarlier,
    originalCoversOther,
  };
}

export interface SwapCandidateInput {
  shift: Shift;
  caregiver: Caregiver;
}

export interface SwapCandidate extends SwapCandidateInput {
  viability: SwapViability;
}

/**
 * From the other active shifts, the donor shifts that would make a viable swap
 * for the at-risk shift, best (earliest-arriving) first.
 */
export function findSwapCandidates(
  shiftA: Shift,
  caregiverA: Caregiver,
  donors: SwapCandidateInput[],
): SwapCandidate[] {
  return donors
    .filter((donor) => donor.shift.id !== shiftA.id)
    .map((donor) => ({
      ...donor,
      viability: isSwapViable(shiftA, caregiverA, donor.shift, donor.caregiver),
    }))
    .filter((candidate) => candidate.viability.viable)
    .sort((a, b) => a.caregiver.etaMinutes - b.caregiver.etaMinutes);
}

/** Whether a proposal is still awaiting party responses. */
export function isSwapOpen(status: SwapProposal["status"]): boolean {
  return status === "proposed" || status === "accepted";
}

/** The donor caregivers rejected in past swaps for a shift (sink them in the list). */
export function rejectedDonorCaregiverIds(
  proposals: SwapProposal[],
  shiftAId: string,
): string[] {
  return proposals
    .filter((proposal) => proposal.shiftAId === shiftAId && proposal.status === "rejected")
    .map((proposal) => proposal.caregiverBId);
}
