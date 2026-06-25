import { describe, expect, it } from "vitest";
import { applySimulatedDelay, getDelayMinutes, isDelayed } from "@/lib/eta";
import { DELAY_THRESHOLD_MINUTES, SIMULATED_DELAY_MINUTES } from "@/config/constants";

describe("getDelayMinutes", () => {
  it("returns 0 when the current ETA is at or below the scheduled ETA", () => {
    expect(getDelayMinutes(18, 18)).toBe(0);
    expect(getDelayMinutes(18, 12)).toBe(0);
  });

  it("returns the positive difference when running late", () => {
    expect(getDelayMinutes(18, 30)).toBe(12);
  });
});

describe("isDelayed", () => {
  it("is false below the delay threshold", () => {
    expect(isDelayed(18, 18 + DELAY_THRESHOLD_MINUTES - 1)).toBe(false);
  });

  it("is true at or above the delay threshold", () => {
    expect(isDelayed(18, 18 + DELAY_THRESHOLD_MINUTES)).toBe(true);
  });
});

describe("applySimulatedDelay", () => {
  it("adds the simulated delay to the current ETA", () => {
    expect(applySimulatedDelay(18)).toBe(18 + SIMULATED_DELAY_MINUTES);
  });
});
