import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { ICON, RING, SURFACE, TEXT } from "@/config/theme";

interface ActorCardProps {
  to: string;
  icon: ReactNode;
  title: string;
  description: string;
}

export function ActorCard({ to, icon, title, description }: ActorCardProps) {
  return (
    <Link to={to} className="block focus-visible:outline-none">
      <Card className={cn("transition-shadow hover:shadow-md focus-within:ring-2", RING.accent)}>
        <CardBody className="flex items-start gap-4">
          <span className={cn("rounded-lg p-3", SURFACE.accentSoft, ICON.accent)} aria-hidden="true">
            {icon}
          </span>
          <div className="flex-1">
            <p className={cn("font-semibold", TEXT.heading)}>{title}</p>
            <p className={cn("mt-1 text-sm", TEXT.muted)}>{description}</p>
          </div>
          <ArrowRight className={cn("mt-1 h-5 w-5", TEXT.subtle)} aria-hidden="true" />
        </CardBody>
      </Card>
    </Link>
  );
}
