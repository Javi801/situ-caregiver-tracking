import { afterEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ShiftProvider } from "@/hooks/ShiftProvider";
import { useShift } from "@/hooks/shift-context";

/** Assigns a replacement to a shift and surfaces the resulting status. */
function Harness({ shiftId }: { shiftId: string }) {
  const { opsAssignReplacement, getShiftState } = useShift();
  return (
    <div>
      <button onClick={() => opsAssignReplacement(shiftId, "cg-2", "momentary", "13:00")}>
        momentary
      </button>
      <button onClick={() => opsAssignReplacement(shiftId, "cg-2", "full", "16:30")}>full</button>
      <span data-testid="status">{getShiftState(shiftId).status}</span>
    </div>
  );
}

afterEach(() => {
  window.localStorage.clear();
});

describe("opsAssignReplacement status", () => {
  it("keeps the shift active (replacement assigned) for a momentary replacement", async () => {
    const user = userEvent.setup();
    render(
      <ShiftProvider>
        <Harness shiftId="shift-ops-red" />
      </ShiftProvider>,
    );

    await user.click(screen.getByRole("button", { name: "momentary" }));
    expect(screen.getByTestId("status")).toHaveTextContent("replacement_assigned");
  });

  it("cancels the original shift for a full replacement", async () => {
    const user = userEvent.setup();
    render(
      <ShiftProvider>
        <Harness shiftId="shift-ops-red" />
      </ShiftProvider>,
    );

    await user.click(screen.getByRole("button", { name: "full" }));
    expect(screen.getByTestId("status")).toHaveTextContent("cancelled");
  });
});
