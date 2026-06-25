import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/renderWithProviders";
import { FamilyStatus } from "@/pages/FamilyStatus/FamilyStatus";
import { COPY } from "@/content/copy";

const STORAGE_KEY = "situ.shiftStates.v2";

function seedDelayed() {
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      "shift-active": {
        status: "delay_detected",
        etaMinutes: 43,
        record: null,
        familyWaitingEtaMinutes: null,
        replacement: null,
      },
    }),
  );
}

describe("FamilyStatus", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("hides wait and replacement actions when the caregiver is on time", () => {
    // Before the arrival window so the report button doesn't show either.
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-25T08:00:00"));
    renderWithProviders(<FamilyStatus />);

    expect(screen.getByText(COPY.family.onTimeMessage)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: COPY.family.wait })).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: COPY.family.requestReplacement }),
    ).not.toBeInTheDocument();
  });

  describe("when the caregiver is delayed", () => {
    beforeEach(seedDelayed);

    it("offers wait, request replacement and fill record actions", () => {
      renderWithProviders(<FamilyStatus />);

      expect(screen.getByText(COPY.family.delayMessage)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: COPY.family.wait })).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: COPY.family.requestReplacement }),
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: COPY.family.fillRecord })).toBeInTheDocument();
    });

    it("confirms when the family chooses to wait", async () => {
      const user = userEvent.setup();
      renderWithProviders(<FamilyStatus />);

      await user.click(screen.getByRole("button", { name: COPY.family.wait }));
      expect(screen.getByText(COPY.family.waitToast)).toBeInTheDocument();
    });
  });

  it("lets the family report a missing caregiver inside the arrival window", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-25T08:50:00"));
    renderWithProviders(<FamilyStatus />);

    expect(
      screen.getByRole("button", { name: COPY.family.reportNotArrived }),
    ).toBeInTheDocument();
  });
});
