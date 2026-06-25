import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { ShiftListItem } from "@/components/cards/ShiftListItem";
import { COPY } from "@/content/copy";
import { ROUTES, familyShiftPath } from "@/config/routes";
import { FAMILY_UPCOMING_SHIFTS_LIMIT } from "@/config/constants";
import { useShift } from "@/hooks/shift-context";
import { getCaregiver } from "@/data/caregivers";
import { PRIMARY_FAMILY_ID } from "@/data/families";
import { getUpcomingFamilyShifts, isActiveShift } from "@/data/shifts";
import { isDelayed } from "@/lib/eta";
import { getCaregiverShiftState } from "@/lib/shiftState";

export function FamilyDashboard() {
  const navigate = useNavigate();
  const { shift: activeShift, scheduledEtaMinutes, assignedReplacementId } = useShift();

  const activeDelayed = isDelayed(scheduledEtaMinutes, activeShift.etaMinutes);
  const activeStateKey = getCaregiverShiftState(activeShift.status, activeDelayed);

  const upcoming = getUpcomingFamilyShifts(PRIMARY_FAMILY_ID).slice(0, FAMILY_UPCOMING_SHIFTS_LIMIT);

  return (
    <PageShell title={COPY.family.dashboardTitle} subtitle={COPY.family.dashboardSubtitle}>
      <div className="space-y-3">
        {upcoming.map((shift) => {
          const active = isActiveShift(shift.id);
          const displayShift = active ? { ...shift, status: activeShift.status } : shift;
          const caregiverId = active ? (assignedReplacementId ?? shift.caregiverId) : shift.caregiverId;
          const caregiver = getCaregiver(caregiverId);
          return (
            <ShiftListItem
              key={shift.id}
              shift={displayShift}
              href={familyShiftPath(shift.id)}
              title={COPY.family.withCaregiver(caregiver?.name ?? "")}
              isActive={active}
              stateKey={active ? activeStateKey : undefined}
            />
          );
        })}
      </div>

      <div className="mt-6 flex justify-center">
        <Button variant="secondary" onClick={() => navigate(ROUTES.familyRecords)}>
          <FileText className="h-4 w-4" aria-hidden="true" />
          {COPY.family.viewRecords}
        </Button>
      </div>
    </PageShell>
  );
}
