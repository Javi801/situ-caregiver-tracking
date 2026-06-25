import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, BellRing, CheckCircle2, Clock4, Hourglass, MapPin } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardBody, CardFooter, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ETAWidget } from "@/components/cards/ETAWidget";
import { MapPlaceholder } from "@/components/cards/MapPlaceholder";
import { COPY } from "@/content/copy";
import { ROUTES } from "@/config/routes";
import { useShift } from "@/hooks/shift-context";
import { useToast } from "@/components/feedback/toast-context";
import { getCaregiver } from "@/data/caregivers";
import { applySimulatedDelay, isDelayed } from "@/lib/eta";
import { cn } from "@/lib/cn";
import { FEEDBACK } from "@/config/theme";

export function TripTracking() {
  const navigate = useNavigate();
  const { shift, scheduledEtaMinutes, setStatus, setEtaMinutes, familyWaitingEtaMinutes } =
    useShift();
  const { notify } = useToast();
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);

  const caregiver = getCaregiver(shift.caregiverId);
  const delayed = isDelayed(scheduledEtaMinutes, shift.etaMinutes);
  // The family's decision to wait stands until a further delay invalidates it.
  const familyIsWaiting =
    delayed && familyWaitingEtaMinutes !== null && shift.etaMinutes <= familyWaitingEtaMinutes;

  function reportOnTime() {
    setLocationDialogOpen(false);
    if (shift.status === "scheduled") {
      setStatus("trip_started");
    }
    setEtaMinutes(scheduledEtaMinutes);
    notify(COPY.tracking.onTimeToast);
  }

  function reportRunningLate() {
    setLocationDialogOpen(false);
    setEtaMinutes(applySimulatedDelay(shift.etaMinutes));
    setStatus("delay_detected");
    notify(COPY.tracking.reportLateToast);
  }

  function handleReportLate() {
    setEtaMinutes(applySimulatedDelay(shift.etaMinutes));
    setStatus("delay_detected");
    notify(COPY.tracking.reportLateToast);
  }

  function handleCheckIn() {
    navigate(ROUTES.checkIn);
  }

  return (
    <PageShell title={COPY.tracking.title} subtitle={caregiver?.name}>
      <Card>
        <CardHeader
          title={
            <span className="flex items-center gap-3">
              {COPY.tracking.status}
              <StatusBadge status={shift.status} />
            </span>
          }
        />
        <CardBody className="space-y-4">
          <ETAWidget etaMinutes={shift.etaMinutes} distanceKm={caregiver?.distanceKm} />
          <MapPlaceholder />

          {delayed ? (
            <div className={cn("space-y-2 rounded-lg border p-4", FEEDBACK.warning)} role="alert">
              <p className="flex items-center gap-2 font-medium">
                <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                {COPY.delay.warning}
              </p>
              <p className="flex items-center gap-2 text-sm">
                <BellRing className="h-4 w-4" aria-hidden="true" />
                {COPY.delay.operationsNotified} {COPY.delay.familyNotified}
              </p>
            </div>
          ) : null}

          {familyIsWaiting ? (
            <div
              className={cn("flex items-start gap-2 rounded-lg border p-4 text-sm", FEEDBACK.info)}
              role="status"
            >
              <Hourglass className="mt-0.5 h-4 w-4" aria-hidden="true" />
              <p>{COPY.tracking.familyWaiting}</p>
            </div>
          ) : null}
        </CardBody>
        <CardFooter>
          <Button variant="secondary" onClick={() => setLocationDialogOpen(true)}>
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {COPY.tracking.shareLocation}
          </Button>
          <Button variant="secondary" onClick={handleReportLate}>
            <Clock4 className="h-4 w-4" aria-hidden="true" />
            {COPY.tracking.reportLate}
          </Button>
          <Button onClick={handleCheckIn}>{COPY.tracking.checkIn}</Button>
        </CardFooter>
      </Card>

      <Dialog
        open={locationDialogOpen}
        onClose={() => setLocationDialogOpen(false)}
        title={COPY.tracking.locationDialog.title}
        description={COPY.tracking.locationDialog.description}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button variant="secondary" className="flex-1" onClick={reportOnTime}>
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            {COPY.tracking.locationDialog.onTime}
          </Button>
          <Button variant="secondary" className="flex-1" onClick={reportRunningLate}>
            <Clock4 className="h-4 w-4" aria-hidden="true" />
            {COPY.tracking.locationDialog.runningLate}
          </Button>
        </div>
      </Dialog>
    </PageShell>
  );
}
