import { afterEach, describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/renderWithProviders";
import { FamilyDashboard } from "@/pages/FamilyStatus/FamilyDashboard";
import { COPY } from "@/content/copy";
import { PRIMARY_FAMILY_ID } from "@/data/families";
import { getUpcomingFamilyShifts } from "@/data/shifts";
import { FAMILY_UPCOMING_SHIFTS_LIMIT } from "@/config/constants";

const STORAGE_KEY = "situ.shiftStates.v2";

describe("FamilyDashboard", () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  it("lists upcoming shifts (capped) with a records button", () => {
    renderWithProviders(<FamilyDashboard />);

    const expected = Math.min(
      getUpcomingFamilyShifts(PRIMARY_FAMILY_ID).length,
      FAMILY_UPCOMING_SHIFTS_LIMIT,
    );
    const shiftLinks = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("href")?.includes("/family/shift/"));

    expect(shiftLinks.length).toBe(expected);
    expect(screen.getByText(COPY.caregiver.activeBadge)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: COPY.family.viewRecords })).toBeInTheDocument();
  });

  it("marks the active shift as confirmed (not in progress) once a replacement is assigned", () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        "shift-active": {
          status: "replacement_assigned",
          etaMinutes: 20,
          record: null,
          familyWaitingEtaMinutes: null,
          replacement: { caregiverId: "cg-2", type: "momentary", coveredUntil: "13:00", originalReassigned: false },
        },
      }),
    );
    renderWithProviders(<FamilyDashboard />);

    expect(screen.getByText(COPY.caregiver.states.replacementAssigned)).toBeInTheDocument();
    expect(screen.queryByText(COPY.caregiver.states.replacementRequested)).not.toBeInTheDocument();
  });
});
