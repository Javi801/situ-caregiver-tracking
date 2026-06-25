import { describe, expect, it } from "vitest";
import { getOpsState } from "@/lib/opsState";

describe("getOpsState", () => {
  it("flags scheduled shifts as pending information", () => {
    expect(getOpsState("scheduled", false)).toBe("pending");
  });

  it("flags delayed and managed shifts as late", () => {
    expect(getOpsState("delay_detected", false)).toBe("late");
    expect(getOpsState("replacement_requested", false)).toBe("late");
    expect(getOpsState("trip_started", true)).toBe("late");
  });

  it("flags on-track and covered shifts as ok", () => {
    expect(getOpsState("trip_started", false)).toBe("ok");
    expect(getOpsState("shift_started", false)).toBe("ok");
    expect(getOpsState("cancelled", false)).toBe("ok");
  });
});
