import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { BORDER, ICON, INTERACTIVE, SURFACE, TEXT } from "@/config/theme";
import { COPY } from "@/content/copy";
import { TOAST_DURATION_MS } from "@/config/constants";
import { ToastContext } from "@/components/feedback/toast-context";

interface Toast {
  id: number;
  message: string;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextIdRef = useRef(1);
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const notify = useCallback(
    (message: string) => {
      const toastId = nextIdRef.current;
      nextIdRef.current += 1;
      setToasts((current) => [...current, { id: toastId, message }]);
      const timer = setTimeout(() => dismiss(toastId), TOAST_DURATION_MS);
      timersRef.current.set(toastId, timer);
    },
    [dismiss],
  );

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div
        className="fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2"
        role="status"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "flex items-start gap-3 rounded-lg border px-4 py-3 shadow-md",
              BORDER.default,
              SURFACE.card,
            )}
          >
            <CheckCircle2 className={cn("mt-0.5 h-5 w-5 shrink-0", ICON.success)} aria-hidden="true" />
            <p className={cn("flex-1 text-sm", TEXT.label)}>{toast.message}</p>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              className={INTERACTIVE.mutedIcon}
              aria-label={COPY.common.dismissNotification}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
