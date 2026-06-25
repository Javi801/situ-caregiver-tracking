import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardBody, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { HandoffField } from "@/components/forms/HandoffField";
import { COPY } from "@/content/copy";
import { ROUTES } from "@/config/routes";
import { useShift } from "@/hooks/shift-context";
import { useToast } from "@/components/feedback/toast-context";
import { cn } from "@/lib/cn";
import { ICON, TEXT } from "@/config/theme";
import type { HandoffReport, RecordAuthor } from "@/types";

const EMPTY_REPORT: HandoffReport = {
  sleepQuality: "",
  mood: "",
  medicationChanges: "",
  recentEvents: "",
  notes: "",
};

export function HandoffForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { saveRecord } = useShift();
  const { notify } = useToast();
  const [report, setReport] = useState<HandoffReport>(EMPTY_REPORT);
  const [submitted, setSubmitted] = useState(false);

  const author: RecordAuthor =
    (location.state as { author?: RecordAuthor } | null)?.author === "family"
      ? "family"
      : "caregiver";
  const isFamily = author === "family";
  const confirmation = isFamily ? COPY.handoff.familyToast : COPY.handoff.toast;

  function update<K extends keyof HandoffReport>(key: K, value: HandoffReport[K]) {
    setReport((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveRecord(report, author);
    setSubmitted(true);
    notify(confirmation);
  }

  if (submitted) {
    return (
      <PageShell title={COPY.handoff.title}>
        <Card>
          <CardBody className="flex flex-col items-center gap-3 py-10 text-center">
            <CheckCircle2 className={cn("h-10 w-10", ICON.success)} aria-hidden="true" />
            <p className={cn("text-lg font-medium", TEXT.heading)}>{confirmation}</p>
            <Button variant="secondary" onClick={() => navigate(ROUTES.home)}>
              {COPY.common.backToHome}
            </Button>
          </CardBody>
        </Card>
      </PageShell>
    );
  }

  return (
    <PageShell
      title={COPY.handoff.title}
      subtitle={isFamily ? COPY.handoff.familySubtitle : COPY.handoff.subtitle}
    >
      <Card>
        <form onSubmit={handleSubmit}>
          <CardBody className="space-y-4">
            <HandoffField
              id="sleepQuality"
              label={COPY.handoff.sleepQuality}
              value={report.sleepQuality}
              onChange={(value) => update("sleepQuality", value)}
              required
            />
            <HandoffField
              id="mood"
              label={COPY.handoff.mood}
              value={report.mood}
              onChange={(value) => update("mood", value)}
              required
            />
            <HandoffField
              id="medicationChanges"
              label={COPY.handoff.medicationChanges}
              value={report.medicationChanges}
              onChange={(value) => update("medicationChanges", value)}
            />
            <HandoffField
              id="recentEvents"
              label={COPY.handoff.recentEvents}
              value={report.recentEvents}
              onChange={(value) => update("recentEvents", value)}
              multiline
            />
            <HandoffField
              id="notes"
              label={COPY.handoff.notes}
              value={report.notes}
              onChange={(value) => update("notes", value)}
              multiline
            />
          </CardBody>
          <CardFooter>
            <Button type="submit">{COPY.handoff.finish}</Button>
          </CardFooter>
        </form>
      </Card>
    </PageShell>
  );
}
