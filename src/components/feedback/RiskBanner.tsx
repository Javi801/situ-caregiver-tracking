import { ShieldAlert, ShieldCheck } from "lucide-react";
import { RISK_CLASSES, RISK_LABEL } from "@/config/theme";
import { cn } from "@/lib/cn";
import type { RiskLevel } from "@/types";

export function RiskBanner({ level }: { level: RiskLevel }) {
  const Icon = level === "low" ? ShieldCheck : ShieldAlert;
  return (
    <div
      className={cn("flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium", RISK_CLASSES[level])}
      role="status"
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {RISK_LABEL[level]}
    </div>
  );
}
