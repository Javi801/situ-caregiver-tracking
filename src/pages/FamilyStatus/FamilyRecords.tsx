import { PageShell } from "@/components/layout/PageShell";
import { Card, CardBody } from "@/components/ui/Card";
import { MedicalRecordView } from "@/components/cards/MedicalRecordView";
import { COPY } from "@/content/copy";
import { useShift } from "@/hooks/shift-context";
import { getPreviousRecords } from "@/data/records";
import { ACTIVE_SHIFT_ID } from "@/data/shifts";
import { cn } from "@/lib/cn";
import { TEXT } from "@/config/theme";

export function FamilyRecords() {
  const { record } = useShift();

  // History = previously completed records plus the active shift's record, if filled.
  const records = [...(record ? [record] : []), ...getPreviousRecords(ACTIVE_SHIFT_ID)];

  return (
    <PageShell title={COPY.family.records.title} subtitle={COPY.family.records.subtitle}>
      {records.length > 0 ? (
        <div className="space-y-3">
          {records.map((item) => (
            <MedicalRecordView key={item.id} record={item} />
          ))}
        </div>
      ) : (
        <Card>
          <CardBody className="py-8 text-center">
            <p className={cn("text-sm", TEXT.muted)}>{COPY.family.records.empty}</p>
          </CardBody>
        </Card>
      )}
    </PageShell>
  );
}
