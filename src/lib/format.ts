import { COPY } from "@/content/copy";

/** Format a number of minutes as a short human label, e.g. "18 min". */
export function formatMinutes(minutes: number): string {
  const rounded = Math.max(0, Math.round(minutes));
  return `${rounded} ${COPY.common.minutesShort}`;
}

/** Format a distance in kilometers, e.g. "3.2 km". */
export function formatDistance(distanceKm: number): string {
  return `${distanceKm.toFixed(1)} ${COPY.common.kmShort}`;
}

/** Format an ISO datetime as a local time label, e.g. "09:00". */
export function formatTime(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return COPY.common.timePlaceholder;
  }
  return date.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" });
}

/** Format an ISO datetime as a local date label, e.g. "Jun 24, 2026". */
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return COPY.common.timePlaceholder;
  }
  return date.toLocaleDateString("es-CL", { year: "numeric", month: "short", day: "numeric" });
}

/** Format a reliability score (0..1) as a percentage label, e.g. "96%". */
export function formatReliability(score: number): string {
  return `${Math.round(score * 100)}%`;
}
