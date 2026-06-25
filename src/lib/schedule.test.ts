import { describe, expect, it } from "vitest";
import { coversFullShift, momentaryCoverage, toMinutes } from "@/lib/schedule";
import type { Caregiver, Shift } from "@/types";

const shift: Shift = {
  id: "s",
  caregiverId: "x",
  familyId: "f",
  startsAt: "2026-06-25T09:00:00",
  endsAt: "2026-06-25T17:00:00",
  status: "delay_detected",
  etaMinutes: 40,
  scheduledEtaMinutes: 18,
};

function caregiver(availableFrom: string, availableUntil: string): Caregiver {
  return {
    id: "c",
    name: "Test",
    reliabilityScore: 0.9,
    distanceKm: 3,
    etaMinutes: 15,
    certifications: [],
    availableFrom,
    availableUntil,
  };
}

describe("toMinutes", () => {
  it("parses ISO datetimes and HH:mm equally", () => {
    expect(toMinutes("2026-06-25T09:30:00")).toBe(570);
    expect(toMinutes("09:30")).toBe(570);
  });
});

describe("coversFullShift", () => {
  it("is true when availability spans the shift", () => {
    expect(coversFullShift(caregiver("08:00", "18:00"), shift)).toBe(true);
  });

  it("is false when availability ends before the shift", () => {
    expect(coversFullShift(caregiver("09:00", "13:00"), shift)).toBe(false);
  });
});

describe("momentaryCoverage", () => {
  it("reports the covered hours and remaining window", () => {
    const coverage = momentaryCoverage(caregiver("09:00", "13:00"), shift);
    expect(coverage.coveredUntil).toBe("13:00");
    expect(coverage.hours).toBe(4);
    expect(coverage.remainingFrom).toBe("13:00");
    expect(coverage.remainingUntil).toBe("17:00");
  });

  it("has no remaining window when the caregiver covers the full shift", () => {
    const coverage = momentaryCoverage(caregiver("08:00", "18:00"), shift);
    expect(coverage.remainingFrom).toBeNull();
  });
});
