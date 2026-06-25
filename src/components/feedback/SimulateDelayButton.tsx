import { RotateCcw, Zap } from "lucide-react";
import { router } from "@/app/router";
import { COPY } from "@/content/copy";
import { ROUTES } from "@/config/routes";
import { useShift } from "@/hooks/shift-context";
import { useToast } from "@/components/feedback/toast-context";
import { applySimulatedDelay } from "@/lib/eta";
import { cn } from "@/lib/cn";
import { BORDER, SURFACE, TEXT } from "@/config/theme";

/**
 * Demo-only controls available from any screen: simulate a delay on the active
 * shift, and reset the demo back to its initial state on the home screen.
 */
export function SimulateDelayButton() {
  const { shift, setEtaMinutes, setStatus, reset } = useShift();
  const { notify } = useToast();

  function handleSimulate() {
    setEtaMinutes(applySimulatedDelay(shift.etaMinutes));
    setStatus("delay_detected");
    notify(COPY.simulate.toast);
  }

  function handleReset() {
    reset();
    void router.navigate(ROUTES.home);
    notify(COPY.home.resetToast);
  }

  const buttonClass = cn(
    "inline-flex items-center gap-2 rounded-full border border-dashed px-4 py-2 text-sm font-medium shadow-sm",
    BORDER.default,
    SURFACE.card,
    TEXT.muted,
  );

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={handleReset}
        aria-label={COPY.home.reset}
        className={buttonClass}
      >
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        {COPY.home.reset}
      </button>
      <button
        type="button"
        onClick={handleSimulate}
        aria-label={COPY.simulate.ariaLabel}
        className={buttonClass}
      >
        <Zap className="h-4 w-4" aria-hidden="true" />
        {COPY.simulate.delay}
      </button>
    </div>
  );
}
