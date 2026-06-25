import type { Family } from "@/types";

export const families: Family[] = [
  {
    id: "fam-1",
    name: "Familia Herrera",
    address: "Av. Los Leones 1234, Providencia",
    olderAdultName: "Don Roberto Herrera",
    notes: "Usa andador. Prefiere una rutina tranquila por la mañana.",
  },
  {
    id: "fam-2",
    name: "Familia Muñoz",
    address: "Calle El Roble 567, Ñuñoa",
    olderAdultName: "Doña Elena Muñoz",
    notes: "Demencia leve. Responde bien a caras familiares.",
  },
  {
    id: "fam-3",
    name: "Familia Castro",
    address: "Pasaje Las Acacias 89, La Reina",
    olderAdultName: "Don Jorge Castro",
    notes: "Necesita ayuda con la medicación de la mañana.",
  },
  {
    id: "fam-4",
    name: "Familia Vega",
    address: "Av. Macul 4521, Macul",
    olderAdultName: "Doña Rosa Vega",
    notes: "Movilidad limitada. Requiere llegadas puntuales.",
  },
];

export const PRIMARY_FAMILY_ID = "fam-1";

export function getFamily(id: string): Family | undefined {
  return families.find((family) => family.id === id);
}
