"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  User,
  Bell,
  Shield,
  Moon,
  Sun,
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
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <div className="sticky top-0 z-40 border-b bg-background/80 px-4 py-3 backdrop-blur-lg">
        <h1 className="text-lg font-bold">Settings</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Theme toggle */}
        <div className="rounded-2xl border p-4">
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Appearance</h2>
          <div className="flex gap-2">
            {[
              { value: "light", label: "Light", icon: Sun },
              { value: "dark", label: "Dark", icon: Moon },
              { value: "system", label: "System", icon: Globe },
            ].map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  onClick={() => setTheme(opt.value)}
                  className={`flex flex-1 flex-col items-center gap-2 rounded-xl border p-3 transition-colors ${
                    theme === opt.value
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10"
                      : "hover:bg-muted"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {settingGroups.map((group) => (
          <div key={group.title} className="rounded-2xl border">
            <h2 className="px-4 pt-4 pb-2 text-sm font-semibold text-muted-foreground">
              {group.title}
            </h2>
            {group.items.map((item, i) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className={`flex w-full items-center gap-3 px-4 py-3 hover:bg-muted/50 ${
                    i < group.items.length - 1 ? "border-b" : ""
                  }`}
                >
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <span className="flex-1 text-left text-sm">{item.label}</span>
                  {"value" in item && (
                    <span className="text-sm text-muted-foreground">{item.value}</span>
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
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 py-3 text-red-500 transition-colors hover:bg-red-50 dark:border-red-500/20 dark:hover:bg-red-500/10"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-semibold">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
