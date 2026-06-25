import { useCallback, useMemo, useState, type ReactNode } from "react";
import type { Shift, ShiftStatus } from "@/types";
import { getInitialShift } from "@/data/shifts";
import { ShiftContext, type ShiftContextValue } from "@/hooks/shift-context";

export function ShiftProvider({ children }: { children: ReactNode }) {
  const initialShift = useMemo(getInitialShift, []);
  const [shift, setShift] = useState<Shift>(initialShift);
  const [assignedReplacementId, setAssignedReplacementId] = useState<string | null>(null);

  const setStatus = useCallback((status: ShiftStatus) => {
    setShift((current) => ({ ...current, status }));
  }, []);

  const setEtaMinutes = useCallback((etaMinutes: number) => {
    setShift((current) => ({ ...current, etaMinutes }));
  }, []);

  const assignReplacement = useCallback((caregiverId: string) => {
    setAssignedReplacementId(caregiverId);
    setShift((current) => ({ ...current, status: "replacement_assigned" }));
  }, []);

  const reset = useCallback(() => {
    setShift(getInitialShift());
    setAssignedReplacementId(null);
  }, []);

  const value = useMemo<ShiftContextValue>(
    () => ({
      shift,
      scheduledEtaMinutes: initialShift.etaMinutes,
      setStatus,
      setEtaMinutes,
      assignedReplacementId,
      assignReplacement,
      reset,
    }),
    [shift, initialShift.etaMinutes, setStatus, setEtaMinutes, assignedReplacementId, assignReplacement, reset],
  );

  return <ShiftContext.Provider value={value}>{children}</ShiftContext.Provider>;
}
