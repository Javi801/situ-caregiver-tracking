import type { Family } from "@/types";

export const families: Family[] = [
  {
    id: "fam-1",
    name: "Familia Herrera",
    address: "Av. Los Leones 1234, Providencia",
    olderAdultName: "Don Roberto Herrera",
    notes: "Uses a walker. Prefers a calm morning routine.",
  },
  {
    id: "fam-2",
    name: "Familia Muñoz",
    address: "Calle El Roble 567, Ñuñoa",
    olderAdultName: "Doña Elena Muñoz",
    notes: "Mild dementia. Responds well to familiar faces.",
  },
];

export const PRIMARY_FAMILY_ID = "fam-1";

export function getFamily(id: string): Family | undefined {
  return families.find((family) => family.id === id);
}
