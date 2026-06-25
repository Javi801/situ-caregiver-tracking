import { ChevronRight, Repeat } from "lucide-react";
import { COPY } from "@/content/copy";
import { acceptedCount } from "@/lib/swap";
import { cn } from "@/lib/cn";
import { SWAP_DECISION_CLASSES, SWAP_DECISION_DOT } from "@/config/swap";
import { BORDER, ICON, SURFACE, TEXT } from "@/config/theme";
import type { SwapPartyRole, SwapProposal } from "@/types";

const ROLE_ORDER: SwapPartyRole[] = ["caregiverA", "familyA", "caregiverB", "familyB"];

/**
 * Compact, clickable rotation status for the operator's shift profile: one
 * cell per party, colored by its response, opening the full coordination view.
 */
export function SwapStatusSummary({
  proposal,
  onClick,
}: {
  proposal: SwapProposal;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-lg border p-4 text-left transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2",
        BORDER.default,
        SURFACE.panel,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className={cn("flex items-center gap-2 text-sm font-medium", TEXT.heading)}>
          <Repeat className={cn("h-4 w-4", ICON.accent)} aria-hidden="true" />
          {COPY.operationsSwap.summaryTitle}
        </p>
        <span className={cn("flex items-center gap-1 text-xs", TEXT.muted)}>
          {COPY.operationsSwap.summaryHint}
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>

      <p className={cn("mt-1 text-xs", TEXT.muted)}>
        {COPY.operationsSwap.progress(acceptedCount(proposal.decisions))}
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {ROLE_ORDER.map((role) => (
          <div
            key={role}
            className={cn(
              "flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium",
              SWAP_DECISION_CLASSES[proposal.decisions[role]],
            )}
          >
            <span
              className={cn("h-2 w-2 shrink-0 rounded-full", SWAP_DECISION_DOT[proposal.decisions[role]])}
              aria-hidden="true"
            />
            {COPY.operationsSwap.roleLabel[role]}
          </div>
        ))}
      </div>
    </button>
  );
}
