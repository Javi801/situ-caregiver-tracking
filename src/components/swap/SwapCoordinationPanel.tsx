import { CheckCircle2, Info } from "lucide-react";
import { Card, CardBody, CardFooter, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SwapPartyRow } from "@/components/swap/SwapPartyRow";
import { COPY } from "@/content/copy";
import { getCaregiver } from "@/data/caregivers";
import { getFamily } from "@/data/families";
import { acceptedCount } from "@/lib/swap";
import { cn } from "@/lib/cn";
import { SWAP_STATUS_LABEL } from "@/config/swap";
import { FEEDBACK, TEXT } from "@/config/theme";
import type { SwapPartyRole, SwapProposal } from "@/types";

interface PartyRowView {
  role: SwapPartyRole;
  label: string;
  moveText: string;
}

/**
 * Operator coordination panel: a read-only view of the four party states
 * (traffic-light) plus the explicit apply action. The operator never answers
 * on a party's behalf; they finalize the rotation once all parties accept.
 */
export function SwapCoordinationPanel({
  proposal,
  onApply,
}: {
  proposal: SwapProposal;
  onApply: () => void;
}) {
  const caregiverA = getCaregiver(proposal.caregiverAId);
  const caregiverB = getCaregiver(proposal.caregiverBId);
  const familyA = getFamily(proposal.familyAId);
  const familyB = getFamily(proposal.familyBId);

  const rows: PartyRowView[] = [
    {
      role: "caregiverA",
      label: COPY.operationsSwap.roleLabel.caregiverA,
      moveText: COPY.operationsSwap.roleMove.caregiverA(familyB?.name ?? ""),
    },
    {
      role: "familyA",
      label: COPY.operationsSwap.roleLabel.familyA,
      moveText: COPY.operationsSwap.roleMove.familyA(caregiverB?.name ?? ""),
    },
    {
      role: "caregiverB",
      label: COPY.operationsSwap.roleLabel.caregiverB,
      moveText: COPY.operationsSwap.roleMove.caregiverB(familyA?.name ?? ""),
    },
    {
      role: "familyB",
      label: COPY.operationsSwap.roleLabel.familyB,
      moveText: COPY.operationsSwap.roleMove.familyB(caregiverA?.name ?? ""),
    },
  ];

  return (
    <Card>
      <CardHeader
        title={COPY.operationsSwap.coordinationTitle}
        description={`${SWAP_STATUS_LABEL[proposal.status]} · ${COPY.operationsSwap.progress(acceptedCount(proposal.decisions))}`}
      />
      <CardBody className="space-y-3">
        <p className={cn("text-sm", TEXT.muted)}>{COPY.operationsSwap.coordinationHelp}</p>

        {proposal.status !== "applied" ? (
          <div className={cn("flex items-start gap-2 rounded-lg border p-3 text-sm", FEEDBACK.info)} role="note">
            <Info className="mt-0.5 h-4 w-4" aria-hidden="true" />
            <p>{COPY.operationsSwap.donorAssumed}</p>
          </div>
        ) : null}

        {proposal.status === "applied" ? (
          <div className={cn("flex items-start gap-2 rounded-lg border p-3 text-sm", FEEDBACK.success)} role="status">
            <CheckCircle2 className="mt-0.5 h-4 w-4" aria-hidden="true" />
            <p>
              {COPY.operationsSwap.appliedNote(
                caregiverB?.name ?? "",
                familyA?.name ?? "",
                caregiverA?.name ?? "",
                familyB?.name ?? "",
              )}
            </p>
          </div>
        ) : null}

        {rows.map((row) => (
          <SwapPartyRow
            key={row.role}
            label={row.label}
            moveText={row.moveText}
            decision={proposal.decisions[row.role]}
          />
        ))}
      </CardBody>
      {proposal.status !== "applied" ? (
        <CardFooter>
          <Button onClick={onApply} disabled={proposal.status !== "accepted"}>
            {COPY.operationsSwap.apply}
          </Button>
          {proposal.status !== "accepted" ? (
            <p className={cn("text-xs", TEXT.subtle)}>{COPY.operationsSwap.applyNote}</p>
          ) : null}
        </CardFooter>
      ) : null}
    </Card>
  );
}
