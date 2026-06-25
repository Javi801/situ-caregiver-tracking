import { Link } from "react-router-dom";
import { ArrowRight, CalendarClock } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { COPY } from "@/content/copy";
import { formatDate, formatTime } from "@/lib/format";
import { cn } from "@/lib/cn";
import { BORDER, RING, SHIFT_STATE_ACCENT, SHIFT_STATE_TEXT, TEXT } from "@/config/theme";
import type { CaregiverShiftState } from "@/lib/shiftState";
import type { Shift } from "@/types";

interface ShiftListItemProps {
  shift: Shift;
  /** Destination when the row is tapped. */
  href: string;
  /** Main label (e.g. family name on the caregiver side, caregiver name on the family side). */
  title: string;
  /** Optional caption shown under the title (e.g. "with María González"). */
  caption?: string;
  isActive: boolean;
  /** Caregiver-facing state, required when the shift is active. */
  stateKey?: CaregiverShiftState;
}

/** A clickable shift row. The active shift is highlighted by its current state. */
export function ShiftListItem({
  shift,
  href,
  title,
  caption,
  isActive,
  stateKey,
}: ShiftListItemProps) {
  return (
    <Link to={href} className="block focus-visible:outline-none">
      <Card
        className={cn(
          "transition-shadow hover:shadow-md focus-within:ring-2",
          RING.accent,
          isActive && stateKey ? cn("border-2", SHIFT_STATE_ACCENT[stateKey]) : BORDER.default,
        )}
      >
        <CardBody className="flex items-center gap-4">
          <span
            className={cn("rounded-lg p-3", isActive ? "bg-white" : "bg-slate-50", TEXT.accent)}
            aria-hidden="true"
          >
            <CalendarClock className="h-5 w-5" />
          </span>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className={cn("font-semibold", TEXT.heading)}>{title}</p>
              {isActive ? (
                <span
                  className={cn(
                    "rounded-full bg-white px-2 py-0.5 text-xs font-medium",
                    SHIFT_STATE_TEXT[stateKey ?? "onTheWay"],
                  )}
                >
                  {COPY.caregiver.activeBadge}
                </span>
              ) : null}
            </div>
            {caption ? <p className={cn("text-sm", TEXT.muted)}>{caption}</p> : null}
            <p className={cn("mt-0.5 text-sm", TEXT.muted)}>
              {formatDate(shift.startsAt)} · {formatTime(shift.startsAt)}
            </p>
            <div className="mt-2">
              {isActive && stateKey ? (
                <span className={cn("text-sm font-medium", SHIFT_STATE_TEXT[stateKey])}>
                  {COPY.caregiver.states[stateKey]}
                </span>
              ) : (
                <StatusBadge status={shift.status} />
              )}
            </div>
          </div>

          <ArrowRight className={cn("h-5 w-5", TEXT.subtle)} aria-hidden="true" />
        </CardBody>
      </Card>
    </Link>
  );
}
