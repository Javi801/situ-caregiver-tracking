import { Link } from "react-router-dom";
import { Card, CardBody } from "@/components/ui/Card";
import { COPY } from "@/content/copy";
import { operationsShiftPath } from "@/config/routes";
import { formatDate, formatTime } from "@/lib/format";
import { cn } from "@/lib/cn";
import { OPS_STATE_ACCENT, OPS_STATE_TEXT, TEXT } from "@/config/theme";
import type { OpsState } from "@/lib/opsState";
import type { Shift } from "@/types";

export interface OpsRow {
  shift: Shift;
  opsState: OpsState;
  caregiverName: string;
  familyName: string;
}

function groupByDate(rows: OpsRow[]): Array<{ date: string; rows: OpsRow[] }> {
  const groups = new Map<string, OpsRow[]>();
  for (const row of rows) {
    const key = row.shift.startsAt.slice(0, 10);
    groups.set(key, [...(groups.get(key) ?? []), row]);
  }
  return [...groups.entries()].map(([date, dateRows]) => ({ date, rows: dateRows }));
}

/** Visual calendar: shifts grouped by day, each a colored time block. */
export function OpsCalendar({ rows }: { rows: OpsRow[] }) {
  if (rows.length === 0) {
    return <p className={cn("text-sm", TEXT.muted)}>{COPY.operations.noCalendar}</p>;
  }

  return (
    <div className="space-y-4">
      {groupByDate(rows).map((group) => (
        <Card key={group.date}>
          <CardBody className="space-y-2">
            <p className={cn("text-xs font-semibold uppercase tracking-wide", TEXT.subtle)}>
              {formatDate(`${group.date}T00:00:00`)}
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {group.rows.map((row) => (
                <Link
                  key={row.shift.id}
                  to={operationsShiftPath(row.shift.id)}
                  className={cn(
                    "rounded-lg p-3 transition-shadow hover:shadow-sm focus-visible:outline-none",
                    OPS_STATE_ACCENT[row.opsState],
                  )}
                >
                  <p className={cn("text-sm font-medium", OPS_STATE_TEXT[row.opsState])}>
                    {formatTime(row.shift.startsAt)}–{formatTime(row.shift.endsAt)}
                  </p>
                  <p className={cn("text-sm", TEXT.heading)}>{row.familyName}</p>
                  <p className={cn("text-xs", TEXT.muted)}>{row.caregiverName}</p>
                </Link>
              ))}
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
