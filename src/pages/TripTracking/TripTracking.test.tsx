import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/renderWithProviders";
import { TripTracking } from "@/pages/TripTracking/TripTracking";
import { COPY } from "@/content/copy";
import { getStatusLabel } from "@/config/status";
import { applySimulatedDelay } from "@/lib/eta";
import { formatMinutes } from "@/lib/format";
import { getInitialShift } from "@/data/shifts";

describe("TripTracking", () => {
  it("shows the current ETA and no delay warning initially", () => {
    renderWithProviders(<TripTracking />);
    const shift = getInitialShift();

    expect(screen.getByText(COPY.tracking.eta)).toBeInTheDocument();
    expect(screen.getByText(formatMinutes(shift.etaMinutes))).toBeInTheDocument();
    expect(screen.queryByText(COPY.delay.warning)).not.toBeInTheDocument();
  });

  it("reports running late: updates the ETA, flags the status and notifies", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TripTracking />);
    const shift = getInitialShift();

    await user.click(screen.getByRole("button", { name: COPY.tracking.reportLate }));

    expect(screen.getByText(COPY.delay.warning)).toBeInTheDocument();
    expect(screen.getByText(COPY.tracking.reportLateToast)).toBeInTheDocument();
    expect(
      screen.getByText(formatMinutes(applySimulatedDelay(shift.etaMinutes))),
    ).toBeInTheDocument();
    expect(screen.getByText(getStatusLabel("delay_detected"))).toBeInTheDocument();
  });

  it("opens the demo location dialog and reports on time without a delay", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TripTracking />);

    await user.click(screen.getByRole("button", { name: COPY.tracking.shareLocation }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: COPY.tracking.locationDialog.onTime }),
    );

    expect(screen.getByText(COPY.tracking.onTimeToast)).toBeInTheDocument();
    expect(screen.queryByText(COPY.delay.warning)).not.toBeInTheDocument();
  });

  it("reports running late from the location dialog", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TripTracking />);

    await user.click(screen.getByRole("button", { name: COPY.tracking.shareLocation }));
    await user.click(
      screen.getByRole("button", { name: COPY.tracking.locationDialog.runningLate }),
    );

    expect(screen.getByText(COPY.delay.warning)).toBeInTheDocument();
  });

  it("shows the family's decision to wait when delayed", () => {
    window.localStorage.setItem(
      "situ.shiftStates.v2",
      JSON.stringify({
        "shift-active": {
          status: "delay_detected",
          etaMinutes: 43,
          record: null,
          familyWaitingEtaMinutes: 43,
          replacement: null,
        },
      }),
    );
    renderWithProviders(<TripTracking />);

    expect(screen.getByText(COPY.tracking.familyWaiting)).toBeInTheDocument();
  });
});
