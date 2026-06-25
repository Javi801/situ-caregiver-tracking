import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/renderWithProviders";
import { FamilyStatus } from "@/pages/FamilyStatus/FamilyStatus";
import { COPY } from "@/content/copy";
import { proposedSwapDecisions } from "@/lib/swap";

const STORAGE_KEY = "situ.shiftStates.v2";
const SWAP_STORAGE_KEY = "situ.swapProposals.v1";

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
    window.localStorage.clear();
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

    it("only flags the request and locks the buttons — no replacement window — when requesting", async () => {
      const user = userEvent.setup();
      renderWithProviders(<FamilyStatus />);

      await user.click(screen.getByRole("button", { name: COPY.family.requestReplacement }));

      // The family is told operations was notified; it is not asked to pick or confirm anyone.
      expect(screen.getByText(COPY.family.replacementRequestedNote)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: COPY.family.wait })).toBeDisabled();
      expect(screen.getByRole("button", { name: COPY.family.requestReplacement })).toBeDisabled();
    });
  });

  it("shows the accepted state once a replacement is in place", () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        "shift-active": {
          status: "replacement_assigned",
          etaMinutes: 20,
          record: null,
          familyWaitingEtaMinutes: null,
          replacement: { caregiverId: "cg-2", type: "full", coveredUntil: "17:00", originalReassigned: false },
        },
      }),
    );
    renderWithProviders(<FamilyStatus />);

    expect(screen.getByText(COPY.family.replacementAssigned)).toBeInTheDocument();
  });

  it("shows the in-progress state while a rotation awaits confirmation", () => {
    window.localStorage.setItem(
      SWAP_STORAGE_KEY,
      JSON.stringify([
        {
          id: "swap-1",
          shiftAId: "shift-active",
          shiftBId: "shift-ops-yellow",
          caregiverAId: "cg-1",
          caregiverBId: "cg-3",
          familyAId: "fam-1",
          familyBId: "fam-3",
          decisions: proposedSwapDecisions(),
          status: "proposed",
          createdAt: "2026-06-25T08:00:00.000Z",
          resolvedAt: null,
        },
      ]),
    );
    renderWithProviders(<FamilyStatus />);

    expect(screen.getByText(COPY.family.rotationInProgressMessage)).toBeInTheDocument();
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
