import { useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { Tabs } from "@/components/ui/Tabs";
import { OpsShiftListItem } from "@/components/operations/OpsShiftListItem";
import { OpsCalendar, type OpsRow } from "@/components/operations/OpsCalendar";
import { COPY } from "@/content/copy";
import { useShift } from "@/hooks/shift-context";
import { getCaregiver } from "@/data/caregivers";
import { getFamily } from "@/data/families";
import { getOpsActiveShifts, getOpsUpcomingShifts } from "@/data/shifts";
import { isDelayed } from "@/lib/eta";
import { getOpsState } from "@/lib/opsState";
import { getFamilyDecision } from "@/lib/familyDecision";
import { cn } from "@/lib/cn";
import { TEXT } from "@/config/theme";
import type { Shift } from "@/types";

type OpsTab = "active" | "upcoming" | "calendar";

export function OperationsHome() {
  const { getEffectiveShift, getShiftState } = useShift();
  const [tab, setTab] = useState<OpsTab>("active");

  function enrich(shift: Shift): OpsRow {
    const effective = getEffectiveShift(shift.id) ?? shift;
    const state = getShiftState(shift.id);
    const delayed = isDelayed(shift.scheduledEtaMinutes, effective.etaMinutes);
    const caregiverId = state.replacement?.caregiverId ?? shift.caregiverId;
    return {
      shift: effective,
      opsState: getOpsState(effective.status, delayed),
      caregiverName: getCaregiver(caregiverId)?.name ?? "",
      familyName: getFamily(shift.familyId)?.name ?? "",
      familyDecision: getFamilyDecision(effective.status, state.familyWaitingEtaMinutes),
    };
  }

  const activeRows = getOpsActiveShifts().map(enrich);
  const upcomingRows = getOpsUpcomingShifts().map(enrich);

  function renderList(rows: OpsRow[], emptyText: string) {
    if (rows.length === 0) {
      return <p className={cn("text-sm", TEXT.muted)}>{emptyText}</p>;
    }
    return (
      <div className="space-y-3">
        {rows.map((row) => (
          <OpsShiftListItem
            key={row.shift.id}
            shift={row.shift}
            opsState={row.opsState}
            caregiverName={row.caregiverName}
            familyName={row.familyName}
            familyDecision={row.familyDecision}
          />
        ))}
      </div>
    );
  }

  return (
    <PageShell title={COPY.operations.title} subtitle={COPY.operations.subtitle}>
      <Tabs
        className="mb-4"
        value={tab}
        onChange={(next) => setTab(next as OpsTab)}
        tabs={[
          { value: "active", label: COPY.operations.tabActive },
          { value: "upcoming", label: COPY.operations.tabUpcoming },
          { value: "calendar", label: COPY.operations.tabCalendar },
        ]}
      />

      {tab === "active" ? renderList(activeRows, COPY.operations.noActive) : null}
      {tab === "upcoming" ? renderList(upcomingRows, COPY.operations.noUpcoming) : null}
      {tab === "calendar" ? <OpsCalendar rows={[...activeRows, ...upcomingRows]} /> : null}
    </PageShell>
  );
}
