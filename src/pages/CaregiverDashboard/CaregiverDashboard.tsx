import { useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { ShiftListItem } from "@/components/cards/ShiftListItem";
import { Tabs } from "@/components/ui/Tabs";
import { COPY } from "@/content/copy";
import { shiftDetailPath } from "@/config/routes";
import { useShift } from "@/hooks/shift-context";
import { getCaregiver, PRIMARY_CAREGIVER_ID } from "@/data/caregivers";
import { getFamily } from "@/data/families";
import { getCaregiverShifts, isActiveShift } from "@/data/shifts";
import { isDelayed } from "@/lib/eta";
import { getCaregiverShiftState } from "@/lib/shiftState";
import { cn } from "@/lib/cn";
import { TEXT } from "@/config/theme";
import type { Shift } from "@/types";

type ShiftTab = "upcoming" | "completed";

export function CaregiverDashboard() {
  const { shift: activeShift, scheduledEtaMinutes } = useShift();
  const [tab, setTab] = useState<ShiftTab>("upcoming");

  const caregiver = getCaregiver(PRIMARY_CAREGIVER_ID);

  const activeDelayed = isDelayed(scheduledEtaMinutes, activeShift.etaMinutes);
  const activeStateKey = getCaregiverShiftState(activeShift.status, activeDelayed);

  // Resolve each shift's display status (the active one comes from live context).
  const shifts = getCaregiverShifts(PRIMARY_CAREGIVER_ID).map((shift) =>
    isActiveShift(shift.id) ? { ...shift, status: activeShift.status } : shift,
  );

  const completed = shifts.filter((shift) => shift.status === "completed");
  const upcoming = shifts.filter((shift) => shift.status !== "completed");
  const visible = tab === "completed" ? completed : upcoming;

  function renderItem(shift: Shift) {
    const active = isActiveShift(shift.id);
    return (
      <ShiftListItem
        key={shift.id}
        shift={shift}
        href={shiftDetailPath(shift.id)}
        title={getFamily(shift.familyId)?.name ?? ""}
        isActive={active}
        stateKey={active ? activeStateKey : undefined}
      />
    );
  }

  return (
    <PageShell title={COPY.caregiver.shiftsTitle} subtitle={caregiver?.name}>
      <p className={cn("mb-4 text-sm", TEXT.muted)}>{COPY.caregiver.shiftsSubtitle}</p>

      <Tabs
        className="mb-4"
        value={tab}
        onChange={(next) => setTab(next as ShiftTab)}
        tabs={[
          { value: "upcoming", label: COPY.caregiver.tabUpcoming },
          { value: "completed", label: COPY.caregiver.tabCompleted },
        ]}
      />

      {visible.length > 0 ? (
        <div className="space-y-3">{visible.map(renderItem)}</div>
      ) : (
        <p className={cn("text-sm", TEXT.muted)}>{COPY.caregiver.noShifts}</p>
      )}
    </PageShell>
  );
}
