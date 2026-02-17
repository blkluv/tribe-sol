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
import { WalletButton } from "@/components/tribe/wallet-button";

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
    <aside className="hidden h-screen flex-col border-r bg-background sticky top-0 md:flex md:w-20 lg:w-64">
      <div className="flex px-3 py-10 lg:px-6">
        <Link href="/home" className="flex items-center gap-2">
          <span className="text-2xl font-black lowercase tracking-tighter lg:block hidden">tribe</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white font-black text-sm lg:hidden">
            t
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-2 px-3">
        {mainLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.id}
              href={link.href}
              className={cn(
                "group flex items-center gap-4 rounded-xl px-3 py-3 transition-all active:scale-95",
                isActive
                  ? "font-bold text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "h-7 w-7 transition-transform group-hover:scale-110",
                  isActive && "stroke-[3px]"
                )}
              />
              <span className="text-base lg:block hidden tracking-tight">{link.label}</span>
            </Link>
          );
        })}

        <Link
          href="/create"
          className="group flex items-center gap-4 rounded-xl px-3 py-3 text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-95"
        >
          <PlusCircle className="h-7 w-7 transition-transform group-hover:scale-110" />
          <span className="text-base lg:block hidden tracking-tight">Create</span>
        </Link>

        <div className="pt-4 mt-4 border-t space-y-2">
          {secondaryLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.id}
                href={link.href}
                className={cn(
                  "group flex items-center gap-4 rounded-xl px-3 py-3 transition-all active:scale-95",
                  isActive
                    ? "font-bold text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "h-7 w-7 transition-transform group-hover:scale-110",
                    isActive && "stroke-[3px]"
                  )}
                />
                <span className="text-base lg:block hidden tracking-tight">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Wallet connection indicator */}
      <div className="p-4 lg:p-6 w-full space-y-3">
        <WalletButton className="w-full justify-center lg:justify-start" compact={false} />
      </div>
    </aside>
  );
}
