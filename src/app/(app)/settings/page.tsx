"use client";

import { useRouter } from "next/navigation";
import {
  User,
  Bell,
  Shield,
  Globe,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
} from "lucide-react";

const settingGroups = [
  {
    title: "Account",
    items: [
      { id: "profile", label: "Edit Profile", icon: User },
      { id: "notifications", label: "Notifications", icon: Bell },
      { id: "privacy", label: "Privacy & Security", icon: Shield },
    ],
  },
  {
    title: "Preferences",
    items: [
      { id: "language", label: "Language", icon: Globe, value: "English" },
    ],
  },
  {
    title: "About",
    items: [
      { id: "help", label: "Help & Support", icon: HelpCircle },
      { id: "about", label: "About Tribe", icon: Info, value: "v1.0.0" },
    ],
  },
];

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="bg-white min-h-screen">
      <div className="sticky top-0 z-40 border-b bg-white/95 px-4 py-4 backdrop-blur-md">
        <h1 className="text-xl font-black lowercase tracking-tighter">Settings</h1>
      </div>

      <div className="p-4 space-y-6">
        {settingGroups.map((group) => (
          <div key={group.title} className="rounded-2xl border bg-white overflow-hidden shadow-sm">
            <h2 className="px-4 pt-4 pb-2 text-xs font-black uppercase tracking-widest text-muted-foreground/60">
              {group.title}
            </h2>
            {group.items.map((item, i) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className={`flex w-full items-center gap-3 px-4 py-4 transition-colors hover:bg-muted/30 ${i < group.items.length - 1 ? "border-b" : ""
                    }`}
                >
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <span className="flex-1 text-left text-[14px] font-bold tracking-tight">{item.label}</span>
                  {"value" in item && (
                    <span className="text-[13px] font-medium text-muted-foreground">{item.value}</span>
                  )}
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              );
            })}
          </div>
        ))}

        {/* Sign Out */}
        <button
          onClick={() => router.push("/")}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50/30 py-4 text-red-500 transition-all hover:bg-red-50 active:scale-95"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-[14px] font-bold">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
