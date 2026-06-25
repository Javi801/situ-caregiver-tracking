import type { ShiftStatus } from "@/types";
import { COPY } from "@/content/copy";

export type BadgeVariant = "success" | "warning" | "danger" | "neutral" | "healthcare";

interface StatusDefinition {
  label: string;
  variant: BadgeVariant;
}

export const STATUS: Record<ShiftStatus, StatusDefinition> = {
  scheduled: { label: COPY.status.scheduled, variant: "neutral" },
  trip_started: { label: COPY.status.trip_started, variant: "healthcare" },
  delay_detected: { label: COPY.status.delay_detected, variant: "warning" },
  replacement_requested: { label: COPY.status.replacement_requested, variant: "warning" },
  replacement_assigned: { label: COPY.status.replacement_assigned, variant: "healthcare" },
  cancelled: { label: COPY.status.cancelled, variant: "danger" },
  arrived: { label: COPY.status.arrived, variant: "success" },
  shift_started: { label: COPY.status.shift_started, variant: "success" },
  completed: { label: COPY.status.completed, variant: "success" },
};

export function getStatusLabel(status: ShiftStatus): string {
  return STATUS[status].label;
}
