import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { COPY } from "@/content/copy";
import { operationsShiftPath } from "@/config/routes";
import { formatTime } from "@/lib/format";
import { cn } from "@/lib/cn";
import { OPS_STATE_ACCENT, OPS_STATE_DOT, OPS_STATE_TEXT, TEXT } from "@/config/theme";
import type { OpsState } from "@/lib/opsState";
import type { Shift } from "@/types";

interface OpsShiftListItemProps {
  shift: Shift;
  opsState: OpsState;
  caregiverName: string;
  familyName: string;
}

/** Operations board row, colored by triage state, linking to the shift profile. */
export function OpsShiftListItem({ shift, opsState, caregiverName, familyName }: OpsShiftListItemProps) {
  return (
    <Link to={operationsShiftPath(shift.id)} className="block focus-visible:outline-none">
      <Card className={cn("transition-shadow hover:shadow-md", OPS_STATE_ACCENT[opsState])}>
        <CardBody className="flex items-center gap-4">
          <span
            className={cn("h-3 w-3 shrink-0 rounded-full", OPS_STATE_DOT[opsState])}
            aria-hidden="true"
          />
          <div className="flex-1">
            <p className={cn("font-semibold", TEXT.heading)}>{familyName}</p>
            <p className={cn("text-sm", TEXT.muted)}>{caregiverName}</p>
            <p className={cn("mt-1 text-sm font-medium", OPS_STATE_TEXT[opsState])}>
              {COPY.operations.stateLabel[opsState]} · {formatTime(shift.startsAt)}
            </p>
          </div>
          <ArrowRight className={cn("h-5 w-5", TEXT.subtle)} aria-hidden="true" />
        </CardBody>
      </Card>
    </Link>
  );
}
