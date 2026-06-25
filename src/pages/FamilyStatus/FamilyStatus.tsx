import { useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2, ClipboardList, Info } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardBody, CardFooter, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ETAWidget } from "@/components/cards/ETAWidget";
import { COPY } from "@/content/copy";
import { ROUTES } from "@/config/routes";
import { HANDOFF_WINDOW_MINUTES } from "@/config/constants";
import { useShift } from "@/hooks/shift-context";
import { useToast } from "@/components/feedback/toast-context";
import { getCaregiver } from "@/data/caregivers";
import { isDelayed } from "@/lib/eta";
import { isWithinArrivalWindow } from "@/lib/arrivalWindow";
import { cn } from "@/lib/cn";
import { FEEDBACK } from "@/config/theme";

export function FamilyStatus() {
  const navigate = useNavigate();
  const {
    shift,
    scheduledEtaMinutes,
    setStatus,
    hasCheckedIn,
    assignedReplacementId,
    markFamilyWaiting,
    record,
  } = useShift();
  const { notify } = useToast();

  const caregiver = getCaregiver(assignedReplacementId ?? shift.caregiverId);
  const delayed = isDelayed(scheduledEtaMinutes, shift.etaMinutes);
  const canReportMissing =
    !hasCheckedIn && isWithinArrivalWindow(shift.startsAt, HANDOFF_WINDOW_MINUTES, new Date());

  function handleWait() {
    markFamilyWaiting(shift.etaMinutes);
    notify(COPY.family.waitToast);
  }

  function handleRequestReplacement() {
    setStatus("replacement_requested");
    notify(COPY.family.requestToast);
    navigate(ROUTES.replacement);
  }

  function handleFillRecord() {
    navigate(ROUTES.handoff, { state: { author: "family" } });
  }

  function handleReportMissing() {
    notify(COPY.family.reportToast);
  }

  return (
    <PageShell title={COPY.family.title}>
      <Card>
        <CardHeader title={COPY.family.currentCaregiver} description={caregiver?.name} />
        <CardBody className="space-y-4">
          <ETAWidget etaMinutes={shift.etaMinutes} distanceKm={caregiver?.distanceKm} />

          <div
            className={cn(
              "flex items-start gap-2 rounded-lg border p-4 text-sm",
              delayed ? FEEDBACK.warning : FEEDBACK.success,
            )}
            role="status"
          >
            <Info className="mt-0.5 h-4 w-4" aria-hidden="true" />
            <p>{delayed ? COPY.family.delayMessage : COPY.family.onTimeMessage}</p>
          </div>

          {assignedReplacementId ? (
            <div
              className={cn("flex items-start gap-2 rounded-lg border p-4 text-sm", FEEDBACK.success)}
              role="status"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4" aria-hidden="true" />
              <p>{COPY.family.replacementAssigned}</p>
            </div>
          ) : null}

          {canReportMissing ? (
            <div
              className={cn("flex items-start gap-2 rounded-lg border p-4 text-sm", FEEDBACK.warning)}
              role="note"
            >
              <AlertCircle className="mt-0.5 h-4 w-4" aria-hidden="true" />
              <p>{COPY.family.reportNote}</p>
            </div>
          ) : null}

          {delayed ? (
            <div
              className={cn("flex items-start gap-2 rounded-lg border p-4 text-sm", FEEDBACK.info)}
              role="note"
            >
              <ClipboardList className="mt-0.5 h-4 w-4" aria-hidden="true" />
              <p>{COPY.family.fillRecordNote}</p>
            </div>
          ) : null}
        </CardBody>
        <CardFooter>
          {canReportMissing ? (
            <Button variant="secondary" onClick={handleReportMissing}>
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
              {COPY.family.reportNotArrived}
            </Button>
          ) : null}

          {delayed ? (
            <>
              <Button variant="secondary" onClick={handleWait}>
                {COPY.family.wait}
              </Button>
              <Button onClick={handleRequestReplacement}>{COPY.family.requestReplacement}</Button>
              {!record ? (
                <Button variant="secondary" onClick={handleFillRecord}>
                  <ClipboardList className="h-4 w-4" aria-hidden="true" />
                  {COPY.family.fillRecord}
                </Button>
              ) : null}
            </>
          ) : null}
        </CardFooter>
      </Card>
    </PageShell>
  );
}
