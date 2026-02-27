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
} from "lucide-react";
import { cn } from "@/lib/utils";

const leftTabs = [
  { id: "home", label: "Home", icon: Home, href: "/home" },
  { id: "explore", label: "Explore", icon: Compass, href: "/explore" },
  { id: "map", label: "Map", icon: Map, href: "/map" },
] as const;

const rightTabs = [
  { id: "tribes", label: "Tribes", icon: Users, href: "/tribes" },
  { id: "chat", label: "Chat", icon: MessageCircle, href: "/chat" },
  { id: "profile", label: "Profile", icon: User, href: "/profile" },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center px-6">
      <nav className="flex items-center gap-1.5 rounded-[32px] bg-black px-3 py-2.5 shadow-2xl shadow-black/20 ring-1 ring-white/10">
        {/* Left Tabs */}
        {leftTabs.map((tab) => {
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

        {/* Create Button (Center) */}
        <Link
          href="/create"
          className="mx-1 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/30 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="h-8 w-8 stroke-[3px]" />
        </Link>

        {/* Right Tabs */}
        {rightTabs.map((tab) => {
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
      </nav>
    </div>
  );
}
