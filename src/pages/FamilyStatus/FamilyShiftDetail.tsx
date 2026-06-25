import { useNavigate, useParams } from "react-router-dom";
import { Info } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ShiftCard } from "@/components/cards/ShiftCard";
import { FamilyStatus } from "@/pages/FamilyStatus/FamilyStatus";
import { COPY } from "@/content/copy";
import { ROUTES } from "@/config/routes";
import { getFamily } from "@/data/families";
import { getShift, isActiveShift } from "@/data/shifts";
import { cn } from "@/lib/cn";
import { FEEDBACK, TEXT } from "@/config/theme";

export function FamilyShiftDetail() {
  const { shiftId = "" } = useParams();
  const navigate = useNavigate();

  // The active shift is the one in progress: show the live monitoring view.
  if (isActiveShift(shiftId)) {
    return <FamilyStatus />;
  }

  const shift = getShift(shiftId);

  if (!shift) {
    return (
      <PageShell title={COPY.family.title}>
        <Card>
          <CardBody className="space-y-3 py-8 text-center">
            <p className={cn("text-sm", TEXT.muted)}>{COPY.family.infoOnly}</p>
            <Button variant="secondary" onClick={() => navigate(ROUTES.family)}>
              {COPY.common.back}
            </Button>
          </CardBody>
        </Card>
      </PageShell>
    );
  }

  const family = getFamily(shift.familyId);

  return (
    <PageShell title={COPY.family.title} subtitle={family?.name}>
      <div className="space-y-4">
        <ShiftCard shift={shift} family={family} />
        <div
          className={cn("flex items-start gap-2 rounded-lg border p-4 text-sm", FEEDBACK.info)}
          role="note"
        >
          <Info className="mt-0.5 h-4 w-4" aria-hidden="true" />
          <p>{COPY.family.infoOnly}</p>
        </div>
      </div>
    </PageShell>
  );
}
