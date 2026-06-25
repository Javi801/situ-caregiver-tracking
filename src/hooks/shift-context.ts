import { createContext, useContext } from "react";
import type { Shift, ShiftStatus } from "@/types";

export interface ShiftContextValue {
  shift: Shift;
  /** The originally scheduled ETA, used as the baseline for delay/risk calculations. */
  scheduledEtaMinutes: number;
  setStatus: (status: ShiftStatus) => void;
  setEtaMinutes: (etaMinutes: number) => void;
  assignedReplacementId: string | null;
  assignReplacement: (caregiverId: string) => void;
  reset: () => void;
}

export const ShiftContext = createContext<ShiftContextValue | null>(null);

export function useShift(): ShiftContextValue {
  const context = useContext(ShiftContext);
  if (!context) {
    throw new Error("useShift must be used within a ShiftProvider");
  }
  return context;
}
