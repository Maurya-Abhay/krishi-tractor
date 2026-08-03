import {
  ClipboardList,
  Hammer,
  LayoutDashboard,
  Users,
  Wallet,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { L, type Label } from "@/lib/labels";

export type NavItem = {
  href: string;
  label: Label;
  icon: LucideIcon;
  /** Data to warm the React Query cache on hover/focus before the click. */
  prefetch?: { key: string[]; url: string };
  /** Shown in the bottom bar on mobile (max 5 so targets stay ≥64px wide). */
  mobile: boolean;
};

/**
 * Single source of truth for navigation — the sidebar and the mobile bar were
 * previously two separate arrays that had already drifted (mobile was missing
 * "Services").
 */
export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: L.dashboard, icon: LayoutDashboard, mobile: true },
  { href: "/work", label: L.work, icon: Hammer, mobile: true },
  { href: "/payments", label: L.payments, icon: Wallet, mobile: true },
  {
    href: "/customers",
    label: L.customers,
    icon: Users,
    prefetch: { key: ["customers"], url: "/api/customers" },
    mobile: true,
  },
  { href: "/reports", label: L.reports, icon: ClipboardList, mobile: true },
  {
    href: "/services",
    label: L.services,
    icon: Wrench,
    prefetch: { key: ["services"], url: "/api/services" },
    mobile: false,
  },
];

/**
 * `startsWith` alone marks "/dashboard" active while on "/dashboard-x", and
 * would light up two items if one route were a prefix of another.
 */
export function isActiveRoute(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
