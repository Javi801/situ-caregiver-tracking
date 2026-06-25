import type { ReactNode } from "react";
import { Clock, Home, User } from "lucide-react";
import { Card, CardBody, CardFooter, CardHeader } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { COPY } from "@/content/copy";
import { formatTime } from "@/lib/format";
import { cn } from "@/lib/cn";
import { TEXT } from "@/config/theme";
import type { Family, Shift } from "@/types";

interface ShiftCardProps {
  shift: Shift;
  family?: Family;
  /** Optional action area rendered in the card footer (e.g. a primary button). */
  footer?: ReactNode;
}

/** Reusable summary of a shift: family, older adult, address, start time and status. */
export function ShiftCard({ shift, family, footer }: ShiftCardProps) {
  return (
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
      {footer ? <CardFooter>{footer}</CardFooter> : null}
    </Card>
  );
}

function DetailRow({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
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
