import type { ChangeEvent } from "react";
import { Field } from "@/components/ui/Field";
import { cn } from "@/lib/cn";
import { INPUT_COLORS } from "@/config/theme";

interface HandoffFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  required?: boolean;
}

const inputClasses = cn(
  "w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1",
  INPUT_COLORS,
);

export function HandoffField({
  id,
  label,
  value,
  onChange,
  multiline = false,
  required = false,
}: HandoffFieldProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    onChange(event.target.value);
  }

  return (
    <Field label={label} htmlFor={id}>
      {multiline ? (
        <textarea id={id} value={value} onChange={handleChange} rows={3} className={inputClasses} required={required} />
      ) : (
        <input id={id} type="text" value={value} onChange={handleChange} className={inputClasses} required={required} />
      )}
    </Field>
  );
}
