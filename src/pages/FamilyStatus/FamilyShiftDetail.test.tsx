import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ShiftProvider } from "@/hooks/ShiftProvider";
import { ToastProvider } from "@/components/feedback/ToastProvider";
import { FamilyShiftDetail } from "@/pages/FamilyStatus/FamilyShiftDetail";
import { ROUTES } from "@/config/routes";
import { COPY } from "@/content/copy";
import { ACTIVE_SHIFT_ID } from "@/data/shifts";

function renderAt(shiftId: string) {
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

describe("FamilyShiftDetail", () => {
  it("shows info only for a shift that hasn't started", () => {
    renderAt("shift-next-2");
    expect(screen.getByText(COPY.family.infoOnly)).toBeInTheDocument();
    expect(screen.queryByText(COPY.family.currentCaregiver)).not.toBeInTheDocument();
  });

  it("shows the live monitoring view for the active shift", () => {
    renderAt(ACTIVE_SHIFT_ID);
    expect(screen.getByText(COPY.family.currentCaregiver)).toBeInTheDocument();
  });
});
