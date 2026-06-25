import { describe, expect, it } from "vitest";
import { isWithinArrivalWindow, minutesUntilStart } from "@/lib/arrivalWindow";

const start = "2026-06-25T09:00:00";

describe("minutesUntilStart", () => {
  it("is positive before the shift and negative after", () => {
    expect(minutesUntilStart(start, new Date("2026-06-25T08:50:00"))).toBe(10);
    expect(minutesUntilStart(start, new Date("2026-06-25T09:10:00"))).toBe(-10);
  });
});

describe("isWithinArrivalWindow", () => {
  it("is false well before the window opens", () => {
    expect(isWithinArrivalWindow(start, 15, new Date("2026-06-25T08:30:00"))).toBe(false);
  });

  it("is true inside the 15-minute window before the shift", () => {
    expect(isWithinArrivalWindow(start, 15, new Date("2026-06-25T08:50:00"))).toBe(true);
  });

  it("stays true after the start if the caregiver never arrived", () => {
    expect(isWithinArrivalWindow(start, 15, new Date("2026-06-25T09:05:00"))).toBe(true);
  });
});
