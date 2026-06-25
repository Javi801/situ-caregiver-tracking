import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ShiftProvider } from "@/hooks/ShiftProvider";
import { ToastProvider } from "@/components/feedback/ToastProvider";
import { ShiftDetail } from "@/pages/ShiftDetail/ShiftDetail";
import { ROUTES } from "@/config/routes";
import { COPY } from "@/content/copy";
import { ACTIVE_SHIFT_ID } from "@/data/shifts";

function renderAt(shiftId: string) {
  return render(
    <MemoryRouter initialEntries={[`/caregiver/shift/${shiftId}`]}>
      <ShiftProvider>
        <ToastProvider>
          <Routes>
            <Route path={ROUTES.shiftDetail} element={<ShiftDetail />} />
            <Route path={ROUTES.handoff} element={<div>handoff page</div>} />
          </Routes>
        </ToastProvider>
      </ShiftProvider>
    </MemoryRouter>,
  );
}

describe("ShiftDetail", () => {
  it("shows an info-only note for a non-active shift", () => {
    renderAt("shift-next-1");
    expect(screen.getByText(COPY.shiftDetail.infoOnly)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: COPY.shiftDetail.medicalRecord }),
    ).not.toBeInTheDocument();
  });

  it("shows both record buttons directly for the active shift", () => {
    renderAt(ACTIVE_SHIFT_ID);
    expect(screen.getByRole("button", { name: COPY.shiftDetail.viewPrevious })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: COPY.shiftDetail.fillCurrent })).toBeInTheDocument();
  });

  it("blocks filling the current record until the caregiver has checked in", async () => {
    const user = userEvent.setup();
    renderAt(ACTIVE_SHIFT_ID);

    await user.click(screen.getByRole("button", { name: COPY.shiftDetail.fillCurrent }));

    expect(screen.getByText(COPY.shiftDetail.notCheckedInToast)).toBeInTheDocument();
  });
});
