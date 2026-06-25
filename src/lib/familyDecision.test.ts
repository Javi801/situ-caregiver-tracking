import { describe, expect, it } from "vitest";
import { getFamilyDecision } from "@/lib/familyDecision";

describe("getFamilyDecision", () => {
  it("reports a requested replacement", () => {
    expect(getFamilyDecision("replacement_requested", null)).toBe("requested");
  });

  it("reports waiting when the family marked a wait time", () => {
    expect(getFamilyDecision("delay_detected", 40)).toBe("waiting");
  });

  it("prefers a requested replacement over a prior wait", () => {
    expect(getFamilyDecision("replacement_requested", 40)).toBe("requested");
  });

  it("is null when the family has not decided", () => {
    expect(getFamilyDecision("delay_detected", null)).toBeNull();
  });
});
