import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, MapPin } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardBody, CardFooter, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { COPY } from "@/content/copy";
import { ROUTES } from "@/config/routes";
import { useShift } from "@/hooks/shift-context";
import { useToast } from "@/components/feedback/toast-context";
import { getFamily } from "@/data/families";
import { formatTime } from "@/lib/format";
import { cn } from "@/lib/cn";
import { ICON, TEXT } from "@/config/theme";

export function CheckIn() {
  const navigate = useNavigate();
  const { shift, setStatus } = useShift();
  const { notify } = useToast();
  const [checkedIn, setCheckedIn] = useState(shift.status === "shift_started");

  const family = getFamily(shift.familyId);
  const arrivalTime = formatTime(new Date().toISOString());

  function handleCheckIn() {
    setStatus("shift_started");
    setCheckedIn(true);
    notify(COPY.checkIn.toast);
  }

  return (
    <PageShell title={COPY.checkIn.title}>
      <Card>
        <CardHeader title={COPY.checkIn.addressConfirm} description={family?.address} />
        <CardBody className="space-y-3">
          <div className="flex items-center gap-3">
            <MapPin className={cn("h-5 w-5", ICON.accent)} aria-hidden="true" />
            <div>
              <p className={cn("text-xs uppercase tracking-wide", TEXT.subtle)}>
                {COPY.checkIn.arrivalTime}
              </p>
              <p className={cn("text-sm", TEXT.body)}>{arrivalTime}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn("text-sm", TEXT.muted)}>{COPY.caregiver.status}:</span>
            <StatusBadge status={shift.status} />
          </div>
        </CardBody>
        <CardFooter>
          {checkedIn ? (
            <Button onClick={() => navigate(ROUTES.handoff)}>
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              {COPY.handoff.title}
            </Button>
          ) : (
            <Button onClick={handleCheckIn}>{COPY.checkIn.checkIn}</Button>
          )}
        </CardFooter>
      </Card>
    </PageShell>
  );
}
