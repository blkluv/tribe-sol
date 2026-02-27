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

// Lazy-load cities data
let citiesCache: City[] | null = null;
async function getCities(): Promise<City[]> {
  if (citiesCache) return citiesCache;
  const mod = await import("@/data/cities");
  citiesCache = mod.cities;
  return mod.cities;
}

export function HomeFeed() {
  const { casts, polls, events, tasks, crowdfunds, currentCity, tribes, switchCity, isSwitchingCity } = useTribeStore();
  const { profile } = useAuth();
  const [allCities, setAllCities] = useState<City[]>([]);

  // Load cities list on first render
  useState(() => {
    getCities().then(setAllCities);
  });

  const handleCityChange = useCallback(async (city: City) => {
    const data = await loadCityData(city);
    switchCity(city, data);
  }, [switchCity]);

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

      {/* Tribe Pulse Bar (Alternative to Stories) */}
      <div className="px-6 py-6 overflow-hidden">
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {tribes.map((tribe) => (
            <button
              key={tribe.id}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-[#f0f0f0] shadow-sm hover:shadow-md transition-all active:scale-95 group shrink-0"
            >
              <span className="text-lg group-hover:scale-125 transition-transform">{tribe.icon}</span>
              <span className="text-[13px] font-bold tracking-tight">{tribe.name}</span>
            </button>
          ))}
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary/5 text-primary border border-primary/10 shadow-sm shrink-0 font-bold text-[13px]">
            <Plus className="h-4 w-4" /> Discover
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
