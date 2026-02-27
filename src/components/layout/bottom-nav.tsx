"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Map, Users, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "home", label: "Home", icon: Home, href: "/home" },
  { id: "explore", label: "Explore", icon: Compass, href: "/explore" },
  { id: "map", label: "Map", icon: Map, href: "/map" },
  { id: "tribes", label: "Tribes", icon: Users, href: "/tribes" },
  { id: "profile", label: "Profile", icon: User, href: "/profile" },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-md md:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {tabs.map((tab) => {
          const isActive = pathname.startsWith(tab.href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center rounded-xl p-2 transition-all active:scale-90",
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "h-7 w-7 transition-all",
                  isActive && "stroke-[2.5px] scale-110"
                )}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
