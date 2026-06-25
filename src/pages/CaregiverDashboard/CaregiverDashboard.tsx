import { useNavigate } from "react-router-dom";
import { Home, User, Clock } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardBody, CardFooter, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { COPY } from "@/content/copy";
import { ROUTES } from "@/config/routes";
import { useShift } from "@/hooks/shift-context";
import { useToast } from "@/components/feedback/toast-context";
import { getCaregiver, PRIMARY_CAREGIVER_ID } from "@/data/caregivers";
import { getFamily } from "@/data/families";
import { formatTime } from "@/lib/format";
import { cn } from "@/lib/cn";
import { TEXT } from "@/config/theme";

export function CaregiverDashboard() {
  const navigate = useNavigate();
  const { shift, setStatus } = useShift();
  const { notify } = useToast();

  const caregiver = getCaregiver(shift.caregiverId) ?? getCaregiver(PRIMARY_CAREGIVER_ID);
  const family = getFamily(shift.familyId);

  function handleStartTrip() {
    setStatus("trip_started");
    notify(COPY.caregiver.tripStartedToast);
    navigate(ROUTES.tracking);
  }

  return (
    <PageShell title={COPY.caregiver.title} subtitle={caregiver?.name}>
      <Card>
        <CardHeader title={family?.name ?? ""} description={family?.address} />
        <CardBody className="space-y-3">
          <DetailRow icon={<User className="h-4 w-4" />} label={COPY.caregiver.olderAdult}>
            {family?.olderAdultName}
          </DetailRow>
          <DetailRow icon={<Home className="h-4 w-4" />} label={COPY.caregiver.address}>
            {family?.address}
          </DetailRow>
          <DetailRow icon={<Clock className="h-4 w-4" />} label={COPY.caregiver.startTime}>
            {formatTime(shift.startsAt)}
          </DetailRow>
          <div className="flex items-center gap-2 pt-1">
            <span className={cn("text-sm", TEXT.muted)}>{COPY.caregiver.status}:</span>
            <StatusBadge status={shift.status} />
          </div>
        </CardBody>
        <CardFooter>
          <Button size="lg" onClick={handleStartTrip}>
            {COPY.caregiver.startTrip}
          </Button>
        </CardFooter>
      </Card>
    </PageShell>
  );
}

function DetailRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className={cn("mt-0.5", TEXT.subtle)} aria-hidden="true">
        {icon}
      </span>
      <div>
        <p className={cn("text-xs uppercase tracking-wide", TEXT.subtle)}>{label}</p>
        <p className={cn("text-sm", TEXT.body)}>{children}</p>
      </div>
    </div>
  );
}
