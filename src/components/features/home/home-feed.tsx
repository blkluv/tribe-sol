"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { useTribeStore } from "@/store/use-tribe-store";
import { CityHeader } from "@/components/tribe/city-header";
import { loadCityData } from "@/lib/city-data";
import type { City } from "@/types";
import { CastCard } from "./cast-card";
import { PollCard } from "./poll-card";
import { EventCard } from "./event-card";
import { TaskCard } from "./task-card";
import { CrowdfundCard } from "./crowdfund-card";

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
  const feedItems: { type: string; data: unknown; key: string }[] = [];

  // Add casts
  casts.forEach((cast) => {
    feedItems.push({ type: "cast", data: cast, key: cast.id });
  });

  // Insert events after every 3rd cast
  events.forEach((event, i) => {
    const insertAt = Math.min((i + 1) * 3, feedItems.length);
    feedItems.splice(insertAt + i, 0, { type: "event", data: event, key: event.id });
  });

  // Insert polls
  polls.forEach((poll, i) => {
    const insertAt = Math.min((i + 1) * 4 + 1, feedItems.length);
    feedItems.splice(insertAt + i, 0, { type: "poll", data: poll, key: poll.id });
  });

  // Insert tasks
  tasks.forEach((task, i) => {
    const insertAt = Math.min((i + 1) * 5 + 2, feedItems.length);
    feedItems.splice(insertAt + i, 0, { type: "task", data: task, key: task.id });
  });

  // Insert crowdfunds
  crowdfunds.forEach((cf, i) => {
    const insertAt = Math.min((i + 1) * 6 + 3, feedItems.length);
    feedItems.splice(insertAt + i, 0, { type: "crowdfund", data: cf, key: cf.id });
  });

  if (!currentCity) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* City Header */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b bg-background/95 px-2 py-2 backdrop-blur-md">
        <CityHeader
          city={currentCity}
          cities={allCities}
          onCityChange={handleCityChange}
        />
      </div>

      {/* City switching overlay */}
      {isSwitchingCity && (
        <div className="flex h-32 items-center justify-center">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      )}

      {/* Stories / Tribes Bar */}
      <div className="border-b bg-background overflow-hidden py-4">
        <div className="flex gap-4 overflow-x-auto px-4 no-scrollbar">
          {tribes.map((tribe) => (
            <button key={tribe.id} className="flex flex-col items-center gap-1.5 flex-none group">
              <div className="p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 transition-transform active:scale-90 group-hover:scale-105">
                <div className="h-16 w-16 rounded-full border-2 border-background bg-muted overflow-hidden relative">
                  {tribe.imageUrl ? (
                    <Image src={tribe.imageUrl} alt={tribe.name} fill className="object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xl" style={{ backgroundColor: `${tribe.color}30`, color: tribe.color }}>
                      {tribe.icon}
                    </div>
                  )}
                </div>
              </div>
              <span className="text-[11px] font-medium tracking-tight truncate w-16 text-center">{tribe.name}</span>
            </button>
          ))}
          <button className="flex flex-col items-center gap-1.5 flex-none transition-opacity hover:opacity-70">
            <div className="h-[68px] w-[68px] rounded-full border border-dashed border-muted-foreground/30 flex items-center justify-center text-muted-foreground">
              <Plus className="h-6 w-6" />
            </div>
            <span className="text-[11px] font-medium tracking-tight text-muted-foreground">Discover</span>
          </button>
        </div>
      </div>

      {/* Feed Content */}
      <div className="space-y-1">
        {feedItems.map((item) => {
          switch (item.type) {
            case "cast":
              return <CastCard key={item.key} cast={item.data as import("@/types").Cast} />;
            case "event":
              return <EventCard key={item.key} event={item.data as import("@/types").ExploreItem} />;
            case "poll":
              return <PollCard key={item.key} poll={item.data as import("@/types").Poll} />;
            case "task":
              return <TaskCard key={item.key} task={item.data as import("@/types").Task} />;
            case "crowdfund":
              return <CrowdfundCard key={item.key} crowdfund={item.data as import("@/types").Crowdfund} />;
            default:
              return null;
          }
        })}
      </div>

      {feedItems.length === 0 && (
        <div className="flex h-64 flex-col items-center justify-center gap-2 text-muted-foreground">
          <p className="font-bold">No posts in {currentCity.name} yet</p>
          <p className="text-sm">Be the first to share something!</p>
        </div>
      )}
    </div>
  );
}
