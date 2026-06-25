import { CheckCircle2, Circle } from "lucide-react";
import { COPY } from "@/content/copy";
import { cn } from "@/lib/cn";
import { ICON, TEXT } from "@/config/theme";
import type { OpsState } from "@/lib/opsState";

interface CheckItem {
  label: string;
  received: boolean;
}

/** Verification checks the platform has sent for the shift, by triage state. */
function getChecks(opsState: OpsState): CheckItem[] {
  const { departureConfirmed, locationShared, arrivalConfirmed } = COPY.operations.checklist;
  switch (opsState) {
    case "ok":
      return [
        { label: departureConfirmed, received: true },
        { label: locationShared, received: true },
        { label: arrivalConfirmed, received: true },
      ];
    case "late":
      return [
        { label: departureConfirmed, received: true },
        { label: locationShared, received: true },
        { label: arrivalConfirmed, received: false },
      ];
    default:
      return [
        { label: departureConfirmed, received: false },
        { label: locationShared, received: false },
        { label: arrivalConfirmed, received: false },
      ];
  }
}

export function VerificationChecklist({ opsState }: { opsState: OpsState }) {
  const checks = getChecks(opsState);
  return (
    <ul className="space-y-2">
      {checks.map((check) => (
        <li key={check.label} className="flex items-center gap-2 text-sm">
          {check.received ? (
            <CheckCircle2 className={cn("h-4 w-4", ICON.success)} aria-hidden="true" />
          ) : (
            <Circle className={cn("h-4 w-4", TEXT.subtle)} aria-hidden="true" />
          )}
          <span className={cn(TEXT.body)}>{check.label}</span>
          <span className={cn("ml-auto text-xs", TEXT.subtle)}>
            {check.received ? COPY.operations.checklist.received : COPY.operations.checklist.pending}
          </span>
        </li>
      ))}
    </ul>
  );
}
