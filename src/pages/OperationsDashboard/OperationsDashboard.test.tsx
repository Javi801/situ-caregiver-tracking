import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/renderWithProviders";
import { OperationsDashboard } from "@/pages/OperationsDashboard/OperationsDashboard";
import { COPY } from "@/content/copy";
import { getReplacementCandidates, PRIMARY_CAREGIVER_ID } from "@/data/caregivers";

describe("OperationsDashboard", () => {
  it("renders the active shift, risk level and replacement suggestions", () => {
    renderWithProviders(<OperationsDashboard />);

    expect(screen.getByRole("heading", { name: COPY.operations.title })).toBeInTheDocument();
    expect(screen.getByText(COPY.operations.suggestions)).toBeInTheDocument();

    const candidates = getReplacementCandidates(PRIMARY_CAREGIVER_ID);
    expect(screen.getByText(candidates[0].name)).toBeInTheDocument();
  });

  it("offers contact family and assign replacement actions", () => {
    renderWithProviders(<OperationsDashboard />);
    expect(screen.getByRole("button", { name: COPY.operations.contactFamily })).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: COPY.operations.assignReplacement }).length,
    ).toBeGreaterThan(0);
  });
});
