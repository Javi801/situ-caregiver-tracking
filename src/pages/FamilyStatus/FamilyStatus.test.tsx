import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/renderWithProviders";
import { FamilyStatus } from "@/pages/FamilyStatus/FamilyStatus";
import { COPY } from "@/content/copy";

describe("FamilyStatus", () => {
  it("shows the on-time message by default with wait and request actions", () => {
    renderWithProviders(<FamilyStatus />);

    expect(screen.getByText(COPY.family.onTimeMessage)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: COPY.family.wait })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: COPY.family.requestReplacement }),
    ).toBeInTheDocument();
  });

  it("confirms when the family chooses to wait", async () => {
    const user = userEvent.setup();
    renderWithProviders(<FamilyStatus />);

    await user.click(screen.getByRole("button", { name: COPY.family.wait }));
    expect(screen.getByText(COPY.family.waitToast)).toBeInTheDocument();
  });
});
