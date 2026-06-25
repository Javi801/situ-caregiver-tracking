import { STATUS } from "@/config/status";
import { BADGE_VARIANT_CLASSES } from "@/config/theme";
import { cn } from "@/lib/cn";
import type { ShiftStatus } from "@/types";

export function StatusBadge({ status }: { status: ShiftStatus }) {
  const { label, variant } = STATUS[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        BADGE_VARIANT_CLASSES[variant],
      )}
    >
      {label}
    </span>
  );
}
