import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ShiftCard } from "@/components/cards/ShiftCard";
import { getInitialShift } from "@/data/shifts";
import { getFamily, PRIMARY_FAMILY_ID } from "@/data/families";
import { getStatusLabel } from "@/config/status";

describe("ShiftCard", () => {
  it("renders the family, older adult and current status", () => {
    const shift = getInitialShift();
    const family = getFamily(PRIMARY_FAMILY_ID);
    render(<ShiftCard shift={shift} family={family} />);

    expect(screen.getByRole("heading", { name: family!.name })).toBeInTheDocument();
    expect(screen.getByText(family!.olderAdultName)).toBeInTheDocument();
    expect(screen.getByText(getStatusLabel(shift.status))).toBeInTheDocument();
  });

  it("renders the optional footer action when provided", () => {
    const shift = getInitialShift();
    render(<ShiftCard shift={shift} footer={<button type="button">Action</button>} />);

    expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
  });
});
