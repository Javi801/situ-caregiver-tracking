import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/renderWithProviders";
import { HandoffForm } from "@/pages/HandoffForm/HandoffForm";
import { COPY } from "@/content/copy";

describe("HandoffForm", () => {
  it("renders all handoff fields", () => {
    renderWithProviders(<HandoffForm />);

    expect(screen.getByLabelText(COPY.handoff.sleepQuality)).toBeInTheDocument();
    expect(screen.getByLabelText(COPY.handoff.mood)).toBeInTheDocument();
    expect(screen.getByLabelText(COPY.handoff.medicationChanges)).toBeInTheDocument();
    expect(screen.getByLabelText(COPY.handoff.recentEvents)).toBeInTheDocument();
    expect(screen.getByLabelText(COPY.handoff.notes)).toBeInTheDocument();
  });

  it("submits the handoff and shows the completion message", async () => {
    const user = userEvent.setup();
    renderWithProviders(<HandoffForm />);

    await user.type(screen.getByLabelText(COPY.handoff.sleepQuality), "Good");
    await user.type(screen.getByLabelText(COPY.handoff.mood), "Calm");
    await user.click(screen.getByRole("button", { name: COPY.handoff.finish }));

    expect(screen.getAllByText(COPY.handoff.toast).length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: COPY.common.backToHome })).toBeInTheDocument();
  });
});
