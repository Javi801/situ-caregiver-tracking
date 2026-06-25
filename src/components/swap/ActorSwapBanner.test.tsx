import { afterEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ShiftProvider } from "@/hooks/ShiftProvider";
import { ToastProvider } from "@/components/feedback/ToastProvider";
import { FamilyShiftDetail } from "@/pages/FamilyStatus/FamilyShiftDetail";
import { FamilyStatus } from "@/pages/FamilyStatus/FamilyStatus";
import { ShiftDetail } from "@/pages/ShiftDetail/ShiftDetail";
import { renderWithProviders } from "@/test/renderWithProviders";
import { ROUTES } from "@/config/routes";
import { COPY } from "@/content/copy";
import { initialSwapDecisions } from "@/lib/swap";
import type { SwapProposal } from "@/types";

const SWAP_STORAGE_KEY = "situ.swapProposals.v1";

function seedProposal(overrides: Partial<SwapProposal> = {}) {
  const proposal: SwapProposal = {
    id: "swap-test",
    shiftAId: "shift-ops-red",
    shiftBId: "shift-ops-yellow",
    caregiverAId: "cg-4",
    caregiverBId: "cg-3",
    familyAId: "fam-4",
    familyBId: "fam-3",
    decisions: initialSwapDecisions(),
    status: "proposed",
    createdAt: "2026-06-25T08:00:00.000Z",
    resolvedAt: null,
    ...overrides,
  };
  window.localStorage.setItem(SWAP_STORAGE_KEY, JSON.stringify([proposal]));
}

function renderFamilyShift(shiftId: string) {
  return render(
    <MemoryRouter initialEntries={[`/family/shift/${shiftId}`]}>
      <ShiftProvider>
        <ToastProvider>
          <Routes>
            <Route path={ROUTES.familyShift} element={<FamilyShiftDetail />} />
          </Routes>
        </ToastProvider>
      </ShiftProvider>
    </MemoryRouter>,
  );
}

function renderCaregiverShift(shiftId: string) {
  return render(
    <MemoryRouter initialEntries={[`/caregiver/shift/${shiftId}`]}>
      <ShiftProvider>
        <ToastProvider>
          <Routes>
            <Route path={ROUTES.shiftDetail} element={<ShiftDetail />} />
          </Routes>
        </ToastProvider>
      </ShiftProvider>
    </MemoryRouter>,
  );
}

afterEach(() => {
  window.localStorage.clear();
});

describe("ActorSwapBanner (family view)", () => {
  it("shows the affected family the new caregiver and records their acceptance", async () => {
    const user = userEvent.setup();
    seedProposal();
    renderFamilyShift("shift-ops-red");

    // Family A is asked to rotate to the proposed new caregiver (cg-3).
    expect(screen.getByText(COPY.swap.familyAPrompt("Antonia Pérez"))).toBeInTheDocument();
    expect(screen.getByText("Antonia Pérez")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: COPY.swap.accept }));

    // After accepting, the banner waits on the remaining parties.
    expect(screen.getByText(COPY.swap.acceptedWaiting)).toBeInTheDocument();
  });

  it("shows the cancellation message once the swap is rejected", () => {
    seedProposal({ status: "rejected", decisions: { ...initialSwapDecisions(), familyB: "rejected" } });
    renderFamilyShift("shift-ops-red");

    expect(screen.getByText(COPY.swap.cancelledMessage)).toBeInTheDocument();
  });
});

describe("ActorSwapBanner (active shift, family monitor)", () => {
  it("surfaces the rotation consult to the affected family on the live shift", () => {
    seedProposal({
      shiftAId: "shift-active",
      caregiverAId: "cg-1",
      familyAId: "fam-1",
    });
    renderWithProviders(<FamilyStatus />);

    expect(screen.getByText(COPY.swap.familyAPrompt("Antonia Pérez"))).toBeInTheDocument();
    expect(screen.getByRole("button", { name: COPY.swap.accept })).toBeInTheDocument();
  });
});

describe("ActorSwapBanner (caregiver view)", () => {
  it("asks the delayed caregiver to cover the other family and shows that shift's details", () => {
    seedProposal();
    renderCaregiverShift("shift-ops-red");

    // Caregiver A is asked whether they can take the donor family's shift.
    expect(screen.getByText(COPY.swap.caregiverAPrompt("Familia Castro"))).toBeInTheDocument();
    // The other home's address is surfaced so they can decide.
    expect(screen.getByText("Pasaje Las Acacias 89, La Reina")).toBeInTheDocument();
  });
});
