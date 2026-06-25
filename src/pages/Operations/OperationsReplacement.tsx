import { useNavigate, useParams } from "react-router-dom";
import { CalendarClock, Clock4, Repeat, User } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardBody, CardFooter, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { COPY } from "@/content/copy";
import { ROUTES, operationsShiftPath, operationsSwapPath } from "@/config/routes";
import { isSwapOpen } from "@/lib/swap";
import { useShift } from "@/hooks/shift-context";
import { useToast } from "@/components/feedback/toast-context";
import { getCaregiver, getReplacementCandidates } from "@/data/caregivers";
import { getFamily } from "@/data/families";
import { rankReplacements } from "@/lib/replacements";
import { coversFullShift, momentaryCoverage, shiftWindow, toMinutes } from "@/lib/schedule";
import { formatDistance, formatMinutes, formatReliability } from "@/lib/format";
import { cn } from "@/lib/cn";
import { BADGE_VARIANT_CLASSES, BORDER, ICON, SURFACE, TEXT } from "@/config/theme";
import type { Caregiver, Shift } from "@/types";

export function OperationsReplacement() {
  const { shiftId = "" } = useParams();
  const navigate = useNavigate();
  const { getEffectiveShift, getShiftState, opsAssignReplacement, opsReassignOriginal, getSwapForShift } =
    useShift();
  const { notify } = useToast();

  const shift = getEffectiveShift(shiftId);

  if (!shift) {
    return (
      <PageShell title={COPY.operationsReplacement.title}>
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
  const family = getFamily(shift.familyId);
  const window = shiftWindow(shift);
  const candidates = rankReplacements(getReplacementCandidates(shift.caregiverId));
  const swap = getSwapForShift(shiftId);
  const activeSwap = swap && swap.shiftAId === shiftId && isSwapOpen(swap.status) ? swap : null;

  function handleAssignFull(candidate: Caregiver) {
    opsAssignReplacement(shiftId, candidate.id, "full", window.end);
    notify(COPY.operationsReplacement.assignedToastFull);
  }

  function handleAssignMomentary(candidate: Caregiver, coveredUntil: string) {
    opsAssignReplacement(shiftId, candidate.id, "momentary", coveredUntil);
    notify(COPY.operationsReplacement.assignedToastMomentary);
  }

  function handleReassignOriginal() {
    opsReassignOriginal(shiftId);
    notify(COPY.operationsReplacement.reassignToast);
  }

  return (
    <PageShell
      title={COPY.operationsReplacement.title}
      subtitle={family ? COPY.operationsReplacement.subtitle(family.name) : undefined}
    >
      <div className="space-y-4">
        <div
          className={cn(
            "flex items-center gap-2 rounded-lg border p-3 text-sm",
            BORDER.default,
            SURFACE.panel,
            TEXT.body,
          )}
        >
          <CalendarClock className={cn("h-4 w-4", ICON.accent)} aria-hidden="true" />
          {COPY.operationsReplacement.shiftWindow(window.start, window.end)}
        </div>

        {state.replacement ? (
          <AssignedView
            shift={shift}
            replacementCaregiverId={state.replacement.caregiverId}
            replacementType={state.replacement.type}
            coveredUntil={state.replacement.coveredUntil}
            originalReassigned={state.replacement.originalReassigned}
            shiftEnd={window.end}
            onReassignOriginal={handleReassignOriginal}
          />
        ) : (
          <>
            <Card>
              <CardHeader title={COPY.operations.suggestions} />
              <CardBody className="space-y-3">
                {candidates.length > 0 ? (
                  candidates.map((candidate) => (
                    <CandidateCard
                      key={candidate.id}
                      candidate={candidate}
                      shift={shift}
                      onAssignFull={() => handleAssignFull(candidate)}
                      onAssignMomentary={(coveredUntil) =>
                        handleAssignMomentary(candidate, coveredUntil)
                      }
                    />
                  ))
                ) : (
                  <p className={cn("text-sm", TEXT.muted)}>{COPY.operationsReplacement.noCandidates}</p>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardHeader title={COPY.operationsSwap.title} />
              <CardBody>
                {activeSwap ? (
                  <p className={cn("text-sm", TEXT.body)}>{COPY.operationsReplacement.rotationInProgress}</p>
                ) : (
                  <p className={cn("text-sm", TEXT.muted)}>{COPY.operationsReplacement.proposeRotationNote}</p>
                )}
              </CardBody>
              <CardFooter>
                <Button variant="secondary" onClick={() => navigate(operationsSwapPath(shiftId))}>
                  <Repeat className="h-4 w-4" aria-hidden="true" />
                  {activeSwap ? COPY.operationsReplacement.viewRotation : COPY.operationsReplacement.proposeRotation}
                </Button>
              </CardFooter>
            </Card>
          </>
        )}

        <Button variant="secondary" onClick={() => navigate(operationsShiftPath(shiftId))}>
          {COPY.operationsReplacement.backToProfile}
        </Button>
      </div>
    </PageShell>
  );
}

function CandidateCard({
  candidate,
  shift,
  onAssignFull,
  onAssignMomentary,
}: {
  candidate: Caregiver;
  shift: Shift;
  onAssignFull: () => void;
  onAssignMomentary: (coveredUntil: string) => void;
}) {
  const full = coversFullShift(candidate, shift);
  const coverage = momentaryCoverage(candidate, shift);

  return (
    <div className={cn("rounded-lg border p-4", BORDER.default)}>
      <div className="flex items-start gap-3">
        <span className={cn("mt-1 rounded-full p-2", SURFACE.accentSoft, ICON.accent)} aria-hidden="true">
          <User className="h-4 w-4" />
        </span>
        <div className="flex-1">
          <p className={cn("font-medium", TEXT.heading)}>{candidate.name}</p>
          <p className={cn("mt-0.5 flex items-center gap-1 text-sm", TEXT.muted)}>
            <Clock4 className="h-3.5 w-3.5" aria-hidden="true" />
            {COPY.operationsReplacement.available(candidate.availableFrom, candidate.availableUntil)}
          </p>
          <p className={cn("mt-1 text-xs", TEXT.subtle)}>
            {formatMinutes(candidate.etaMinutes)} · {formatDistance(candidate.distanceKm)} ·{" "}
            {formatReliability(candidate.reliabilityScore)}
          </p>
          <p className={cn("mt-2 text-sm", TEXT.body)}>
            {full
              ? COPY.operationsReplacement.fullyCovered
              : coverage.remainingFrom && coverage.remainingUntil
                ? `${COPY.operationsReplacement.covers(coverage.coveredUntil, coverage.hours)} · ${COPY.operationsReplacement.remaining(coverage.remainingFrom, coverage.remainingUntil)}`
                : COPY.operationsReplacement.covers(coverage.coveredUntil, coverage.hours)}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Button onClick={onAssignFull} disabled={!full}>
          {COPY.operationsReplacement.assignFull}
        </Button>
        <Button variant="secondary" onClick={() => onAssignMomentary(coverage.coveredUntil)}>
          {COPY.operationsReplacement.assignMomentary}
        </Button>
      </div>
      {!full ? (
        <p className={cn("mt-2 text-xs", TEXT.subtle)}>{COPY.operationsReplacement.fullDisabledNote}</p>
      ) : null}
    </div>
  );
}

function AssignedView({
  shift,
  replacementCaregiverId,
  replacementType,
  coveredUntil,
  originalReassigned,
  shiftEnd,
  onReassignOriginal,
}: {
  shift: Shift;
  replacementCaregiverId: string;
  replacementType: "full" | "momentary";
  coveredUntil: string;
  originalReassigned: boolean;
  shiftEnd: string;
  onReassignOriginal: () => void;
}) {
  const replacement = getCaregiver(replacementCaregiverId);
  const original = getCaregiver(shift.caregiverId);
  const window = shiftWindow(shift);
  const hasRemaining = replacementType === "momentary" && toMinutes(coveredUntil) < toMinutes(shift.endsAt);
  const coveredHours =
    Math.round(((toMinutes(coveredUntil) - toMinutes(shift.startsAt)) / 60) * 10) / 10;

  return (
    <div className="space-y-3">
      <Card>
        <CardHeader title={COPY.operationsReplacement.assignedCaregiver} description={replacement?.name} />
        <CardBody>
          <p className={cn("text-sm", TEXT.body)}>
            {replacementType === "full"
              ? COPY.operationsReplacement.fullyCovered
              : COPY.operationsReplacement.covers(coveredUntil, coveredHours)}
          </p>
        </CardBody>
      </Card>

      <Card className={cn(!originalReassigned ? "opacity-60" : null)}>
        <CardHeader
          title={
            <span className="flex items-center gap-2">
              {COPY.operationsReplacement.originalCaregiver}
              {originalReassigned ? (
                <span
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-xs font-medium",
                    BADGE_VARIANT_CLASSES.healthcare,
                  )}
                >
                  {COPY.operationsReplacement.newShiftBadge}
                </span>
              ) : null}
            </span>
          }
          description={original?.name}
        />
        <CardBody className="space-y-3">
          <p className={cn("text-sm", originalReassigned ? TEXT.body : TEXT.muted)}>
            {originalReassigned
              ? COPY.operationsReplacement.reassignedNote(coveredUntil, shiftEnd)
              : COPY.operationsReplacement.fullyReplaced}
          </p>
          {hasRemaining && !originalReassigned ? (
            <Button variant="secondary" onClick={onReassignOriginal}>
              {COPY.operationsReplacement.changeSchedule}
            </Button>
          ) : null}
        </CardBody>
      </Card>

      <p className={cn("text-xs", TEXT.subtle)}>
        {COPY.operationsReplacement.shiftWindow(window.start, window.end)}
      </p>
    </div>
  );
}
