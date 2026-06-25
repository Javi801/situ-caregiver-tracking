import { describe, expect, it } from "vitest";
import { getCaregiverShiftState } from "@/lib/shiftState";

describe("getCaregiverShiftState", () => {
  it("flags a scheduled shift as ready to start", () => {
    expect(getCaregiverShiftState("scheduled", false)).toBe("start");
  });

  it("reports on the way while travelling without delay", () => {
    expect(getCaregiverShiftState("trip_started", false)).toBe("onTheWay");
  });

  it("reports delayed when travelling behind schedule", () => {
    expect(getCaregiverShiftState("trip_started", true)).toBe("delayed");
    expect(getCaregiverShiftState("delay_detected", false)).toBe("delayed");
  });

  it("reports in progress once checked in", () => {
    expect(getCaregiverShiftState("shift_started", false)).toBe("inProgress");
  });

  it("separates a requested replacement (in progress) from an assigned one (confirmed)", () => {
    expect(getCaregiverShiftState("replacement_requested", false)).toBe("replacementRequested");
    expect(getCaregiverShiftState("replacement_assigned", false)).toBe("replacementAssigned");
  });

  it("reports cancelled when the shift was cancelled", () => {
    expect(getCaregiverShiftState("cancelled", false)).toBe("cancelled");
  });

  it("reports done when completed", () => {
    expect(getCaregiverShiftState("completed", false)).toBe("done");
  });
});
