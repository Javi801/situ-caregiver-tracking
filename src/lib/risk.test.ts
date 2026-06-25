import { describe, expect, it } from "vitest";
import { getRiskLevel } from "@/lib/risk";
import { HIGH_RISK_DELAY_MINUTES, MEDIUM_RISK_DELAY_MINUTES } from "@/config/constants";

describe("getRiskLevel", () => {
  it("is low when on time", () => {
    expect(getRiskLevel(18, 18)).toBe("low");
  });

  it("is medium once the medium threshold is reached", () => {
    expect(getRiskLevel(18, 18 + MEDIUM_RISK_DELAY_MINUTES)).toBe("medium");
  });

  it("is high once the high threshold is reached", () => {
    expect(getRiskLevel(18, 18 + HIGH_RISK_DELAY_MINUTES)).toBe("high");
  });
});
