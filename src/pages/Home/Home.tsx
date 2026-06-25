import { Building2, HeartPulse, Users } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { ActorCard } from "@/components/cards/ActorCard";
import { COPY } from "@/content/copy";
import { ROUTES } from "@/config/routes";

export function Home() {
  return (
    <PageShell title={COPY.home.title} subtitle={COPY.home.subtitle} showBack={false}>
      <div className="space-y-3">
        <ActorCard
          to={ROUTES.caregiver}
          icon={<HeartPulse className="h-5 w-5" />}
          title={COPY.home.caregiver.title}
          description={COPY.home.caregiver.description}
        />
        <ActorCard
          to={ROUTES.operations}
          icon={<Building2 className="h-5 w-5" />}
          title={COPY.home.operations.title}
          description={COPY.home.operations.description}
        />
        <ActorCard
          to={ROUTES.family}
          icon={<Users className="h-5 w-5" />}
          title={COPY.home.family.title}
          description={COPY.home.family.description}
        />
      </div>
    </PageShell>
  );
}
