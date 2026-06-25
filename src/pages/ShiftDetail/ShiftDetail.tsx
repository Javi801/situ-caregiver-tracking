import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ClipboardList, FileText, Info } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ShiftCard } from "@/components/cards/ShiftCard";
import { MedicalRecordView } from "@/components/cards/MedicalRecordView";
import { COPY } from "@/content/copy";
import { ROUTES } from "@/config/routes";
import { useShift } from "@/hooks/shift-context";
import { useToast } from "@/components/feedback/toast-context";
import { getFamily } from "@/data/families";
import { getShift, isActiveShift } from "@/data/shifts";
import { getPreviousRecords } from "@/data/records";
import { cn } from "@/lib/cn";
import { FEEDBACK, ICON, TEXT } from "@/config/theme";
import type { ShiftStatus } from "@/types";

const TRIP_IN_PROGRESS_STATUSES: ShiftStatus[] = [
  "trip_started",
  "delay_detected",
  "replacement_requested",
  "replacement_assigned",
  "arrived",
];

export function ShiftDetail() {
  const { shiftId = "" } = useParams();
  const navigate = useNavigate();
  const { shift: activeShift, setStatus, hasCheckedIn, record } = useShift();
  const { notify } = useToast();

  const [previousOpen, setPreviousOpen] = useState(false);

  const dataShift = getShift(shiftId);
  const active = isActiveShift(shiftId);

  if (!dataShift) {
    return (
      <PageShell title={COPY.shiftDetail.title}>
        <Card>
          <CardBody className="space-y-3 py-8 text-center">
            <p className={cn("text-sm", TEXT.muted)}>{COPY.shiftDetail.infoOnly}</p>
            <Button variant="secondary" onClick={() => navigate(ROUTES.caregiver)}>
              {COPY.common.back}
            </Button>
          </CardBody>
        </Card>
      </PageShell>
    );
  }

  // The active shift's live status comes from context, not the static mock.
  const shift = active ? { ...dataShift, status: activeShift.status } : dataShift;
  const family = getFamily(shift.familyId);
  const previousRecords = getPreviousRecords(shiftId);

  function handleStartTrip() {
    setStatus("trip_started");
    notify(COPY.caregiver.tripStartedToast);
    navigate(ROUTES.tracking);
  }

  function handleFillCurrent() {
    if (!hasCheckedIn) {
      notify(COPY.shiftDetail.notCheckedInToast);
      return;
    }
    navigate(ROUTES.handoff);
  }

  const primaryAction =
    shift.status === "scheduled"
      ? { label: COPY.shiftDetail.startTrip, onClick: handleStartTrip }
      : TRIP_IN_PROGRESS_STATUSES.includes(shift.status)
        ? { label: COPY.shiftDetail.goToTrip, onClick: () => navigate(ROUTES.tracking) }
        : null;

  return (
    <PageShell title={COPY.shiftDetail.title} subtitle={family?.name}>
      <div className="space-y-4">
        <ShiftCard
          shift={shift}
          family={family}
          footer={
            active && primaryAction ? (
              <Button onClick={primaryAction.onClick}>{primaryAction.label}</Button>
            ) : undefined
          }
        />

        {!active ? (
          <div
            className={cn("flex items-start gap-2 rounded-lg border p-4 text-sm", FEEDBACK.info)}
            role="note"
          >
            <Info className="mt-0.5 h-4 w-4" aria-hidden="true" />
            <p>{COPY.shiftDetail.infoOnly}</p>
          </div>
        ) : null}

        {active && shift.status === "cancelled" ? (
          <div
            className={cn("flex items-start gap-2 rounded-lg border p-4 text-sm", FEEDBACK.danger)}
            role="note"
          >
            <Info className="mt-0.5 h-4 w-4" aria-hidden="true" />
            <p>{COPY.shiftDetail.cancelledNote}</p>
          </div>
        ) : null}

        {active && shift.status !== "cancelled" ? (
          <Card>
            <CardHeader title={COPY.shiftDetail.medicalRecord} />
            <CardBody className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" onClick={() => setPreviousOpen((open) => !open)}>
                  <FileText className="h-4 w-4" aria-hidden="true" />
                  {previousOpen ? COPY.shiftDetail.hidePrevious : COPY.shiftDetail.viewPrevious}
                </Button>
                {!record ? (
                  <Button onClick={handleFillCurrent}>{COPY.shiftDetail.fillCurrent}</Button>
                ) : null}
              </div>

              {previousOpen ? (
                <div className="space-y-3">
                  {previousRecords.length > 0 ? (
                    previousRecords.map((previous) => (
                      <MedicalRecordView key={previous.id} record={previous} />
                    ))
                  ) : (
                    <p className={cn("text-sm", TEXT.muted)}>{COPY.shiftDetail.noPrevious}</p>
                  )}
                </div>
              ) : null}

              {record ? (
                <div className="space-y-2">
                  <p className={cn("flex items-center gap-2 text-sm font-medium", ICON.success)}>
                    <ClipboardList className="h-4 w-4" aria-hidden="true" />
                    {COPY.shiftDetail.currentRecord}
                  </p>
                  <MedicalRecordView record={record} />
                </div>
              ) : null}
            </CardBody>
          </Card>
        ) : null}
      </div>
    </PageShell>
  );
}
