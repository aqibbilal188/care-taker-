"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShieldHalf } from "lucide-react";
import { navItems } from "./navConfig";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 active:bg-slate-100"
      >
        <Menu size={18} />
      </button>

      {open &&
        mounted &&
        createPortal(
          // Portaled to <body> so it escapes the Topbar's backdrop-blur
          // containing block and covers the full viewport.
          <div className="fixed inset-0 z-50 lg:hidden">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          {/* drawer */}
          <aside className="animate-slidein absolute left-0 top-0 flex h-full w-72 max-w-[82%] flex-col overflow-y-auto bg-slate-900 px-4 py-5 text-slate-300 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500 text-white">
                  <ShieldHalf size={20} />
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-white">Caretaker AI</p>
                  <p className="text-[11px] text-slate-400">Estates Operations</p>
                </div>
              </Link>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="flex flex-1 flex-col gap-1">
              {navItems.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                      active
                        ? "bg-indigo-500/15 text-white ring-1 ring-inset ring-indigo-500/30"
                        : "text-slate-400 active:bg-slate-800"
                    }`}
                  >
                    <Icon
                      size={19}
                      className={active ? "text-indigo-400" : ""}
                    />
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

            <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-slate-800/60 p-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-xs font-semibold text-white">
                JW
              </span>
              <div className="leading-tight">
                <p className="text-xs font-semibold text-white">
                  James Whitfield
                </p>
                <p className="text-[11px] text-slate-400">Operations Manager</p>
              </div>
            </div>
          </aside>
        </div>,
          document.body
        )}
    </div>
  );
}
