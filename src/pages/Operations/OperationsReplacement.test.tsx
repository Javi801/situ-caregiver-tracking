import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ShiftProvider } from "@/hooks/ShiftProvider";
import { ToastProvider } from "@/components/feedback/ToastProvider";
import { OperationsReplacement } from "@/pages/Operations/OperationsReplacement";
import { ROUTES } from "@/config/routes";
import { COPY } from "@/content/copy";

const STORAGE_KEY = "situ.shiftStates.v2";

function renderAt(shiftId: string) {
  return render(
    <MemoryRouter initialEntries={[`/operations/shift/${shiftId}/replacement`]}>
      <ShiftProvider>
        <ToastProvider>
          <Routes>
            <Route path={ROUTES.operationsReplacement} element={<OperationsReplacement />} />
            <Route path={ROUTES.operationsShift} element={<div>profile</div>} />
          </Routes>
        </ToastProvider>
      </ShiftProvider>
    </MemoryRouter>,
  );
}

describe("OperationsReplacement", () => {
  it("lists candidates and assigns a full-shift replacement", async () => {
    const user = userEvent.setup();
    renderAt("shift-ops-red");

    // Candidates are listed (e.g. Camila covers the full shift).
    expect(screen.getByText("Camila Rojas")).toBeInTheDocument();

    const enabledFull = screen
      .getAllByRole("button", { name: COPY.operationsReplacement.assignFull })
      .find((button) => !button.hasAttribute("disabled"));
    await user.click(enabledFull!);

    expect(screen.getByText(COPY.operationsReplacement.assignedCaregiver)).toBeInTheDocument();
    expect(screen.getByText(COPY.operationsReplacement.fullyReplaced)).toBeInTheDocument();
  });

  it("reassigns the original caregiver to the remaining hours after a momentary replacement", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        "shift-ops-red": {
          status: "cancelled",
          etaMinutes: 14,
          record: null,
          familyWaitingEtaMinutes: null,
          replacement: {
            caregiverId: "cg-3",
            type: "momentary",
            coveredUntil: "13:00",
            originalReassigned: false,
          },
        },
      }),
    );
    renderAt("shift-ops-red");

    expect(screen.getByText(COPY.operationsReplacement.fullyReplaced)).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: COPY.operationsReplacement.changeSchedule }),
    );

    expect(screen.getByText(COPY.operationsReplacement.newShiftBadge)).toBeInTheDocument();
    expect(
      screen.getByText(COPY.operationsReplacement.reassignedNote("13:00", "16:30")),
    ).toBeInTheDocument();
  });
});
