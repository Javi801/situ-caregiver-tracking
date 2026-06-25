import { useEffect, useId, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { COPY } from "@/content/copy";
import { BORDER, INTERACTIVE, SURFACE, TEXT } from "@/config/theme";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
}

/** Minimal accessible modal dialog with overlay and Escape-to-close. */
export function Dialog({ open, onClose, title, description, children }: DialogProps) {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className={cn("absolute inset-0", SURFACE.scrim)}
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={cn(
          "relative w-full max-w-md rounded-xl border p-5 shadow-lg",
          BORDER.default,
          SURFACE.card,
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={COPY.common.close}
          className={cn("absolute right-4 top-4", INTERACTIVE.mutedIcon)}
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <h2 id={titleId} className={cn("pr-8 text-lg font-semibold", TEXT.heading)}>
          {title}
        </h2>
        {description ? (
          <p id={descriptionId} className={cn("mt-1 text-sm", TEXT.muted)}>
            {description}
          </p>
        ) : null}

        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
