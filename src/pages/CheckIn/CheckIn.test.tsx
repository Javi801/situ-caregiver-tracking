import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/renderWithProviders";
import { CheckIn } from "@/pages/CheckIn/CheckIn";
import { COPY } from "@/content/copy";
import { getStatusLabel } from "@/config/status";

describe("CheckIn", () => {
  it("renders the address confirmation and the check in action", () => {
    renderWithProviders(<CheckIn />);

    expect(screen.getByText(COPY.checkIn.addressConfirm)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: COPY.checkIn.checkIn })).toBeInTheDocument();
  });

  it("checks in, starts the shift and advances to the handoff", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CheckIn />);

    await user.click(screen.getByRole("button", { name: COPY.checkIn.checkIn }));

    expect(screen.getByText(COPY.checkIn.toast)).toBeInTheDocument();
    expect(screen.getByText(getStatusLabel("shift_started"))).toBeInTheDocument();
    expect(screen.getByRole("button", { name: COPY.handoff.title })).toBeInTheDocument();
  });
});
