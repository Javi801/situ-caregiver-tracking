import { PageShell } from "@/components/layout/PageShell";
import { Card, CardBody, CardFooter, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ETAWidget } from "@/components/cards/ETAWidget";
import { RiskBanner } from "@/components/feedback/RiskBanner";
import { ReplacementCard } from "@/components/cards/ReplacementCard";
import { COPY } from "@/content/copy";
import { useShift } from "@/hooks/shift-context";
import { useToast } from "@/components/feedback/toast-context";
import { getReplacementCandidates } from "@/data/caregivers";
import { getRiskLevel } from "@/lib/risk";
import { rankReplacements } from "@/lib/replacements";
import { cn } from "@/lib/cn";
import { TEXT } from "@/config/theme";
import type { Caregiver } from "@/types";

export function OperationsDashboard() {
  const { shift, scheduledEtaMinutes, assignReplacement } = useShift();
  const { notify } = useToast();

  const riskLevel = getRiskLevel(scheduledEtaMinutes, shift.etaMinutes);
  const candidates = rankReplacements(getReplacementCandidates(shift.caregiverId));

  function handleAssign(caregiver: Caregiver) {
    assignReplacement(caregiver.id);
    notify(COPY.operations.assignedToast);
  }

  return (
    <PageShell title={COPY.operations.title}>
      <Card>
        <CardHeader
          title={
            <span className="flex items-center gap-3">
              {COPY.operations.activeShift}
              <StatusBadge status={shift.status} />
            </span>
          }
        />
        <CardBody className="space-y-4">
          <ETAWidget etaMinutes={shift.etaMinutes} />
          <RiskBanner level={riskLevel} />

          <div>
            <h3 className={cn("mb-2 text-sm font-semibold", TEXT.label)}>
              {COPY.operations.suggestions}
            </h3>
            {candidates.length > 0 ? (
              <div className="space-y-2">
                {candidates.map((caregiver) => (
                  <ReplacementCard
                    key={caregiver.id}
                    caregiver={caregiver}
                    onAssign={handleAssign}
                  />
                ))}
              </div>
            ) : (
              <p className={cn("text-sm", TEXT.muted)}>{COPY.operations.empty}</p>
            )}
          </div>
        </CardBody>
        <CardFooter>
          <Button variant="secondary" onClick={() => notify(COPY.operations.contactToast)}>
            {COPY.operations.contactFamily}
          </Button>
        </CardFooter>
      </Card>
    </PageShell>
  );
}
