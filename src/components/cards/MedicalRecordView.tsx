import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { COPY } from "@/content/copy";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/cn";
import { TEXT } from "@/config/theme";
import type { MedicalRecord } from "@/types";

const FIELD_LABELS: Array<{ key: keyof MedicalRecord; label: string }> = [
  { key: "sleepQuality", label: COPY.handoff.sleepQuality },
  { key: "mood", label: COPY.handoff.mood },
  { key: "medicationChanges", label: COPY.handoff.medicationChanges },
  { key: "recentEvents", label: COPY.handoff.recentEvents },
  { key: "notes", label: COPY.handoff.notes },
];

/** Read-only view of a completed medical record (ficha). */
export function MedicalRecordView({ record }: { record: MedicalRecord }) {
  const authorLabel =
    record.recordedBy === "family"
      ? COPY.shiftDetail.recordedByFamily
      : COPY.shiftDetail.recordedByCaregiver;

  return (
    <Card>
      <CardHeader title={formatDate(record.recordedAt)} description={authorLabel} />
      <CardBody className="space-y-3">
        {FIELD_LABELS.map(({ key, label }) => {
          const value = record[key];
          if (!value) {
            return null;
          }
          return (
            <div key={key}>
              <p className={cn("text-xs uppercase tracking-wide", TEXT.subtle)}>{label}</p>
              <p className={cn("text-sm", TEXT.body)}>{value}</p>
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
}
