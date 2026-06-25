import { useNavigate, useParams } from "react-router-dom";
import { BellRing, CheckCircle2, Info } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardBody, CardFooter, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ETAWidget } from "@/components/cards/ETAWidget";
import { RiskBanner } from "@/components/feedback/RiskBanner";
import { ReplacementCard } from "@/components/cards/ReplacementCard";
import { VerificationChecklist } from "@/components/operations/VerificationChecklist";
import { COPY } from "@/content/copy";
import { ROUTES, operationsReplacementPath } from "@/config/routes";
import { useShift } from "@/hooks/shift-context";
import { useToast } from "@/components/feedback/toast-context";
import { getCaregiver, getReplacementCandidates } from "@/data/caregivers";
import { getFamily } from "@/data/families";
import { isDelayed } from "@/lib/eta";
import { getRiskLevel } from "@/lib/risk";
import { getOpsState } from "@/lib/opsState";
import { rankReplacements } from "@/lib/replacements";
import { cn } from "@/lib/cn";
import { FEEDBACK, TEXT } from "@/config/theme";

export function OperationsShiftProfile() {
  const { shiftId = "" } = useParams();
  const navigate = useNavigate();
  const { getEffectiveShift, getShiftState } = useShift();
  const { notify } = useToast();

  const shift = getEffectiveShift(shiftId);

  if (!shift) {
    return (
      <PageShell title={COPY.operations.title}>
        <Card>
          <CardBody className="py-8 text-center">
            <Button variant="secondary" onClick={() => navigate(ROUTES.operations)}>
              {COPY.common.back}
            </Button>
          </CardBody>
        </Card>
      </PageShell>
    );
  }

  const state = getShiftState(shiftId);
  const delayed = isDelayed(shift.scheduledEtaMinutes, shift.etaMinutes);
  const opsState = getOpsState(shift.status, delayed);
  const riskLevel = getRiskLevel(shift.scheduledEtaMinutes, shift.etaMinutes);

  const family = getFamily(shift.familyId);
  const assignedCaregiverId = state.replacement?.caregiverId ?? shift.caregiverId;
  const caregiver = getCaregiver(assignedCaregiverId);
  const candidates = rankReplacements(getReplacementCandidates(shift.caregiverId));

  const isLate = opsState === "late";
  const isPending = opsState === "pending";
  const hasReplacement = state.replacement !== null;

  return (
    <PageShell title={family?.name ?? COPY.operations.title} subtitle={caregiver?.name}>
      <div className="space-y-4">
        <Card>
          <CardHeader
            title={
              <span className="flex items-center gap-3">
                {COPY.operations.assignedCaregiver}
                <StatusBadge status={shift.status} />
              </span>
            }
            description={caregiver?.name}
          />
          <CardBody className="space-y-4">
            <ETAWidget etaMinutes={shift.etaMinutes} distanceKm={caregiver?.distanceKm} />
            <RiskBanner level={riskLevel} />

            {isPending ? (
              <div
                className={cn("flex items-start gap-2 rounded-lg border p-4 text-sm", FEEDBACK.warning)}
                role="note"
              >
                <Info className="mt-0.5 h-4 w-4" aria-hidden="true" />
                <p>{COPY.operations.pendingNote}</p>
              </div>
            ) : null}

            {hasReplacement ? (
              <div
                className={cn("flex items-start gap-2 rounded-lg border p-4 text-sm", FEEDBACK.success)}
                role="status"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4" aria-hidden="true" />
                <p>{COPY.operations.assignedBanner}</p>
              </div>
            ) : null}
          </CardBody>
          <CardFooter>
            <Button variant="secondary" onClick={() => notify(COPY.operations.contactToast)}>
              {COPY.operations.contactFamily}
            </Button>
            {isPending ? (
              <Button variant="secondary" onClick={() => notify(COPY.operations.reminderToast)}>
                <BellRing className="h-4 w-4" aria-hidden="true" />
                {COPY.operations.sendReminder}
              </Button>
            ) : null}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader title={COPY.operations.verifications} />
          <CardBody>
            <VerificationChecklist opsState={opsState} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title={COPY.operations.suggestions} />
          <CardBody className="space-y-3">
            {!isLate && !hasReplacement ? (
              <p className={cn("text-sm", TEXT.muted)}>{COPY.operations.suggestionsDisabledNote}</p>
            ) : null}

            <div className={cn("space-y-2", !isLate && !hasReplacement ? "opacity-50" : null)}>
              {candidates.length > 0 ? (
                candidates.map((candidate) => (
                  <ReplacementCard key={candidate.id} caregiver={candidate} />
                ))
              ) : (
                <p className={cn("text-sm", TEXT.muted)}>{COPY.operations.empty}</p>
              )}
            </div>
          </CardBody>
          <CardFooter>
            <Button
              onClick={() => navigate(operationsReplacementPath(shiftId))}
              disabled={!isLate && !hasReplacement}
            >
              {COPY.operations.manageReplacement}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </PageShell>
  );
}
