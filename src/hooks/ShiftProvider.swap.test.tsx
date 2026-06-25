import { afterEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ShiftProvider } from "@/hooks/ShiftProvider";
import { useShift } from "@/hooks/shift-context";
import { SWAP_PARTY_ROLES } from "@/lib/swap";

/** Drives the provider's swap lifecycle and surfaces the resulting state. */
function Harness() {
  const { proposeSwap, setSwapDecision, applySwap, getShiftState, swapProposals } = useShift();
  const proposal = swapProposals[0] ?? null;

  return (
    <div>
      <button onClick={() => proposeSwap("shift-ops-red", "shift-ops-yellow")}>propose</button>
      <button
        onClick={() =>
          proposal && SWAP_PARTY_ROLES.forEach((role) => setSwapDecision(proposal.id, role, "accepted"))
        }
      >
        accept-all
      </button>
      <button onClick={() => proposal && setSwapDecision(proposal.id, "familyA", "rejected")}>
        decline-one
      </button>
      <button onClick={() => proposal && applySwap(proposal.id)}>apply</button>
      <span data-testid="status">{proposal?.status ?? "none"}</span>
      <span data-testid="shiftA-caregiver">
        {getShiftState("shift-ops-red").replacement?.caregiverId ?? "none"}
      </span>
      <span data-testid="shiftB-caregiver">
        {getShiftState("shift-ops-yellow").replacement?.caregiverId ?? "none"}
      </span>
    </div>
  );
}

afterEach(() => {
  window.localStorage.clear();
});

describe("ShiftProvider swap lifecycle", () => {
  it("reassigns each caregiver to the other shift when an accepted swap is applied", async () => {
    const user = userEvent.setup();
    render(
      <ShiftProvider>
        <Harness />
      </ShiftProvider>,
    );

    await user.click(screen.getByRole("button", { name: "propose" }));
    expect(screen.getByTestId("status")).toHaveTextContent("proposed");

    await user.click(screen.getByRole("button", { name: "accept-all" }));
    expect(screen.getByTestId("status")).toHaveTextContent("accepted");
    // Not applied yet: shifts keep their original caregivers until the operator applies.
    expect(screen.getByTestId("shiftA-caregiver")).toHaveTextContent("none");

    await user.click(screen.getByRole("button", { name: "apply" }));
    expect(screen.getByTestId("status")).toHaveTextContent("applied");
    // shift A (red, cg-4) now covered by the donor caregiver cg-3; donor shift B by cg-4.
    expect(screen.getByTestId("shiftA-caregiver")).toHaveTextContent("cg-3");
    expect(screen.getByTestId("shiftB-caregiver")).toHaveTextContent("cg-4");
  });

  it("does not apply or reassign when a party declines", async () => {
    const user = userEvent.setup();
    render(
      <ShiftProvider>
        <Harness />
      </ShiftProvider>,
    );

    await user.click(screen.getByRole("button", { name: "propose" }));
    await user.click(screen.getByRole("button", { name: "decline-one" }));
    expect(screen.getByTestId("status")).toHaveTextContent("rejected");

    // applySwap is a guarded no-op unless the proposal is accepted.
    await user.click(screen.getByRole("button", { name: "apply" }));
    expect(screen.getByTestId("status")).toHaveTextContent("rejected");
    expect(screen.getByTestId("shiftA-caregiver")).toHaveTextContent("none");
    expect(screen.getByTestId("shiftB-caregiver")).toHaveTextContent("none");
  });
});
