import { useNavigate } from "react-router-dom";
import { Info } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardBody, CardFooter, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ETAWidget } from "@/components/cards/ETAWidget";
import { COPY } from "@/content/copy";
import { ROUTES } from "@/config/routes";
import { useShift } from "@/hooks/shift-context";
import { useToast } from "@/components/feedback/toast-context";
import { getCaregiver } from "@/data/caregivers";
import { isDelayed } from "@/lib/eta";
import { cn } from "@/lib/cn";
import { FEEDBACK } from "@/config/theme";

export function FamilyStatus() {
  const navigate = useNavigate();
  const { shift, scheduledEtaMinutes, setStatus } = useShift();
  const { notify } = useToast();

  const caregiver = getCaregiver(shift.caregiverId);
  const delayed = isDelayed(scheduledEtaMinutes, shift.etaMinutes);

  function handleWait() {
    notify(COPY.family.waitToast);
  }

  function handleRequestReplacement() {
    setStatus("replacement_requested");
    notify(COPY.family.requestToast);
    navigate(ROUTES.replacement);
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
        </CardBody>
        <CardFooter>
          <Button variant="secondary" onClick={handleWait}>
            {COPY.family.wait}
          </Button>
          <Button onClick={handleRequestReplacement}>{COPY.family.requestReplacement}</Button>
        </CardFooter>
      </Card>
    </PageShell>
  );
}
