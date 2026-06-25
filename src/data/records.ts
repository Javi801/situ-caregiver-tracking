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
    sleepQuality: "Durmió bien, alrededor de 7 horas.",
    mood: "Tranquilo y colaborador.",
    medicationChanges: "Sin cambios.",
    recentEvents: "Caminata corta durante la mañana.",
    notes: "Buen apetito durante el almuerzo.",
  },
  {
    id: "record-prev-1",
    shiftId: "shift-prev-1",
    recordedAt: "2026-06-24T17:00:00",
    recordedBy: "caregiver",
    sleepQuality: "Noche inquieta, desperto dos veces.",
    mood: "Algo cansado, pero amable.",
    medicationChanges: "El médico ajustó la dosis para la presión.",
    recentEvents: "Visita familiar durante la tarde.",
    notes: "Se recordó mantener hidratación.",
  },
];

/** Records for shifts other than the given one, most recent first. */
export function getPreviousRecords(excludeShiftId: string): MedicalRecord[] {
  return previousRecords
    .filter((record) => record.shiftId !== excludeShiftId)
    .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt));
}
