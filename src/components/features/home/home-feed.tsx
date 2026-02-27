"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { useTribeStore } from "@/store/use-tribe-store";
import { loadCityData } from "@/lib/city-data";
import type { City } from "@/types";
import { CastCard } from "./cast-card";
import { PollCard } from "./poll-card";
import { EventCard } from "./event-card";
import { TaskCard } from "./task-card";
import { CrowdfundCard } from "./crowdfund-card";
import { useAuth } from "@/hooks/use-auth";
import { WalletButton } from "@/components/tribe/wallet-button";
import { AppHeader } from "@/components/layout/app-header";

const iconMap: Record<string, string> = {
  bike: "🚲",
  cycling: "🚲",
  utensils: "🍴",
  food: "🍜",
  tech: "💻",
  fitness: "💪",
  music: "🎸",
  camera: "📸",
  mountain: "🏔️",
  landmark: "🏛️",
  palette: "🎨",
  leaf: "🌿",
  rocket: "🚀",
  wine: "🍷",
  pizza: "🍕",
  code: "👨‍💻",
  drama: "🎭",
  users: "👥",
  sun: "☀️",
  dumbbell: "🏋️",
  heart: "❤️",
  star: "⭐",
  "map-pin": "📍",
};

export function HomeFeed() {
  const { casts, polls, events, tasks, crowdfunds, currentCity, tribes } = useTribeStore();
  const { profile } = useAuth();

  // Build mixed feed: interleave content types
  const feedItems: { type: string; data: any; key: string }[] = [];

  // Add casts
  casts.forEach((cast) => {
    feedItems.push({ type: "cast", data: cast, key: cast.id });
  });

  // Insert events after every 2nd item
  events.forEach((event, i) => {
    const insertAt = Math.min((i + 1) * 2, feedItems.length);
    feedItems.splice(insertAt, 0, { type: "event", data: event, key: event.id });
  });

  // Insert polls
  polls.forEach((poll, i) => {
    const insertAt = Math.min((i + 1) * 3 + 1, feedItems.length);
    feedItems.splice(insertAt, 0, { type: "poll", data: poll, key: poll.id });
  });

  // Insert tasks
  tasks.forEach((task, i) => {
    const insertAt = Math.min((i + 1) * 4 + 2, feedItems.length);
    feedItems.splice(insertAt, 0, { type: "task", data: task, key: task.id });
  });

  // Insert crowdfunds
  crowdfunds.forEach((cf, i) => {
    const insertAt = Math.min((i + 1) * 5 + 3, feedItems.length);
    feedItems.splice(insertAt, 0, { type: "crowdfund", data: cf, key: cf.id });
  });

  if (!currentCity) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="pb-24 bg-[#fcfcfc] min-h-screen">
      <AppHeader />

      <div className="px-6 py-6 overflow-hidden">
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {tribes.map((tribe) => (
            <button
              key={tribe.id}
              className="flex items-center gap-3 pl-2 pr-6 py-2 rounded-full bg-white border border-[#f0f0f0] shadow-sm hover:shadow-xl hover:shadow-black/[0.05] transition-all active:scale-95 group shrink-0"
            >
              <div
                className="h-11 w-11 flex items-center justify-center rounded-full text-xl shadow-inner group-hover:rotate-12 transition-transform"
                style={{ backgroundColor: `${tribe.color}15` }}
              >
                {iconMap[tribe.icon] || tribe.icon}
              </div>
              <span className="text-[14px] font-black tracking-tight text-black">{tribe.name}</span>
            </button>
          ))}
          <button className="flex items-center gap-3 pl-2 pr-6 py-2 rounded-full bg-primary/5 text-primary border border-primary/10 shadow-sm shrink-0 font-black text-[14px] hover:bg-primary/10 transition-colors">
            <div className="h-11 w-11 flex items-center justify-center rounded-full bg-white shadow-sm ring-4 ring-primary/5">
              <Plus className="h-5 w-5 stroke-[3px]" />
            </div>
            Discover
          </button>
        </div>
      </div>

      {/* Single Column Feed Layout */}
      <div className="px-6 max-w-2xl mx-auto">
        <div className="flex flex-col gap-6">
          {feedItems.map((item) => (
            <div key={item.key} className="w-full">
              {item.type === "cast" && <CastCard cast={item.data} />}
              {item.type === "event" && <EventCard event={item.data} />}
              {item.type === "poll" && <PollCard poll={item.data} />}
              {item.type === "task" && <TaskCard task={item.data} />}
              {item.type === "crowdfund" && <CrowdfundCard crowdfund={item.data} />}
            </div>
          ))}
        </div>
      </div>

      {feedItems.length === 0 && (
        <div className="flex h-64 flex-col items-center justify-center gap-2 text-muted-foreground">
          <p className="text-xl font-bold tracking-tight">Quiet neighborhood...</p>
          <p className="text-sm font-medium">Be the first to share something in {currentCity.name}!</p>
        </div>
      )}
    </div>
  );
}
