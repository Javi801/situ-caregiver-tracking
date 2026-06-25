import { describe, expect, it } from "vitest";
import type { Caregiver, Shift, SwapDecisions, SwapProposal } from "@/types";
import {
  acceptedCount,
  deriveSwapStatus,
  findSwapCandidates,
  initialSwapDecisions,
  isSwapOpen,
  isSwapViable,
  rejectedDonorCaregiverIds,
} from "@/lib/swap";

function caregiver(overrides: Partial<Caregiver> = {}): Caregiver {
  return {
    id: "cg",
    name: "Test",
    reliabilityScore: 0.9,
    distanceKm: 4,
    etaMinutes: 20,
    certifications: [],
    availableFrom: "08:00",
    availableUntil: "20:00",
    ...overrides,
  };
}

function shift(overrides: Partial<Shift> = {}): Shift {
  return {
    id: "shift",
    caregiverId: "cg",
    familyId: "fam",
    startsAt: "2026-06-25T09:00:00",
    endsAt: "2026-06-25T17:00:00",
    status: "delay_detected",
    etaMinutes: 40,
    scheduledEtaMinutes: 20,
    ...overrides,
  };
}

function decisions(overrides: Partial<SwapDecisions> = {}): SwapDecisions {
  return { ...initialSwapDecisions(), ...overrides };
}

describe("deriveSwapStatus", () => {
  it("is proposed while any party is still pending", () => {
    expect(deriveSwapStatus(decisions({ caregiverA: "accepted", familyA: "accepted" }))).toBe(
      "proposed",
    );
  });

  it("is accepted only when all four parties accept", () => {
    const all = decisions({
      caregiverA: "accepted",
      caregiverB: "accepted",
      familyA: "accepted",
      familyB: "accepted",
    });
    expect(deriveSwapStatus(all)).toBe("accepted");
    expect(acceptedCount(all)).toBe(4);
  });

  it("is rejected as soon as one party rejects, even if others accepted", () => {
    const mixed = decisions({
      caregiverA: "accepted",
      caregiverB: "accepted",
      familyA: "accepted",
      familyB: "rejected",
    });
    expect(deriveSwapStatus(mixed)).toBe("rejected");
    // A rejection aborts: it does not count toward acceptance progress.
    expect(acceptedCount(mixed)).toBe(3);
  });
});

describe("isSwapViable", () => {
  const shiftA = shift({ id: "a", etaMinutes: 42 });
  const caregiverA = caregiver({ id: "cgA", availableFrom: "08:00", availableUntil: "20:00" });

  it("is viable when B arrives earlier and A can cover the donor shift", () => {
    const shiftB = shift({ id: "b", startsAt: "2026-06-25T12:00:00", endsAt: "2026-06-25T18:00:00" });
    const caregiverB = caregiver({ id: "cgB", etaMinutes: 18 });
    const result = isSwapViable(shiftA, caregiverA, shiftB, caregiverB);
    expect(result).toEqual({ viable: true, newArrivesEarlier: true, originalCoversOther: true });
  });

  it("is not viable when the new caregiver would not arrive earlier", () => {
    const shiftB = shift({ id: "b", startsAt: "2026-06-25T12:00:00", endsAt: "2026-06-25T18:00:00" });
    const caregiverB = caregiver({ id: "cgB", etaMinutes: 50 });
    expect(isSwapViable(shiftA, caregiverA, shiftB, caregiverB).viable).toBe(false);
  });

  it("is not viable when A's availability does not cover the donor shift", () => {
    const shiftB = shift({ id: "b", startsAt: "2026-06-25T06:00:00", endsAt: "2026-06-25T18:00:00" });
    const caregiverB = caregiver({ id: "cgB", etaMinutes: 18 });
    const result = isSwapViable(shiftA, caregiverA, shiftB, caregiverB);
    expect(result.originalCoversOther).toBe(false);
    expect(result.viable).toBe(false);
  });
});

describe("findSwapCandidates", () => {
  const shiftA = shift({ id: "a", caregiverId: "cgA", etaMinutes: 42 });
  const caregiverA = caregiver({ id: "cgA", availableFrom: "08:00", availableUntil: "20:00" });

  it("returns only viable donors, earliest-arriving first, excluding the at-risk shift", () => {
    const donors = [
      { shift: shiftA, caregiver: caregiverA }, // excluded (same shift)
      {
        shift: shift({ id: "b1", startsAt: "2026-06-25T12:00:00", endsAt: "2026-06-25T18:00:00" }),
        caregiver: caregiver({ id: "b1", etaMinutes: 30 }),
      },
      {
        shift: shift({ id: "b2", startsAt: "2026-06-25T12:00:00", endsAt: "2026-06-25T18:00:00" }),
        caregiver: caregiver({ id: "b2", etaMinutes: 12 }),
      },
      {
        // Not viable: A cannot cover a shift starting at 06:00.
        shift: shift({ id: "b3", startsAt: "2026-06-25T06:00:00", endsAt: "2026-06-25T18:00:00" }),
        caregiver: caregiver({ id: "b3", etaMinutes: 10 }),
      },
    ];
    const candidates = findSwapCandidates(shiftA, caregiverA, donors);
    expect(candidates.map((candidate) => candidate.caregiver.id)).toEqual(["b2", "b1"]);
  });
});

describe("isSwapOpen", () => {
  it("is open while proposed or accepted, closed once applied or rejected", () => {
    expect(isSwapOpen("proposed")).toBe(true);
    expect(isSwapOpen("accepted")).toBe(true);
    expect(isSwapOpen("applied")).toBe(false);
    expect(isSwapOpen("rejected")).toBe(false);
  });
});

describe("rejectedDonorCaregiverIds", () => {
  it("collects donor caregivers from rejected swaps for the given shift only", () => {
    const proposals: SwapProposal[] = [
      makeProposal({ id: "p1", shiftAId: "a", caregiverBId: "cgX", status: "rejected" }),
      makeProposal({ id: "p2", shiftAId: "a", caregiverBId: "cgY", status: "applied" }),
      makeProposal({ id: "p3", shiftAId: "other", caregiverBId: "cgZ", status: "rejected" }),
    ];
    expect(rejectedDonorCaregiverIds(proposals, "a")).toEqual(["cgX"]);
  });
});

function makeProposal(overrides: Partial<SwapProposal> = {}): SwapProposal {
  return {
    id: "p",
    shiftAId: "a",
    shiftBId: "b",
    caregiverAId: "cgA",
    caregiverBId: "cgB",
    familyAId: "famA",
    familyBId: "famB",
    decisions: initialSwapDecisions(),
    status: "proposed",
    createdAt: "2026-06-25T08:00:00.000Z",
    resolvedAt: null,
    ...overrides,
  };
}
