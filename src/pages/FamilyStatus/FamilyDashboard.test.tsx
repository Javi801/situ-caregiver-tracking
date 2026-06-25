import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/renderWithProviders";
import { FamilyDashboard } from "@/pages/FamilyStatus/FamilyDashboard";
import { COPY } from "@/content/copy";
import { PRIMARY_FAMILY_ID } from "@/data/families";
import { getUpcomingFamilyShifts } from "@/data/shifts";
import { FAMILY_UPCOMING_SHIFTS_LIMIT } from "@/config/constants";

describe("FamilyDashboard", () => {
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
});
