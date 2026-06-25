import type { ShiftStatus } from "@/types";

export type BadgeVariant = "success" | "warning" | "danger" | "neutral" | "healthcare";

interface StatusDefinition {
  label: string;
  variant: BadgeVariant;
}

export const STATUS: Record<ShiftStatus, StatusDefinition> = {
  scheduled: { label: "Scheduled", variant: "neutral" },
  trip_started: { label: "Trip started", variant: "healthcare" },
  delay_detected: { label: "Delay detected", variant: "warning" },
  replacement_requested: { label: "Replacement requested", variant: "warning" },
  replacement_assigned: { label: "Replacement assigned", variant: "healthcare" },
  arrived: { label: "Arrived", variant: "success" },
  shift_started: { label: "Shift started", variant: "success" },
  completed: { label: "Completed", variant: "success" },
};

export function getStatusLabel(status: ShiftStatus): string {
  return STATUS[status].label;
}
