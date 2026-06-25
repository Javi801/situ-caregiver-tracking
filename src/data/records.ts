import type { MedicalRecord } from "@/types";

/**
 * Previously completed medical records (fichas) for past shifts.
 * Used to let the caregiver review the older adult's recent history.
 */
export const previousRecords: MedicalRecord[] = [
  {
    id: "record-prev-2",
    shiftId: "shift-prev-2",
    recordedAt: "2026-06-23T17:00:00",
    recordedBy: "caregiver",
    sleepQuality: "Slept well, around 7 hours.",
    mood: "Calm and cooperative.",
    medicationChanges: "No changes.",
    recentEvents: "Short walk in the morning.",
    notes: "Good appetite at lunch.",
  },
  {
    id: "record-prev-1",
    shiftId: "shift-prev-1",
    recordedAt: "2026-06-24T17:00:00",
    recordedBy: "caregiver",
    sleepQuality: "Restless night, woke up twice.",
    mood: "A bit tired but friendly.",
    medicationChanges: "Doctor adjusted blood pressure dose.",
    recentEvents: "Family visit in the afternoon.",
    notes: "Reminded about hydration.",
  },
];

/** Records for shifts other than the given one, most recent first. */
export function getPreviousRecords(excludeShiftId: string): MedicalRecord[] {
  return previousRecords
    .filter((record) => record.shiftId !== excludeShiftId)
    .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt));
}
