import {
  LayoutDashboard,
  Building2,
  ShieldCheck,
  HardHat,
  Headphones,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
}

export const navItems: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/schools", label: "Schools", icon: Building2 },
  { href: "/compliance", label: "Compliance", icon: ShieldCheck },
  { href: "/contractors", label: "Contractors", icon: HardHat },
  { href: "/helpdesk", label: "Help Desk", icon: Headphones },
  { href: "/assistant", label: "AI Assistant", icon: Sparkles, badge: "AI" },
];
