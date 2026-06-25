import { useNavigate } from "react-router-dom";
import { AlertTriangle, BellRing } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardBody, CardFooter, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
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
  const { shift, scheduledEtaMinutes, setStatus, setEtaMinutes } = useShift();
  const { notify } = useToast();

  const caregiver = getCaregiver(shift.caregiverId);
  const delayed = isDelayed(scheduledEtaMinutes, shift.etaMinutes);

  function handleSimulateDelay() {
    setEtaMinutes(applySimulatedDelay(shift.etaMinutes));
    setStatus("delay_detected");
    notify(COPY.tracking.delayToast);
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
        </CardBody>
        <CardFooter>
          <Button variant="secondary" onClick={handleSimulateDelay}>
            {COPY.tracking.simulateDelay}
          </Button>
          <Button onClick={handleCheckIn}>{COPY.tracking.checkIn}</Button>
        </CardFooter>
      </Card>
    </PageShell>
  );
}
