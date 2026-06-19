import {
  Flame,
  Droplets,
  Plug,
  Wind,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";
import { complianceTasks, schoolName, schools } from "@/lib/data";
import { Card, UrgencyBadge, PageHeader, Badge } from "@/components/ui";

const categoryIcon: Record<string, React.ReactNode> = {
  "Fire Safety": <Flame size={15} />,
  "Water Hygiene": <Droplets size={15} />,
  Electrical: <Plug size={15} />,
  "Gas Safety": <Wind size={15} />,
  Asbestos: <ShieldAlert size={15} />,
};

const categoryTone: Record<string, string> = {
  "Fire Safety": "bg-red-50 text-red-600",
  "Water Hygiene": "bg-blue-50 text-blue-600",
  Electrical: "bg-amber-50 text-amber-600",
  "Gas Safety": "bg-orange-50 text-orange-600",
  Asbestos: "bg-violet-50 text-violet-600",
};

const order = { overdue: 0, critical: 1, soon: 2, ok: 3 };

export default function CompliancePage() {
  const sorted = [...complianceTasks].sort(
    (a, b) => order[a.urgency] - order[b.urgency]
  );
  const overdue = complianceTasks.filter((t) => t.urgency === "overdue").length;
  const dueSoon = complianceTasks.filter(
    (t) => t.urgency === "soon" || t.urgency === "critical"
  ).length;
  const onTrack = complianceTasks.filter((t) => t.urgency === "ok").length;

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Compliance Tracker"
        subtitle="Statutory and recurring compliance across all sites — AI keeps every deadline visible"
      />

      <div className="mb-6 grid grid-cols-3 gap-4">
        <Summary value={overdue} label="Overdue" tone="red" />
        <Summary value={dueSoon} label="Due soon" tone="amber" />
        <Summary value={onTrack} label="On track" tone="green" />
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-semibold text-slate-900">All compliance tasks</h2>
        </div>
        {/* Header row */}
        <div className="hidden grid-cols-12 gap-4 border-b border-slate-100 bg-slate-50 px-5 py-2.5 text-xs font-medium uppercase tracking-wide text-slate-400 md:grid">
          <div className="col-span-5">Task</div>
          <div className="col-span-3">Site</div>
          <div className="col-span-2">Responsible</div>
          <div className="col-span-2 text-right">Status</div>
        </div>
        <div className="divide-y divide-slate-100">
          {sorted.map((t) => (
            <div
              key={t.id}
              className="grid grid-cols-1 gap-2 px-5 py-3.5 transition hover:bg-slate-50 md:grid-cols-12 md:items-center md:gap-4"
            >
              <div className="col-span-5 flex items-center gap-3">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    categoryTone[t.category] ?? "bg-slate-100 text-slate-500"
                  }`}
                >
                  {categoryIcon[t.category] ?? <CheckCircle2 size={15} />}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {t.title}
                  </p>
                  <p className="text-xs text-slate-400">
                    {t.category} · {t.frequency}
                  </p>
                </div>
              </div>
              <div className="col-span-3 text-sm text-slate-600">
                {schoolName(t.schoolId)}
              </div>
              <div className="col-span-2 text-sm text-slate-500">
                {t.responsible}
              </div>
              <div className="col-span-2 flex items-center gap-2 md:justify-end">
                <span className="text-xs text-slate-400 md:hidden">
                  {t.dueLabel}
                </span>
                <UrgencyBadge urgency={t.urgency} />
              </div>
              <div className="col-span-12 hidden text-right text-xs text-slate-400 md:block">
                {t.dueLabel}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <p className="mt-4 text-center text-xs text-slate-400">
        Tracking {complianceTasks.length} statutory tasks across{" "}
        {schools.length} sites · Powered by Caretaker AI compliance engine
      </p>
    </div>
  );
}

function Summary({
  value,
  label,
  tone,
}: {
  value: number;
  label: string;
  tone: "red" | "amber" | "green";
}) {
  const map = {
    red: "border-red-200 bg-red-50 text-red-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
  };
  return (
    <div className={`rounded-2xl border p-5 ${map[tone]}`}>
      <p className="text-3xl font-bold">{value}</p>
      <div className="mt-1">
        <Badge tone={tone === "green" ? "green" : tone}>{label}</Badge>
      </div>
    </div>
  );
}
