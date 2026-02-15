"use client";

import Link from "next/link";
import { PenSquare, Calendar, BarChart3, CheckCircle, Banknote, Hash } from "lucide-react";

const createOptions = [
  {
    id: "cast",
    label: "Cast",
    description: "Share a photo or update",
    icon: PenSquare,
    color: "#6366F1",
    href: "#",
  },
  {
    id: "event",
    label: "Event",
    description: "Create a local event",
    icon: Calendar,
    color: "#14B8A6",
    href: "#",
  },
  {
    id: "poll",
    label: "Poll",
    description: "Ask the community",
    icon: BarChart3,
    color: "#FB7185",
    href: "#",
  },
  {
    id: "task",
    label: "Task",
    description: "Request community help",
    icon: CheckCircle,
    color: "#FB923C",
    href: "#",
  },
  {
    id: "crowdfund",
    label: "Crowdfund",
    description: "Raise funds for a cause",
    icon: Banknote,
    color: "#A78BFA",
    href: "#",
  },
  {
    id: "channel",
    label: "Channel",
    description: "Start a new community",
    icon: Hash,
    color: "#38BDF8",
    href: "#",
  },
];

export default function CreatePage() {
  return (
    <div>
      <div className="sticky top-0 z-40 border-b bg-background/80 px-4 py-3 backdrop-blur-lg">
        <h1 className="text-lg font-bold">Create</h1>
        <p className="text-sm text-muted-foreground">What do you want to share?</p>
      </div>

      <div className="grid grid-cols-2 gap-3 p-4">
        {createOptions.map((opt) => {
          const Icon = opt.icon;
          return (
            <button
              key={opt.id}
              className="flex flex-col items-center gap-3 rounded-2xl border p-6 text-center transition-shadow hover:shadow-tribe-small"
            >
              <div
                className="flex h-14 w-14 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${opt.color}15`, color: opt.color }}
              >
                <Icon className="h-7 w-7" />
              </div>
              <div>
                <p className="font-semibold">{opt.label}</p>
                <p className="text-xs text-muted-foreground">{opt.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
