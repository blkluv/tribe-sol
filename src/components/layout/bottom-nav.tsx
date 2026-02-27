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
  Plus,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotificationStore } from "@/store/use-notification-store";

const mainTabs = [
  { id: "home", label: "Home", icon: Home, href: "/home" },
  { id: "explore", label: "Explore", icon: Compass, href: "/explore" },
  { id: "map", label: "Map", icon: Map, href: "/map" },
  { id: "tribes", label: "Tribes", icon: Users, href: "/tribes" },
] as const;

const secondaryTabs = [
  { id: "chat", label: "Chat", icon: MessageCircle, href: "/chat" },
  { id: "notifications", label: "Notifications", icon: Bell, href: "/notifications" },
  { id: "profile", label: "Profile", icon: User, href: "/profile" },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  return (
    <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center px-6">
      <nav className="flex items-center gap-1.5 rounded-[32px] bg-black px-3 py-2.5 shadow-2xl shadow-black/20 ring-1 ring-white/10">
        {/* Main Links */}
        {mainTabs.map((tab) => {
          const isActive = pathname.startsWith(tab.href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center rounded-2xl px-4 py-2.5 transition-all active:scale-90",
                isActive ? "bg-white text-black" : "text-white/60 hover:text-white"
              )}
            >
              <Icon
                className={cn(
                  "h-6 w-6 transition-all",
                  isActive && "stroke-[2.5px]"
                )}
              />
            </Link>
          );
        })}

        {/* Create Button (Special) */}
        <Link
          href="/create"
          className="mx-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="h-8 w-8 stroke-[3px]" />
        </Link>

        {/* Secondary Links */}
        {secondaryTabs.map((tab) => {
          const isActive = pathname.startsWith(tab.href);
          const Icon = tab.icon;
          const showBadge = tab.id === "notifications" && unreadCount > 0;

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={cn(
                "relative flex flex-col items-center justify-center rounded-2xl px-4 py-2.5 transition-all active:scale-90",
                isActive ? "bg-white text-black" : "text-white/60 hover:text-white"
              )}
            >
              <Icon
                className={cn(
                  "h-6 w-6 transition-all",
                  isActive && "stroke-[2.5px]"
                )}
              />
              {showBadge && (
                <span className="absolute right-3 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white ring-2 ring-black">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
