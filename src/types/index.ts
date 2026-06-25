export type ShiftStatus =
  | "scheduled"
  | "trip_started"
  | "delay_detected"
  | "replacement_requested"
  | "replacement_assigned"
  | "arrived"
  | "shift_started"
  | "completed";

export type RiskLevel = "low" | "medium" | "high";

export interface Caregiver {
  id: string;
  name: string;
  reliabilityScore: number;
  distanceKm: number;
  etaMinutes: number;
  certifications: string[];
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
  status: ShiftStatus;
  etaMinutes: number;
}

export interface HandoffReport {
  sleepQuality: string;
  mood: string;
  medicationChanges: string;
  recentEvents: string;
  notes: string;
}
