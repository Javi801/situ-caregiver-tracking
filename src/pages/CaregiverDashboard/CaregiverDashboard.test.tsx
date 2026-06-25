import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/renderWithProviders";
import { CaregiverDashboard } from "@/pages/CaregiverDashboard/CaregiverDashboard";
import { COPY } from "@/content/copy";
import { getFamily, PRIMARY_FAMILY_ID } from "@/data/families";

describe("CaregiverDashboard", () => {
  it("renders today's shift with the family and older adult", () => {
    renderWithProviders(<CaregiverDashboard />);
    const family = getFamily(PRIMARY_FAMILY_ID);

    expect(screen.getByRole("heading", { name: COPY.caregiver.title })).toBeInTheDocument();
    expect(screen.getByText(family!.olderAdultName)).toBeInTheDocument();
    expect(screen.getByText(family!.name)).toBeInTheDocument();
  });

  it("shows the start trip action", () => {
    renderWithProviders(<CaregiverDashboard />);
    expect(screen.getByRole("button", { name: COPY.caregiver.startTrip })).toBeInTheDocument();
  });
});
