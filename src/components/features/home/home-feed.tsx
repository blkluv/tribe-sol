"use client";

import Image from "next/image";
import { Plus, Heart, MessageCircle, Share2, Bookmark, Coins } from "lucide-react";
import { useTribeStore } from "@/store/use-tribe-store";
import { CastCard } from "./cast-card";
import { PollCard } from "./poll-card";
import { EventCard } from "./event-card";
import { TaskCard } from "./task-card";
import { CrowdfundCard } from "./crowdfund-card";

export function HomeFeed() {
  const { casts, polls, events, tasks, crowdfunds, currentCity, tribes } = useTribeStore();

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
      <div className="sticky top-0 z-40 flex items-center justify-between border-b bg-white/95 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: currentCity.accentColor }} />
          <h1 className="text-xl font-black tracking-tight">{currentCity.name}</h1>
        </div>
        <button className="text-xs font-black uppercase tracking-widest text-muted-foreground">Switch</button>
      </div>

      {/* Stories / Tribes Bar */}
      <div className="border-b bg-white overflow-hidden py-4">
        <div className="flex gap-4 overflow-x-auto px-4 no-scrollbar">
          {tribes.map((tribe) => (
            <button key={tribe.id} className="flex flex-col items-center gap-1.5 flex-none group">
              <div className="p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 transition-transform active:scale-90 group-hover:scale-105">
                <div className="h-16 w-16 rounded-full border-2 border-white bg-muted overflow-hidden relative">
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
