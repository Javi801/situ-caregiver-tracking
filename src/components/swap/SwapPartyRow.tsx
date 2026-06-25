import { SWAP_DECISION_CLASSES, SWAP_DECISION_DOT, SWAP_DECISION_LABEL } from "@/config/swap";
import { cn } from "@/lib/cn";
import { BORDER, TEXT } from "@/config/theme";
import type { SwapPartyDecision } from "@/types";

/**
 * One party's row in the operator coordination panel: a read-only traffic-light
 * status (green accepted / amber awaiting / red declined). The operator only
 * observes — each party answers from their own view.
 */
export function SwapPartyRow({
  label,
  moveText,
  decision,
}: {
  label: string;
  moveText: string;
  decision: SwapPartyDecision;
}) {
  return (
    <div className={cn("rounded-lg border p-3", BORDER.default)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <span
            className={cn("mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full", SWAP_DECISION_DOT[decision])}
            aria-hidden="true"
          />
          <div>
            <p className={cn("text-sm font-medium", TEXT.heading)}>{label}</p>
            <p className={cn("text-xs", TEXT.muted)}>{moveText}</p>
          </div>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium",
            SWAP_DECISION_CLASSES[decision],
          )}
        >
          {SWAP_DECISION_LABEL[decision]}
        </span>
      </div>
    </div>
  );
}
