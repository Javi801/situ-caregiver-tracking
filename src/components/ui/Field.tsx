import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { TEXT } from "@/config/theme";

interface FieldProps {
  label: string;
  htmlFor: string;
  children: ReactNode;
}

/** Labelled form field wrapper to keep inputs accessible. */
export function Field({ label, htmlFor, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className={cn("text-sm font-medium", TEXT.label)}>
        {label}
      </label>
      {children}
    </div>
  );
}
