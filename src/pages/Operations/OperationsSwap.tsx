import { useNavigate, useParams } from "react-router-dom";
import { Repeat } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SwapCandidateList } from "@/components/swap/SwapCandidateList";
import { SwapCoordinationPanel } from "@/components/swap/SwapCoordinationPanel";
import { COPY } from "@/content/copy";
import { ROUTES, operationsReplacementPath } from "@/config/routes";
import { useShift } from "@/hooks/shift-context";
import { useToast } from "@/components/feedback/toast-context";
import { getFamily } from "@/data/families";
import { isSwapOpen } from "@/lib/swap";
import { shiftWindow } from "@/lib/schedule";
import { cn } from "@/lib/cn";
import { BORDER, ICON, SURFACE, TEXT } from "@/config/theme";

export function OperationsSwap() {
  const { shiftId = "" } = useParams();
  const navigate = useNavigate();
  const { getEffectiveShift, swapProposals, proposeSwap, applySwap } = useShift();
  const { notify } = useToast();

  const shift = getEffectiveShift(shiftId);
  const family = shift ? getFamily(shift.familyId) : undefined;

  if (!shift) {
    return (
      <PageShell title={COPY.operationsSwap.title}>
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

  const proposalsForShift = swapProposals.filter((proposal) => proposal.shiftAId === shiftId);
  const latest = proposalsForShift[0] ?? null;
  const active = latest && (isSwapOpen(latest.status) || latest.status === "applied") ? latest : null;
  const window = shiftWindow(shift);

  return (
    <PageShell
      title={COPY.operationsSwap.title}
      subtitle={family ? COPY.operationsSwap.subtitle(family.name) : undefined}
    >
      <div className="space-y-4">
        <div className={cn("flex items-center gap-2 rounded-lg border p-3 text-sm", BORDER.default, SURFACE.panel, TEXT.body)}>
          <Repeat className={cn("h-4 w-4", ICON.accent)} aria-hidden="true" />
          {COPY.operationsSwap.currentShift(window.start, window.end)}
        </div>

        {active ? (
          <SwapCoordinationPanel
            proposal={active}
            onApply={() => {
              applySwap(active.id);
              notify(COPY.operationsSwap.applyToast);
            }}
          />
        ) : (
          <SwapCandidateList
            shift={shift}
            previouslyCancelled={latest?.status === "rejected"}
            onPropose={(donorShiftId) => {
              if (proposeSwap(shiftId, donorShiftId)) {
                notify(COPY.operationsSwap.proposeToast);
              }
            }}
          />
        )}

        <Button variant="secondary" onClick={() => navigate(operationsReplacementPath(shiftId))}>
          {COPY.operationsSwap.backToReplacement}
        </Button>
      </div>
    </PageShell>
  );
}
