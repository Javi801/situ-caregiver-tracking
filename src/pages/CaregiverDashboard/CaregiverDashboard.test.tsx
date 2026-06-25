import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/renderWithProviders";
import { CaregiverDashboard } from "@/pages/CaregiverDashboard/CaregiverDashboard";
import { COPY } from "@/content/copy";
import { getFamily, PRIMARY_FAMILY_ID } from "@/data/families";
import { getCaregiverShifts } from "@/data/shifts";
import { PRIMARY_CAREGIVER_ID } from "@/data/caregivers";

function shiftLinks() {
  return screen
    .getAllByRole("link")
    .filter((link) => link.getAttribute("href")?.includes("/caregiver/shift/"));
}

describe("CaregiverDashboard", () => {
  it("lists the caregiver's active and upcoming shifts by default", () => {
    renderWithProviders(<CaregiverDashboard />);
    const upcoming = getCaregiverShifts(PRIMARY_CAREGIVER_ID).filter(
      (shift) => shift.status !== "completed",
    );

    expect(screen.getByRole("heading", { name: COPY.caregiver.shiftsTitle })).toBeInTheDocument();
    expect(shiftLinks().length).toBe(upcoming.length);
  });

  it("highlights the active shift with its state and the today badge", () => {
    renderWithProviders(<CaregiverDashboard />);
    const family = getFamily(PRIMARY_FAMILY_ID);

    expect(screen.getByText(COPY.caregiver.activeBadge)).toBeInTheDocument();
    expect(screen.getByText(COPY.caregiver.states.start)).toBeInTheDocument();
    expect(screen.getAllByText(family!.name).length).toBeGreaterThan(0);
  });

  it("shows completed shifts in the completed tab", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CaregiverDashboard />);
    const completed = getCaregiverShifts(PRIMARY_CAREGIVER_ID).filter(
      (shift) => shift.status === "completed",
    );

    await user.click(screen.getByRole("tab", { name: COPY.caregiver.tabCompleted }));
    expect(shiftLinks().length).toBe(completed.length);
  });
});
