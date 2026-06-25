import { describe, expect, it } from "vitest";
import { getBestReplacement, rankReplacements, scoreCandidate } from "@/lib/replacements";
import type { Caregiver } from "@/types";

const fast: Caregiver = {
  id: "fast",
  name: "Fast & reliable",
  reliabilityScore: 0.95,
  distanceKm: 2,
  etaMinutes: 12,
  certifications: [],
  availableFrom: "08:00",
  availableUntil: "18:00",
};

const slow: Caregiver = {
  id: "slow",
  name: "Slow & far",
  reliabilityScore: 0.8,
  distanceKm: 10,
  etaMinutes: 35,
  certifications: [],
  availableFrom: "10:00",
  availableUntil: "14:00",
};

describe("scoreCandidate", () => {
  it("ranks a faster, closer, more reliable caregiver higher", () => {
    expect(scoreCandidate(fast)).toBeGreaterThan(scoreCandidate(slow));
  });
});

describe("rankReplacements", () => {
  it("orders candidates from best to worst match", () => {
    expect(rankReplacements([slow, fast]).map((c) => c.id)).toEqual(["fast", "slow"]);
  });

  it("does not mutate the input array", () => {
    const input = [slow, fast];
    rankReplacements(input);
    expect(input.map((c) => c.id)).toEqual(["slow", "fast"]);
  });
});

describe("getBestReplacement", () => {
  it("returns the top candidate", () => {
    expect(getBestReplacement([slow, fast])?.id).toBe("fast");
  });

  it("returns undefined when there are no candidates", () => {
    expect(getBestReplacement([])).toBeUndefined();
  });
});
