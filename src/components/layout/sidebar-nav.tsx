"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Compass,
  Map,
  Users,
  User,
  MessageCircle,
  Wallet,
  Bell,
  Settings,
  PlusCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainLinks = [
  { id: "home", label: "Home", icon: Home, href: "/home" },
  { id: "explore", label: "Explore", icon: Compass, href: "/explore" },
  { id: "map", label: "Map", icon: Map, href: "/map" },
  { id: "tribes", label: "Tribes", icon: Users, href: "/tribes" },
  { id: "chat", label: "Chat", icon: MessageCircle, href: "/chat" },
];

const secondaryLinks = [
  { id: "wallet", label: "Wallet", icon: Wallet, href: "/wallet" },
  { id: "notifications", label: "Notifications", icon: Bell, href: "/notifications" },
  { id: "profile", label: "Profile", icon: User, href: "/profile" },
  { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-60 lg:w-64 flex-col border-r bg-background h-screen sticky top-0">
      <div className="flex h-14 items-center px-4 border-b">
        <Link href="/home" className="flex items-center gap-2">
          <div
            className="h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: "var(--tribe-primary)" }}
          >
            T
          </div>
          <span className="text-lg font-bold">Tribe</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {mainLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.id}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[var(--tribe-primary)]/10 text-[var(--tribe-primary)]"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}

        <div className="py-2">
          <Link
            href="/create"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: "var(--tribe-primary)" }}
          >
            <PlusCircle className="h-5 w-5" />
            Create
          </Link>
        </div>

        <div className="border-t pt-3 mt-3 space-y-1">
          {secondaryLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.id}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[var(--tribe-primary)]/10 text-[var(--tribe-primary)]"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
