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

/** A handoff report tied to a shift, with provenance metadata. */
export interface MedicalRecord extends HandoffReport {
  id: string;
  shiftId: string;
  recordedAt: string;
  recordedBy: RecordAuthor;
}
