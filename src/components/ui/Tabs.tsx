import { cn } from "@/lib/cn";
import { BORDER, SURFACE, TEXT } from "@/config/theme";

interface TabDefinition {
  value: string;
  label: string;
}

interface TabsProps {
  value: string;
  onChange: (value: string) => void;
  tabs: TabDefinition[];
  className?: string;
}

/** Simple segmented control for switching between lists. */
export function Tabs({ value, onChange, tabs, className }: TabsProps) {
  return (
    <div
      role="tablist"
      className={cn("inline-flex rounded-lg border p-1", BORDER.default, SURFACE.card, className)}
    >
      {tabs.map((tab) => {
        const selected = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.value)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              selected ? cn(SURFACE.accentSoft, TEXT.accent) : TEXT.muted,
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
