import type { SwapPartyDecision, SwapStatus } from "@/types";

/** Traffic-light palettes for a party's decision (operator coordination view). */
export const SWAP_DECISION_CLASSES: Record<SwapPartyDecision, string> = {
  accepted: "bg-green-100 text-green-800 border-green-200",
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
};

/** Dot colors mirroring the decision palettes. */
export const SWAP_DECISION_DOT: Record<SwapPartyDecision, string> = {
  accepted: "bg-green-500",
  pending: "bg-amber-500",
  rejected: "bg-red-500",
};

/** Short labels for each decision. */
export const SWAP_DECISION_LABEL: Record<SwapPartyDecision, string> = {
  accepted: "Accepted",
  pending: "Awaiting reply",
  rejected: "Declined",
};

/** Labels for the global swap status. */
export const SWAP_STATUS_LABEL: Record<SwapStatus, string> = {
  proposed: "Awaiting responses",
  accepted: "All parties agreed",
  rejected: "Swap cancelled",
  applied: "Swap applied",
};
