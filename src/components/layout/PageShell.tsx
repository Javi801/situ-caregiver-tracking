import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, HeartPulse } from "lucide-react";
import { ROUTES } from "@/config/routes";
import { COPY } from "@/content/copy";
import { cn } from "@/lib/cn";
import { BORDER, INTERACTIVE, SURFACE, TEXT } from "@/config/theme";

interface PageShellProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  children: ReactNode;
}

export function PageShell({ title, subtitle, showBack = true, children }: PageShellProps) {
  const navigate = useNavigate();

  return (
    <div className={cn("min-h-screen", SURFACE.page)}>
      <header className={cn("border-b", BORDER.default, SURFACE.card)}>
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-3">
          <Link to={ROUTES.home} className={cn("flex items-center gap-2", TEXT.accent)}>
            <HeartPulse className="h-5 w-5" aria-hidden="true" />
            <span className="font-semibold">{COPY.app.name}</span>
          </Link>
          <span className={cn("text-sm", TEXT.subtle)}>/ {COPY.app.tagline}</span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        {showBack ? (
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={cn("mb-4 inline-flex items-center gap-1 text-sm", INTERACTIVE.mutedLink)}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {COPY.common.back}
          </button>
        ) : null}

        <div className="mb-6">
          <h1 className={cn("text-2xl font-semibold", TEXT.heading)}>{title}</h1>
          {subtitle ? <p className={cn("mt-1", TEXT.muted)}>{subtitle}</p> : null}
        </div>

        {children}
      </main>
    </div>
  );
}
