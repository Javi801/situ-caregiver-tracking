import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { BORDER, SURFACE, TEXT } from "@/config/theme";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-xl border shadow-sm", BORDER.default, SURFACE.card, className)}
      {...props}
    />
  );
}

interface CardHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  className?: string;
}

export function CardHeader({ title, description, className }: CardHeaderProps) {
  return (
    <div className={cn("border-b px-5 py-4", BORDER.subtle, className)}>
      <h2 className={cn("text-lg font-semibold", TEXT.heading)}>{title}</h2>
      {description ? <p className={cn("mt-1 text-sm", TEXT.muted)}>{description}</p> : null}
    </div>
  );
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 py-4", className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-wrap gap-3 border-t px-5 py-4", BORDER.subtle, className)} {...props} />
  );
}
