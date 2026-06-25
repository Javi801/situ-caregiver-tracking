import { afterEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ShiftProvider } from "@/hooks/ShiftProvider";
import { ToastProvider } from "@/components/feedback/ToastProvider";
import { OperationsShiftProfile } from "@/pages/Operations/OperationsShiftProfile";
import { ROUTES } from "@/config/routes";
import { COPY } from "@/content/copy";
import { proposedSwapDecisions } from "@/lib/swap";
import type { SwapProposal } from "@/types";

const SWAP_STORAGE_KEY = "situ.swapProposals.v1";

function seedOpenSwap() {
  const proposal: SwapProposal = {
    id: "swap-seed",
    shiftAId: "shift-ops-red",
    shiftBId: "shift-ops-yellow",
    caregiverAId: "cg-4",
    caregiverBId: "cg-3",
    familyAId: "fam-4",
    familyBId: "fam-3",
    decisions: proposedSwapDecisions(),
    status: "proposed",
    createdAt: "2026-06-25T08:00:00.000Z",
    resolvedAt: null,
  };
  window.localStorage.setItem(SWAP_STORAGE_KEY, JSON.stringify([proposal]));
}

function renderAt(shiftId: string) {
  return render(
    <MemoryRouter initialEntries={[`/operations/shift/${shiftId}`]}>
      <ShiftProvider>
        <ToastProvider>
          <Routes>
            <Route path={ROUTES.operationsShift} element={<OperationsShiftProfile />} />
            <Route path={ROUTES.operationsSwap} element={<div>swap screen</div>} />
          </Routes>
        </ToastProvider>
      </ShiftProvider>
    </MemoryRouter>,
  );
}

afterEach(() => {
  window.localStorage.clear();
});

describe("OperationsShiftProfile rotation summary", () => {
  it("shows the rotation status and opens the coordination view when clicked", async () => {
    const user = userEvent.setup();
    seedOpenSwap();
    renderAt("shift-ops-red");

    const summary = screen.getByRole("button", {
      name: new RegExp(COPY.operationsSwap.summaryTitle),
    });
    expect(summary).toBeInTheDocument();

    await user.click(summary);
    expect(screen.getByText("swap screen")).toBeInTheDocument();
  });

  it("does not show a rotation summary when there is no swap", () => {
    renderAt("shift-ops-red");
    expect(
      screen.queryByRole("button", { name: new RegExp(COPY.operationsSwap.summaryTitle) }),
    ).toBeNull();
  });
});
