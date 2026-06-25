import type { BadgeVariant } from "@/config/status";
import type { RiskLevel } from "@/types";

/**
 * Single source of truth for color-bearing class strings.
 *
 * Components must not hardcode raw Tailwind color utilities (bg-*, text-*,
 * border-*, ring-*). They reference the semantic tokens below instead, so the
 * palette can change in one place. Layout-only utilities (flex, padding,
 * rounded, gap) stay inline in components.
 */

/** Text tones. */
export const TEXT = {
  heading: "text-slate-900",
  body: "text-slate-800",
  label: "text-slate-700",
  muted: "text-slate-500",
  subtle: "text-slate-400",
  accent: "text-cyan-700",
  onAccent: "text-white",
} as const;

/** Background surfaces. */
export const SURFACE = {
  page: "bg-slate-50",
  card: "bg-white",
  panel: "bg-slate-50",
  accentSoft: "bg-cyan-50",
} as const;

/** Borders. */
export const BORDER = {
  default: "border-slate-200",
  subtle: "border-slate-100",
} as const;

/** Focus ring colors (apply the width utility, e.g. focus-visible:ring-2, at the usage site). */
export const RING = {
  accent: "ring-cyan-600",
  neutral: "ring-slate-400",
} as const;

/** Feedback banner palettes (border + background + text together). */
export const FEEDBACK = {
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  success: "border-green-200 bg-green-50 text-green-800",
  info: "border-cyan-200 bg-cyan-50 text-cyan-800",
} as const;

/** Standalone icon accents. */
export const ICON = {
  accent: "text-cyan-700",
  success: "text-green-600",
} as const;

/** Decorative map placeholder (simulated, not a real map). */
export const MAP_PLACEHOLDER = {
  surface: "bg-gradient-to-br from-cyan-50 to-slate-100",
  gridColor: "#cbd5e1",
} as const;

/** Button color palettes by variant (color only; sizing lives in the Button). */
export const BUTTON_VARIANT = {
  primary: "bg-cyan-700 text-white hover:bg-cyan-800 focus-visible:ring-cyan-600",
  secondary:
    "bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 focus-visible:ring-slate-400",
  danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
  ghost: "text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-400",
} as const;

/** Interactive (hover) text colors for secondary controls. */
export const INTERACTIVE = {
  mutedIcon: "text-slate-400 hover:text-slate-600",
  mutedLink: "text-slate-500 hover:text-slate-700",
} as const;

/** Form input color palette. */
export const INPUT_COLORS =
  "border-slate-200 text-slate-900 focus:border-cyan-600 focus:ring-cyan-600";

/** Status badge palettes by semantic variant. */
export const BADGE_VARIANT_CLASSES: Record<BadgeVariant, string> = {
  success: "bg-green-100 text-green-800 border-green-200",
  warning: "bg-amber-100 text-amber-800 border-amber-200",
  danger: "bg-red-100 text-red-800 border-red-200",
  neutral: "bg-slate-100 text-slate-700 border-slate-200",
  healthcare: "bg-cyan-100 text-cyan-800 border-cyan-200",
};

/** Risk banner palettes by level. */
export const RISK_CLASSES: Record<RiskLevel, string> = {
  low: "bg-green-50 text-green-800 border-green-200",
  medium: "bg-amber-50 text-amber-800 border-amber-200",
  high: "bg-red-50 text-red-800 border-red-200",
};

export const RISK_LABEL: Record<RiskLevel, string> = {
  low: "Low risk",
  medium: "Medium risk",
  high: "High risk",
};
