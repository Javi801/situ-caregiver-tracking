import { afterEach, describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/renderWithProviders";
import { OperationsHome } from "@/pages/Operations/OperationsHome";
import { COPY } from "@/content/copy";

const STORAGE_KEY = "situ.shiftStates.v2";

describe("OperationsHome", () => {
  afterEach(() => {
    window.localStorage.clear();
  });

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

  it("tags an active shift with the family's delay decision", () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        "shift-ops-red": {
          status: "replacement_requested",
          etaMinutes: 42,
          record: null,
          familyWaitingEtaMinutes: null,
          replacement: null,
        },
      }),
    );
    renderWithProviders(<OperationsHome />);

    expect(screen.getByText(COPY.operations.familyDecision.requested)).toBeInTheDocument();
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
