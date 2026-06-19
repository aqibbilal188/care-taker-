import {
  MapPin,
  Users,
  Building,
  AlertTriangle,
  ShieldAlert,
  Clock,
} from "lucide-react";
import { schools, complianceTasks, tickets } from "@/lib/data";
import { Card, StatusDot, HealthBar, PageHeader } from "@/components/ui";

export default function SchoolsPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Schools"
        subtitle="Every site in your estate, with live operational health"
      />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {schools.map((s) => {
          const overdue = complianceTasks.filter(
            (t) => t.schoolId === s.id && t.urgency === "overdue"
          ).length;
          const openTickets = tickets.filter(
            (t) => t.schoolId === s.id && t.status !== "resolved"
          ).length;
          return (
            <Card key={s.id} className="overflow-hidden">
              <div className="border-b border-slate-100 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      {s.name}
                    </h2>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                      <MapPin size={12} /> {s.address}
                    </p>
                  </div>
                  <StatusDot status={s.status} />
                </div>
                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-slate-400">Compliance health</span>
                    <span className="font-semibold text-slate-700">
                      {s.healthScore}%
                    </span>
                  </div>
                  <HealthBar score={s.healthScore} />
                </div>
              </div>
              <div className="grid grid-cols-2 divide-x divide-slate-100 text-center text-sm">
                <div className="flex items-center justify-center gap-1.5 py-3 text-slate-600">
                  <Users size={14} className="text-slate-400" /> {s.pupils}
                </div>
                <div className="flex items-center justify-center gap-1.5 py-3 text-slate-600">
                  <Building size={14} className="text-slate-400" />{" "}
                  {s.buildings} buildings
                </div>
              </div>
              <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-2 text-center text-xs text-slate-500">
                {s.taskTotal} PPM tasks tracked · {s.statutoryTotal} statutory
              </div>
              <div className="grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100 text-center">
                <Metric
                  icon={<AlertTriangle size={14} />}
                  value={s.openIncidents}
                  label="Incidents"
                  danger={s.openIncidents > 0}
                />
                <Metric
                  icon={<ShieldAlert size={14} />}
                  value={overdue}
                  label="Overdue"
                  danger={overdue > 0}
                />
                <Metric
                  icon={<Clock size={14} />}
                  value={openTickets}
                  label="Open jobs"
                  danger={false}
                />
              </div>
              <div className="flex items-center justify-between bg-slate-50 px-5 py-3 text-xs">
                <span className="text-slate-400">Facility Manager</span>
                <span className="font-medium text-slate-700">{s.manager}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function Metric({
  icon,
  value,
  label,
  danger,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  danger: boolean;
}) {
  return (
    <div className="py-3">
      <div
        className={`flex items-center justify-center gap-1 text-lg font-semibold ${
          danger ? "text-red-600" : "text-slate-700"
        }`}
      >
        <span className={danger ? "text-red-500" : "text-slate-400"}>
          {icon}
        </span>
        {value}
      </div>
      <p className="text-[11px] text-slate-400">{label}</p>
    </div>
  );
}
