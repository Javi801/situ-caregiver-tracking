import { afterEach, describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ShiftProvider } from "@/hooks/ShiftProvider";
import { ToastProvider } from "@/components/feedback/ToastProvider";
import { OperationsSwap } from "@/pages/Operations/OperationsSwap";
import { ROUTES } from "@/config/routes";
import { COPY } from "@/content/copy";
import { proposedSwapDecisions } from "@/lib/swap";
import type { SwapDecisions, SwapProposal } from "@/types";

const SWAP_STORAGE_KEY = "situ.swapProposals.v1";

function seedProposal(overrides: Partial<SwapProposal> = {}) {
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
    ...overrides,
  };
  window.localStorage.setItem(SWAP_STORAGE_KEY, JSON.stringify([proposal]));
}

const allAccepted: SwapDecisions = {
  caregiverA: "accepted",
  caregiverB: "accepted",
  familyA: "accepted",
  familyB: "accepted",
};

function renderAt(shiftId: string) {
  return render(
    <MemoryRouter initialEntries={[`/operations/shift/${shiftId}/swap`]}>
      <ShiftProvider>
        <ToastProvider>
          <Routes>
            <Route path={ROUTES.operationsSwap} element={<OperationsSwap />} />
            <Route path={ROUTES.operationsReplacement} element={<div>replacement</div>} />
          </Routes>
        </ToastProvider>
      </ShiftProvider>
    </MemoryRouter>,
  );
}

afterEach(() => {
  window.localStorage.clear();
});

describe("OperationsSwap", () => {
  it("proposes a swap with the donor side pre-accepted, and the operator cannot mark parties or apply yet", async () => {
    const user = userEvent.setup();
    renderAt("shift-ops-red");

    expect(screen.getByText(COPY.operationsSwap.pickTitle)).toBeInTheDocument();
    await user.click(screen.getAllByRole("button", { name: COPY.operationsSwap.propose })[0]);

    // Operator sees a read-only request: donor side assumed accepted (2/4), no party controls.
    expect(screen.getByText(COPY.operationsSwap.coordinationTitle)).toBeInTheDocument();
    expect(screen.getByText(COPY.operationsSwap.donorAssumed)).toBeInTheDocument();
    expect(screen.getByText(COPY.operationsSwap.progress(2), { exact: false })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: COPY.operationsSwap.apply })).toBeDisabled();
    // The operator cannot answer on a party's behalf: no accept/decline controls here.
    expect(screen.queryByRole("button", { name: /accept|decline/i })).toBeNull();
  });

  it("lets the operator apply once all four parties have accepted, reassigning both shifts", async () => {
    const user = userEvent.setup();
    seedProposal({ status: "accepted", decisions: allAccepted });
    renderAt("shift-ops-red");

    const apply = screen.getByRole("button", { name: COPY.operationsSwap.apply });
    expect(apply).toBeEnabled();
    await user.click(apply);

    expect(
      screen.getByText(
        COPY.operationsSwap.appliedNote("Antonia Pérez", "Familia Vega", "Daniela Soto", "Familia Castro"),
      ),
    ).toBeInTheDocument();
  });

  it("returns to the picker with a cancellation note and sinks the declined caregiver", () => {
    seedProposal({
      status: "rejected",
      decisions: { ...proposedSwapDecisions(), familyA: "rejected" },
    });
    renderAt("shift-ops-red");

    expect(screen.getByText(COPY.operationsSwap.cancelledNote)).toBeInTheDocument();

    const declinedCard = screen.getByText("Antonia Pérez").closest("div.rounded-lg");
    expect(declinedCard).not.toBeNull();
    expect(
      within(declinedCard as HTMLElement).getByRole("button", { name: COPY.operationsSwap.propose }),
    ).toBeDisabled();
  });
});
