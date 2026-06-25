import { Clock4, Info, User } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { COPY } from "@/content/copy";
import { useShift } from "@/hooks/shift-context";
import { getCaregiver } from "@/data/caregivers";
import { getFamily } from "@/data/families";
import { getOpsActiveShifts } from "@/data/shifts";
import { isDelayed } from "@/lib/eta";
import { findSwapCandidates, rejectedDonorCaregiverIds, type SwapCandidate } from "@/lib/swap";
import { shiftWindow } from "@/lib/schedule";
import { formatDistance, formatMinutes, formatReliability } from "@/lib/format";
import { cn } from "@/lib/cn";
import { BORDER, FEEDBACK, ICON, SURFACE, TEXT } from "@/config/theme";
import type { Caregiver, Shift } from "@/types";

interface DonorEntry {
  shift: Shift;
  caregiver: Caregiver;
}

/**
 * Lets the operator pick a caregiver from another family to propose a swap.
 * Viable donors come first; caregivers who declined a prior swap for this shift
 * sink to the bottom, greyed out and disabled.
 */
export function SwapCandidateList({
  shift,
  previouslyCancelled,
  onPropose,
}: {
  shift: Shift;
  previouslyCancelled: boolean;
  onPropose: (donorShiftId: string) => void;
}) {
  const { getEffectiveShift, swapProposals } = useShift();
  const caregiverA = getCaregiver(shift.caregiverId);
  const delayed = isDelayed(shift.scheduledEtaMinutes, shift.etaMinutes);

  if (!caregiverA || !delayed) {
    return (
      <Card>
        <CardBody>
          <p className={cn("text-sm", TEXT.muted)}>{COPY.operationsSwap.notLate}</p>
        </CardBody>
      </Card>
    );
  }

  const donors = getOpsActiveShifts()
    .filter((donor) => donor.id !== shift.id)
    .map((donor): DonorEntry | null => {
      const effective = getEffectiveShift(donor.id) ?? donor;
      const caregiver = getCaregiver(effective.caregiverId);
      return caregiver ? { shift: effective, caregiver } : null;
    })
    .filter((entry): entry is DonorEntry => entry !== null);

  const candidates = findSwapCandidates(shift, caregiverA, donors);
  const rejectedIds = rejectedDonorCaregiverIds(swapProposals, shift.id);
  const open = candidates.filter((candidate) => !rejectedIds.includes(candidate.caregiver.id));
  const sunk = candidates.filter((candidate) => rejectedIds.includes(candidate.caregiver.id));

  return (
    <Card>
      <CardHeader title={COPY.operationsSwap.pickTitle} description={COPY.operationsSwap.pickHelp} />
      <CardBody className="space-y-3">
        {previouslyCancelled ? (
          <div className={cn("flex items-start gap-2 rounded-lg border p-3 text-sm", FEEDBACK.warning)} role="note">
            <Info className="mt-0.5 h-4 w-4" aria-hidden="true" />
            <p>{COPY.operationsSwap.cancelledNote}</p>
          </div>
        ) : null}

        {open.length === 0 && sunk.length === 0 ? (
          <p className={cn("text-sm", TEXT.muted)}>{COPY.operationsSwap.noCandidates}</p>
        ) : null}

        {open.map((candidate) => (
          <SwapCandidateRow key={candidate.shift.id} candidate={candidate} onPropose={onPropose} />
        ))}
        {sunk.map((candidate) => (
          <SwapCandidateRow key={candidate.shift.id} candidate={candidate} onPropose={onPropose} disabled />
        ))}
      </CardBody>
    </Card>
  );
}

function SwapCandidateRow({
  candidate,
  onPropose,
  disabled = false,
}: {
  candidate: SwapCandidate;
  onPropose: (donorShiftId: string) => void;
  disabled?: boolean;
}) {
  const family = getFamily(candidate.shift.familyId);
  const window = shiftWindow(candidate.shift);

  return (
    <div className={cn("rounded-lg border p-4", BORDER.default, disabled ? "opacity-50" : null)}>
      <div className="flex items-start gap-3">
        <span className={cn("mt-1 rounded-full p-2", SURFACE.accentSoft, ICON.accent)} aria-hidden="true">
          <User className="h-4 w-4" />
        </span>
        <div className="flex-1">
          <p className={cn("font-medium", TEXT.heading)}>{candidate.caregiver.name}</p>
          <p className={cn("mt-0.5 flex items-center gap-1 text-sm", TEXT.muted)}>
            <Clock4 className="h-3.5 w-3.5" aria-hidden="true" />
            {family?.name}
          </p>
          <p className={cn("mt-1 text-xs", TEXT.subtle)}>
            {formatMinutes(candidate.caregiver.etaMinutes)} · {formatDistance(candidate.caregiver.distanceKm)} ·{" "}
            {formatReliability(candidate.caregiver.reliabilityScore)}
          </p>
          <p className={cn("mt-2 text-sm", TEXT.body)}>
            {COPY.operationsSwap.viableNew(formatMinutes(candidate.caregiver.etaMinutes))}
          </p>
          <p className={cn("text-sm", TEXT.body)}>
            {COPY.operationsSwap.viableOriginal(window.start, window.end)}
          </p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button onClick={() => onPropose(candidate.shift.id)} disabled={disabled}>
          {COPY.operationsSwap.propose}
        </Button>
      </div>
      {disabled ? (
        <p className={cn("mt-2 text-xs", TEXT.subtle)}>{COPY.operationsReplacement.rejectedCandidateNote}</p>
      ) : null}
    </div>
  );
}
