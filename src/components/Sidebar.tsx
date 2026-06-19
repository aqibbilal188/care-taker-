"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  ShieldCheck,
  HardHat,
  Headphones,
  Sparkles,
  ShieldHalf,
} from "lucide-react";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/schools", label: "Schools", icon: Building2 },
  { href: "/compliance", label: "Compliance", icon: ShieldCheck },
  { href: "/contractors", label: "Contractors", icon: HardHat },
  { href: "/helpdesk", label: "Help Desk", icon: Headphones },
  { href: "/assistant", label: "AI Assistant", icon: Sparkles, badge: "AI" },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-900 px-4 py-5 text-slate-300 lg:flex">
      <Link href="/" className="mb-8 flex items-center gap-2.5 px-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500 text-white">
          <ShieldHalf size={20} />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-white">Caretaker AI</p>
          <p className="text-[11px] text-slate-400">Estates Operations</p>
        </div>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {nav.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-indigo-500/15 text-white ring-1 ring-inset ring-indigo-500/30"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon size={18} className={active ? "text-indigo-400" : ""} />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="rounded bg-indigo-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 rounded-xl bg-slate-800/60 p-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-xs font-semibold text-white">
            JW
          </span>
          <div className="leading-tight">
            <p className="text-xs font-semibold text-white">James Whitfield</p>
            <p className="text-[11px] text-slate-400">Operations Manager</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
