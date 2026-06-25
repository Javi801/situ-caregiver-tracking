import { User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { COPY } from "@/content/copy";
import { formatDistance, formatMinutes, formatReliability } from "@/lib/format";
import { cn } from "@/lib/cn";
import { BORDER, ICON, SURFACE, TEXT } from "@/config/theme";
import type { Caregiver } from "@/types";

interface ReplacementCardProps {
  caregiver: Caregiver;
  onAssign?: (caregiver: Caregiver) => void;
  actionLabel?: string;
}

export function ReplacementCard({ caregiver, onAssign, actionLabel }: ReplacementCardProps) {
  const etaLabel = formatMinutes(caregiver.etaMinutes);
  const distanceLabel = formatDistance(caregiver.distanceKm);
  const reliabilityLabel = formatReliability(caregiver.reliabilityScore);
  const matchNote = COPY.replacement.matchNote(etaLabel, distanceLabel, reliabilityLabel);

  return (
    <div className={cn("flex items-center justify-between gap-4 rounded-lg border p-4", BORDER.default)}>
      <div className="flex items-start gap-3">
        <span className={cn("mt-1 rounded-full p-2", SURFACE.accentSoft, ICON.accent)} aria-hidden="true">
          <User className="h-4 w-4" />
        </span>
        <div>
          <p className={cn("font-medium", TEXT.heading)}>{caregiver.name}</p>
          <p className={cn("mt-1 text-sm", TEXT.muted)}>{matchNote}</p>
          <p className={cn("mt-1 text-xs", TEXT.subtle)}>
            {etaLabel} · {distanceLabel} · {reliabilityLabel}
          </p>
        </div>
      </div>
      {onAssign ? (
        <Button variant="secondary" onClick={() => onAssign(caregiver)}>
          {actionLabel ?? COPY.operations.assignReplacement}
        </Button>
      ) : null}
    </div>
  );
}
