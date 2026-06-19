import { HardHat, MapPin, Clock, BellOff, BellRing, Send } from "lucide-react";
import { contractorVisits, schoolName } from "@/lib/data";
import { Card, Badge, PageHeader } from "@/components/ui";

const tradeTone: Record<string, string> = {
  "Water Hygiene": "bg-blue-50 text-blue-600",
  "Gas Safety": "bg-orange-50 text-orange-600",
  "Fire Safety": "bg-red-50 text-red-600",
  Electrical: "bg-amber-50 text-amber-600",
  Asbestos: "bg-violet-50 text-violet-600",
};

export default function ContractorsPage() {
  const sorted = [...contractorVisits].sort(
    (a, b) => a.hoursOffset - b.hoursOffset
  );
  const unnotified = contractorVisits.filter((v) => !v.notified).length;

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Contractor Coordination"
        subtitle="Scheduled visits across the estate — AI flags any visit the site team hasn't been told about"
      />

      {unnotified > 0 && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
            <BellOff size={18} />
          </span>
          <div>
            <p className="font-semibold text-red-800">
              {unnotified} contractor visit{unnotified > 1 ? "s" : ""} with no
              site notification
            </p>
            <p className="text-sm text-red-700">
              Caretaker AI can auto-send notifications via email, SMS, WhatsApp
              or Teams before the contractor arrives — closing the visibility
              gap that causes &ldquo;surprise&rdquo; site visits.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {sorted.map((v) => (
          <Card key={v.id} className="p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                  tradeTone[v.trade] ?? "bg-slate-100 text-slate-500"
                }`}
              >
                <HardHat size={22} />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-slate-900">
                    {v.contractor}
                  </h3>
                  <Badge tone="slate">{v.trade}</Badge>
                </div>
                <p className="mt-0.5 text-sm text-slate-600">{v.purpose}</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} /> {schoolName(v.schoolId)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {v.whenLabel}
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                {v.notified ? (
                  <span className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
                    <BellRing size={14} /> Site notified
                  </span>
                ) : (
                  <button className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700">
                    <Send size={14} /> Notify site team
                  </button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
