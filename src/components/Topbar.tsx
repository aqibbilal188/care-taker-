"use client";

import Link from "next/link";
import { Search, Bell, Sparkles } from "lucide-react";
import { portfolioStats } from "@/lib/data";

export default function Topbar() {
  const stats = portfolioStats();
  const alertCount = stats.overdueCompliance + stats.slaAtRisk + stats.unnotifiedVisits;
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-slate-200 bg-white/80 px-5 backdrop-blur">
      <div className="flex items-center gap-2 lg:hidden">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 text-sm font-bold text-white">
          C
        </span>
        <span className="font-semibold text-slate-900">Caretaker AI</span>
      </div>

      <div className="relative hidden flex-1 max-w-md md:block">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          placeholder="Ask Caretaker or search sites, jobs, contractors…"
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Link
          href="/assistant"
          className="hidden items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 sm:flex"
        >
          <Sparkles size={15} />
          Ask AI
        </Link>
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50">
          <Bell size={17} />
          {alertCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white animate-pulsering">
              {alertCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
