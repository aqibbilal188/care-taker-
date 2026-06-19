import { ReactNode } from "react";
import type { Urgency, SchoolStatus } from "@/lib/data";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  sub,
  icon,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  sub?: string;
  icon?: ReactNode;
  tone?: "default" | "danger" | "warning" | "success";
}) {
  const toneRing: Record<string, string> = {
    default: "bg-indigo-50 text-indigo-600",
    danger: "bg-red-50 text-red-600",
    warning: "bg-amber-50 text-amber-600",
    success: "bg-emerald-50 text-emerald-600",
  };
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
            {value}
          </p>
          {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
        </div>
        {icon && (
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${toneRing[tone]}`}
          >
            {icon}
          </span>
        )}
      </div>
    </Card>
  );
}

const urgencyStyles: Record<Urgency, { label: string; cls: string }> = {
  overdue: { label: "Overdue", cls: "bg-red-100 text-red-700 ring-red-200" },
  critical: {
    label: "Critical",
    cls: "bg-orange-100 text-orange-700 ring-orange-200",
  },
  soon: { label: "Due soon", cls: "bg-amber-100 text-amber-700 ring-amber-200" },
  ok: { label: "On track", cls: "bg-emerald-100 text-emerald-700 ring-emerald-200" },
};

export function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  const s = urgencyStyles[urgency];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${s.cls}`}
    >
      {s.label}
    </span>
  );
}

const statusStyles: Record<SchoolStatus, string> = {
  healthy: "bg-emerald-500",
  attention: "bg-amber-500",
  critical: "bg-red-500",
};

export function StatusDot({ status }: { status: SchoolStatus }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium capitalize text-slate-600">
      <span className={`h-2 w-2 rounded-full ${statusStyles[status]}`} />
      {status}
    </span>
  );
}

export function Badge({
  children,
  tone = "slate",
}: {
  children: ReactNode;
  tone?: "slate" | "red" | "amber" | "green" | "blue" | "violet";
}) {
  const map: Record<string, string> = {
    slate: "bg-slate-100 text-slate-700",
    red: "bg-red-100 text-red-700",
    amber: "bg-amber-100 text-amber-700",
    green: "bg-emerald-100 text-emerald-700",
    blue: "bg-blue-100 text-blue-700",
    violet: "bg-violet-100 text-violet-700",
  };
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${map[tone]}`}
    >
      {children}
    </span>
  );
}

export function HealthBar({ score }: { score: number }) {
  const color =
    score >= 80 ? "bg-emerald-500" : score >= 65 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className={`h-full rounded-full ${color} transition-all`}
        style={{ width: `${score}%` }}
      />
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
