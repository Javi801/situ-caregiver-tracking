import { useNavigate } from "react-router-dom";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardBody, CardFooter, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ReplacementCard } from "@/components/cards/ReplacementCard";
import { COPY } from "@/content/copy";
import { ROUTES } from "@/config/routes";
import { useShift } from "@/hooks/shift-context";
import { useToast } from "@/components/feedback/toast-context";
import { getReplacementCandidates } from "@/data/caregivers";
import { getBestReplacement, rankReplacements } from "@/lib/replacements";
import { cn } from "@/lib/cn";
import { TEXT } from "@/config/theme";

export function ReplacementFlow() {
  const navigate = useNavigate();
  const { shift, assignReplacement } = useShift();
  const { notify } = useToast();

  const ranked = rankReplacements(getReplacementCandidates(shift.caregiverId));
  const suggested = getBestReplacement(ranked);

  function handleAccept() {
    if (!suggested) {
      return;
    }
    assignReplacement(suggested.id);
    notify(COPY.replacement.acceptToast);
    navigate(ROUTES.operations);
  }

  function handleReject() {
    notify(COPY.replacement.rejectToast);
    navigate(ROUTES.family);
  }

  return (
    <PageShell title={COPY.replacement.title}>
      <Card>
        <CardHeader title={COPY.replacement.suggested} />
        <CardBody>
          {suggested ? (
            <ReplacementCard caregiver={suggested} />
          ) : (
            <p className={cn("text-sm", TEXT.muted)}>{COPY.operations.empty}</p>
          )}
        </CardBody>
        <CardFooter>
          <Button variant="secondary" onClick={handleReject}>
            {COPY.replacement.reject}
          </Button>
          <Button onClick={handleAccept} disabled={!suggested}>
            {COPY.replacement.accept}
          </Button>
        </CardFooter>
      </Card>
    </PageShell>
  );
}
