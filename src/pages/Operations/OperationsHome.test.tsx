import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/renderWithProviders";
import { OperationsHome } from "@/pages/Operations/OperationsHome";
import { COPY } from "@/content/copy";

describe("OperationsHome", () => {
  it("shows the active board with triage states", () => {
    renderWithProviders(<OperationsHome />);

    expect(screen.getByRole("heading", { name: COPY.operations.title })).toBeInTheDocument();
    // The red mock shift is running late.
    expect(screen.getAllByText(new RegExp(COPY.operations.stateLabel.late)).length).toBeGreaterThan(0);
    // A pending (yellow) shift awaits info.
    expect(
      screen.getAllByText(new RegExp(COPY.operations.stateLabel.pending)).length,
    ).toBeGreaterThan(0);
  });

  it("switches to the upcoming tab", async () => {
    const user = userEvent.setup();
    renderWithProviders(<OperationsHome />);

    await user.click(screen.getByRole("tab", { name: COPY.operations.tabUpcoming }));
    // Upcoming shifts link to operations profiles.
    const links = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("href")?.includes("/operations/shift/"));
    expect(links.length).toBeGreaterThan(0);
  });
});
