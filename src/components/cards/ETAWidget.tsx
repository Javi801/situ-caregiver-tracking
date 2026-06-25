import { Clock, MapPin } from "lucide-react";
import { COPY } from "@/content/copy";
import { formatDistance, formatMinutes } from "@/lib/format";
import { cn } from "@/lib/cn";
import { SURFACE, TEXT } from "@/config/theme";

interface ETAWidgetProps {
  etaMinutes: number;
  distanceKm?: number;
}

export function ETAWidget({ etaMinutes, distanceKm }: ETAWidgetProps) {
  return (
    <div className="flex gap-4">
      <div className={cn("flex-1 rounded-lg p-4", SURFACE.panel)}>
        <div className={cn("flex items-center gap-2", TEXT.muted)}>
          <Clock className="h-4 w-4" aria-hidden="true" />
          <span className="text-xs font-medium uppercase tracking-wide">{COPY.tracking.eta}</span>
        </div>
        <p className={cn("mt-1 text-2xl font-semibold", TEXT.heading)}>{formatMinutes(etaMinutes)}</p>
      </div>
      {distanceKm !== undefined ? (
        <div className={cn("flex-1 rounded-lg p-4", SURFACE.panel)}>
          <div className={cn("flex items-center gap-2", TEXT.muted)}>
            <MapPin className="h-4 w-4" aria-hidden="true" />
            <span className="text-xs font-medium uppercase tracking-wide">
              {COPY.tracking.distance}
            </span>
          </div>
          <p className={cn("mt-1 text-2xl font-semibold", TEXT.heading)}>{formatDistance(distanceKm)}</p>
        </div>
      ) : null}
    </div>
  );
}
