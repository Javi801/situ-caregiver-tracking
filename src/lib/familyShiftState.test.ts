import { describe, expect, it } from "vitest";
import { getFamilyShiftState, type FamilyShiftStateInput } from "@/lib/familyShiftState";

function input(overrides: Partial<FamilyShiftStateInput> = {}): FamilyShiftStateInput {
  return {
    delayed: false,
    status: "trip_started",
    hasOpenSwap: false,
    hasAssignedReplacement: false,
    ...overrides,
  };
}

describe("getFamilyShiftState", () => {
  it("is ok when on time with nothing pending", () => {
    expect(getFamilyShiftState(input())).toBe("ok");
  });

  it("is late when the caregiver is delayed", () => {
    expect(getFamilyShiftState(input({ delayed: true, status: "delay_detected" }))).toBe("late");
  });

  it("is replacementRequested when the family asked for one (and still looks late)", () => {
    expect(
      getFamilyShiftState(input({ delayed: true, status: "replacement_requested" })),
    ).toBe("replacementRequested");
  });

  it("is replacementInProgress while a rotation awaits confirmation", () => {
    expect(getFamilyShiftState(input({ delayed: true, hasOpenSwap: true }))).toBe(
      "replacementInProgress",
    );
  });

  it("is replacementAccepted once a replacement is in place, regardless of delay", () => {
    expect(
      getFamilyShiftState(
        input({ delayed: true, status: "replacement_assigned", hasAssignedReplacement: true }),
      ),
    ).toBe("replacementAccepted");
  });
});
