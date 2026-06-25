import { CheckCircle2, Clock4, MapPin, Repeat, ShieldCheck, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { COPY } from "@/content/copy";
import { useShift } from "@/hooks/shift-context";
import { useToast } from "@/components/feedback/toast-context";
import { getCaregiver } from "@/data/caregivers";
import { getFamily } from "@/data/families";
import { getShift } from "@/data/shifts";
import { formatDistance, formatMinutes, formatReliability, formatTime } from "@/lib/format";
import { isSwapOpen } from "@/lib/swap";
import { cn } from "@/lib/cn";
import { BORDER, FEEDBACK, ICON, SURFACE, TEXT } from "@/config/theme";
import type { Caregiver, Shift, SwapPartyRole, SwapProposal } from "@/types";

type Viewer = "family" | "caregiver";

/** Resolve which of the four parties this shift represents for the viewer. */
function roleFor(viewer: Viewer, shiftId: string, shiftAId: string, shiftBId: string): SwapPartyRole | null {
  if (viewer === "family") {
    if (shiftId === shiftAId) return "familyA";
    if (shiftId === shiftBId) return "familyB";
    return null;
  }
  if (shiftId === shiftAId) return "caregiverA";
  if (shiftId === shiftBId) return "caregiverB";
  return null;
}

/**
 * The rotation message shown to a simulated actor (family or caregiver) for a
 * shift that is party to a swap, with accept/decline controls while pending.
 */
export function ActorSwapBanner({ shiftId, viewer }: { shiftId: string; viewer: Viewer }) {
  const { getSwapForShift, setSwapDecision } = useShift();
  const { notify } = useToast();

  const proposal = getSwapForShift(shiftId);
  if (!proposal) {
    return null;
  }

  const role = roleFor(viewer, shiftId, proposal.shiftAId, proposal.shiftBId);
  if (!role) {
    return null;
  }

  if (proposal.status === "rejected") {
    return <SwapNotice icon="cancelled" text={COPY.swap.cancelledMessage} tone="danger" />;
  }
  if (proposal.status === "applied") {
    return <SwapNotice icon="applied" text={COPY.swap.appliedMessage} tone="success" />;
  }

  const decision = proposal.decisions[role];
  if (decision === "accepted") {
    return <SwapNotice icon="applied" text={COPY.swap.acceptedWaiting} tone="info" />;
  }

  function handleAccept() {
    setSwapDecision(proposal!.id, role!, "accepted");
    notify(COPY.swap.acceptToast);
  }

  function handleDecline() {
    setSwapDecision(proposal!.id, role!, "rejected");
    notify(COPY.swap.declineToast);
  }

  return (
    <div className={cn("space-y-3 rounded-lg border p-4", FEEDBACK.info)} role="note">
      <p className="flex items-center gap-2 text-sm font-medium">
        <Repeat className="h-4 w-4" aria-hidden="true" />
        {COPY.swap.title}
      </p>
      <p className="text-sm">{promptFor(role, proposal)}</p>
      {viewer === "family" ? (
        <CaregiverInfo caregiver={incomingCaregiver(role, proposal)} />
      ) : (
        <ShiftInfo shift={otherShift(role, proposal)} caregiver={movingCaregiver(role, proposal)} />
      )}
      {isSwapOpen(proposal.status) ? (
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleAccept}>{COPY.swap.accept}</Button>
          <Button variant="secondary" onClick={handleDecline}>
            {COPY.swap.decline}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function promptFor(role: SwapPartyRole, proposal: SwapProposal): string {
  switch (role) {
    case "familyA":
      return COPY.swap.familyAPrompt(caregiverName(proposal.caregiverBId));
    case "familyB":
      return COPY.swap.familyBPrompt(caregiverName(proposal.caregiverAId));
    case "caregiverA":
      return COPY.swap.caregiverAPrompt(familyName(proposal.familyBId));
    case "caregiverB":
      return COPY.swap.caregiverBPrompt(familyName(proposal.familyAId));
  }
}

/** The caregiver a family would receive under the swap. */
function incomingCaregiver(role: SwapPartyRole, proposal: SwapProposal): Caregiver | undefined {
  return getCaregiver(role === "familyA" ? proposal.caregiverBId : proposal.caregiverAId);
}

/** The shift a caregiver would move to under the swap. */
function otherShift(role: SwapPartyRole, proposal: SwapProposal): Shift | undefined {
  return getShift(role === "caregiverA" ? proposal.shiftBId : proposal.shiftAId);
}

/** The caregiver doing the moving (used for travel estimates to the other home). */
function movingCaregiver(role: SwapPartyRole, proposal: SwapProposal): Caregiver | undefined {
  return getCaregiver(role === "caregiverA" ? proposal.caregiverAId : proposal.caregiverBId);
}

function caregiverName(id: string): string {
  return getCaregiver(id)?.name ?? "";
}

function familyName(id: string): string {
  return getFamily(id)?.name ?? "";
}

function CaregiverInfo({ caregiver }: { caregiver: Caregiver | undefined }) {
  if (!caregiver) {
    return null;
  }
  return (
    <div className={cn("rounded-lg border p-3", BORDER.default, SURFACE.card)}>
      <p className={cn("text-sm font-medium", TEXT.heading)}>{caregiver.name}</p>
      <p className={cn("mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs", TEXT.muted)}>
        <span className="flex items-center gap-1">
          <Clock4 className="h-3.5 w-3.5" aria-hidden="true" />
          {formatMinutes(caregiver.etaMinutes)}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          {formatDistance(caregiver.distanceKm)}
        </span>
        <span className="flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          {COPY.swap.reliability(formatReliability(caregiver.reliabilityScore))}
        </span>
      </p>
    </div>
  );
}

function ShiftInfo({ shift, caregiver }: { shift: Shift | undefined; caregiver: Caregiver | undefined }) {
  if (!shift) {
    return null;
  }
  const family = getFamily(shift.familyId);
  return (
    <div className={cn("rounded-lg border p-3", BORDER.default, SURFACE.card)}>
      <p className={cn("text-sm font-medium", TEXT.heading)}>{family?.name}</p>
      {family ? <p className={cn("mt-0.5 text-xs", TEXT.muted)}>{family.address}</p> : null}
      <p className={cn("mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs", TEXT.muted)}>
        <span className="flex items-center gap-1">
          <Clock4 className="h-3.5 w-3.5" aria-hidden="true" />
          {COPY.swap.startsAt(formatTime(shift.startsAt))}
        </span>
        {caregiver ? (
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            {COPY.swap.travel(formatMinutes(caregiver.etaMinutes), formatDistance(caregiver.distanceKm))}
          </span>
        ) : null}
      </p>
    </div>
  );
}

function SwapNotice({
  icon,
  text,
  tone,
}: {
  icon: "applied" | "cancelled";
  text: string;
  tone: "success" | "danger" | "info";
}) {
  const palette = tone === "success" ? FEEDBACK.success : tone === "danger" ? FEEDBACK.danger : FEEDBACK.info;
  return (
    <div className={cn("flex items-start gap-2 rounded-lg border p-4 text-sm", palette)} role="status">
      {icon === "cancelled" ? (
        <XCircle className={cn("mt-0.5 h-4 w-4", ICON.accent)} aria-hidden="true" />
      ) : (
        <CheckCircle2 className="mt-0.5 h-4 w-4" aria-hidden="true" />
      )}
      <p>{text}</p>
    </div>
  );
}
