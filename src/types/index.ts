export type ShiftStatus =
  | "scheduled"
  | "trip_started"
  | "delay_detected"
  | "replacement_requested"
  | "replacement_assigned"
  | "cancelled"
  | "arrived"
  | "shift_started"
  | "completed";

export type RiskLevel = "low" | "medium" | "high";

/** Scope of a replacement: covers the whole shift or only part of it. */
export type ReplacementType = "full" | "momentary";

export interface Caregiver {
  id: string;
  name: string;
  reliabilityScore: number;
  distanceKm: number;
  etaMinutes: number;
  certifications: string[];
  /** Availability window for the day, as "HH:mm" strings. */
  availableFrom: string;
  availableUntil: string;
}

export interface Family {
  id: string;
  name: string;
  address: string;
  olderAdultName: string;
  notes: string;
}

export interface Shift {
  id: string;
  caregiverId: string;
  familyId: string;
  startsAt: string;
  endsAt: string;
  status: ShiftStatus;
  /** Current estimated arrival in minutes. */
  etaMinutes: number;
  /** Originally scheduled arrival in minutes; baseline for delay/risk. */
  scheduledEtaMinutes: number;
}

export interface HandoffReport {
  sleepQuality: string;
  mood: string;
  medicationChanges: string;
  recentEvents: string;
  notes: string;
}

/** Who completed a medical record for a shift. */
export type RecordAuthor = "caregiver" | "family";

/**
 * The four parties whose agreement is required to rotate caregivers between
 * two shifts. "A" is the at-risk shift; "B" is the donor shift.
 */
export type SwapPartyRole = "caregiverA" | "caregiverB" | "familyA" | "familyB";

/** A single party's response to a swap proposal. */
export type SwapPartyDecision = "pending" | "accepted" | "rejected";

/** Each party's current decision on a swap. */
export type SwapDecisions = Record<SwapPartyRole, SwapPartyDecision>;

/**
 * Global state of a swap, derived from the four party decisions plus whether
 * operations has applied the reassignment:
 * - proposed: at least one party still pending, none rejected
 * - accepted: all four accepted, not yet applied
 * - rejected: at least one party rejected (aborts the swap)
 * - applied: accepted and the reassignment was executed by operations
 */
export type SwapStatus = "proposed" | "accepted" | "rejected" | "applied";

/**
 * A proposed rotation between two shifts assigned to different families.
 * Caregiver B (donor) would cover shift A; caregiver A (at-risk) would cover
 * shift B. Concretes only when all four parties accept.
 */
export interface SwapProposal {
  id: string;
  /** At-risk shift whose caregiver is delayed. */
  shiftAId: string;
  /** Donor shift whose caregiver is offered to cover shift A. */
  shiftBId: string;
  caregiverAId: string;
  caregiverBId: string;
  familyAId: string;
  familyBId: string;
  decisions: SwapDecisions;
  status: SwapStatus;
  createdAt: string;
  resolvedAt: string | null;
}

/** A handoff report tied to a shift, with provenance metadata. */
export interface MedicalRecord extends HandoffReport {
  id: string;
  shiftId: string;
  recordedAt: string;
  recordedBy: RecordAuthor;
}
