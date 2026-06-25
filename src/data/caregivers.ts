import type { Caregiver } from "@/types";

export const caregivers: Caregiver[] = [
  {
    id: "cg-1",
    name: "María González",
    reliabilityScore: 0.96,
    distanceKm: 3.2,
    etaMinutes: 18,
    certifications: ["Elderly care", "First aid"],
    availableFrom: "08:00",
    availableUntil: "17:00",
  },
  {
    id: "cg-2",
    name: "Camila Rojas",
    reliabilityScore: 0.91,
    distanceKm: 5.8,
    etaMinutes: 24,
    certifications: ["Elderly care", "Dementia support"],
    availableFrom: "07:30",
    availableUntil: "19:00",
  },
  {
    id: "cg-3",
    name: "Antonia Pérez",
    reliabilityScore: 0.88,
    distanceKm: 2.1,
    etaMinutes: 14,
    certifications: ["Elderly care"],
    availableFrom: "09:00",
    availableUntil: "13:00",
  },
  {
    id: "cg-4",
    name: "Daniela Soto",
    reliabilityScore: 0.83,
    distanceKm: 9.4,
    etaMinutes: 33,
    certifications: ["Elderly care", "Mobility assistance"],
    availableFrom: "12:00",
    availableUntil: "20:00",
  },
];

export const PRIMARY_CAREGIVER_ID = "cg-1";

export function getCaregiver(id: string): Caregiver | undefined {
  return caregivers.find((caregiver) => caregiver.id === id);
}

/** Caregivers that can be offered as replacements (everyone but the given one). */
export function getReplacementCandidates(excludeId: string): Caregiver[] {
  return caregivers.filter((caregiver) => caregiver.id !== excludeId);
}
