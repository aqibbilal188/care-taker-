import { AlertTriangle, Clock, CheckCircle2, ArrowUpRight } from "lucide-react";
import { tickets, schoolName } from "@/lib/data";
import { Card, Badge, PageHeader } from "@/components/ui";

const priorityTone: Record<string, "red" | "amber" | "blue" | "slate"> = {
  P1: "red",
  P2: "amber",
  P3: "blue",
  P4: "slate",
};

const statusLabel: Record<string, string> = {
  open: "Open",
  "in-progress": "In progress",
  "awaiting-parts": "Awaiting parts",
  resolved: "Resolved",
};

export default function HelpdeskPage() {
  const sorted = [...tickets].sort((a, b) => a.slaHoursLeft - b.slaHoursLeft);
  const breached = tickets.filter((t) => t.slaHoursLeft < 0).length;
  const atRisk = tickets.filter(
    (t) => t.slaHoursLeft >= 0 && t.slaHoursLeft <= 12
  ).length;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Help Desk & SLA Monitor"
        subtitle="Live job tickets with SLA tracking — AI escalates before deadlines are missed"
      />

      <div className="mb-6 grid grid-cols-3 gap-4">
        <Stat value={breached} label="SLA breached" tone="text-red-600" />
        <Stat value={atRisk} label="At risk (<12h)" tone="text-amber-600" />
        <Stat
          value={tickets.length}
          label="Open jobs"
          tone="text-slate-700"
        />
      </div>

      <Card className="overflow-hidden">
        <div className="hidden grid-cols-12 gap-4 border-b border-slate-100 bg-slate-50 px-5 py-2.5 text-xs font-medium uppercase tracking-wide text-slate-400 md:grid">
          <div className="col-span-1">Ref</div>
          <div className="col-span-4">Job</div>
          <div className="col-span-2">Site</div>
          <div className="col-span-2">Assigned</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-2 text-right">SLA</div>
        </div>
        <div className="divide-y divide-slate-100">
          {sorted.map((t) => {
            const breached = t.slaHoursLeft < 0;
            const risk = t.slaHoursLeft >= 0 && t.slaHoursLeft <= 12;
            return (
              <div
                key={t.id}
                className="grid grid-cols-1 gap-2 px-5 py-3.5 transition hover:bg-slate-50 md:grid-cols-12 md:items-center md:gap-4"
              >
                <div className="col-span-1 font-mono text-xs text-slate-400">
                  {t.id}
                </div>
                <div className="col-span-4 flex items-center gap-2">
                  <Badge tone={priorityTone[t.priority]}>{t.priority}</Badge>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {t.title}
                    </p>
                    <p className="text-xs text-slate-400">
                      {t.category} · {t.raisedLabel}
                    </p>
                  </div>
                </div>
                <div className="col-span-2 text-sm text-slate-600">
                  {schoolName(t.schoolId)}
                </div>
                <div className="col-span-2 text-sm text-slate-500">
                  {t.assignedTo}
                </div>
                <div className="col-span-1">
                  <span className="text-xs font-medium text-slate-500">
                    {statusLabel[t.status]}
                  </span>
                </div>
                <div className="col-span-2 flex items-center gap-2 md:justify-end">
                  <span
                    className={`flex items-center gap-1 text-xs font-semibold ${
                      breached
                        ? "text-red-600"
                        : risk
                          ? "text-amber-600"
                          : "text-emerald-600"
                    }`}
                  >
                    {breached ? (
                      <AlertTriangle size={13} />
                    ) : risk ? (
                      <Clock size={13} />
                    ) : (
                      <CheckCircle2 size={13} />
                    )}
                    {t.slaLabel}
                  </span>
                  {(breached || risk) && (
                    <button className="flex items-center gap-1 rounded-md bg-slate-900 px-2 py-1 text-[11px] font-medium text-white transition hover:bg-slate-700">
                      Escalate <ArrowUpRight size={11} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function Stat({
  value,
  label,
  tone,
}: {
  value: number;
  label: string;
  tone: string;
}) {
  return (
    <Card className="p-5">
      <p className={`text-3xl font-bold ${tone}`}>{value}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </Card>
  );
}
