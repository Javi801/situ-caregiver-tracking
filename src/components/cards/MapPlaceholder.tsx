import { Navigation } from "lucide-react";
import { COPY } from "@/content/copy";
import { cn } from "@/lib/cn";
import { LOCATION_UPDATE_INTERVAL_MINUTES } from "@/config/constants";
import { BORDER, ICON, MAP_PLACEHOLDER, TEXT } from "@/config/theme";

const { gridColor } = MAP_PLACEHOLDER;

/** Static placeholder standing in for a real map (a non-goal of the prototype). */
export function MapPlaceholder() {
  return (
    <div
      className={cn(
        "relative flex h-44 items-center justify-center overflow-hidden rounded-lg border",
        BORDER.default,
        MAP_PLACEHOLDER.surface,
      )}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />
      <div className={cn("relative flex flex-col items-center gap-2", TEXT.muted)}>
        <Navigation className={cn("h-6 w-6", ICON.accent)} aria-hidden="true" />
        <p className="max-w-xs text-center text-sm">
          {COPY.tracking.updateNote(LOCATION_UPDATE_INTERVAL_MINUTES)}
        </p>
      </div>
    </div>
  );
}
