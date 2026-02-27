"use client";

import { useTribeStore } from "@/store/use-tribe-store";
import { CastCard } from "./cast-card";
import { PollCard } from "./poll-card";
import { EventCard } from "./event-card";
import { TaskCard } from "./task-card";
import { CrowdfundCard } from "./crowdfund-card";

export function HomeFeed() {
  const { casts, polls, events, tasks, crowdfunds, currentCity } = useTribeStore();

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
        Loading...
      </div>
    );
  }

  return (
    <div>
      {/* City Header */}
      <div
        className="sticky top-0 z-40 flex items-center gap-2 border-b bg-background/80 px-4 py-3 backdrop-blur-lg"
      >
        <div
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: currentCity.accentColor }}
        />
        <h1 className="text-lg font-bold">{currentCity.name}</h1>
        <span className="text-sm text-muted-foreground">{currentCity.country}</span>
      </div>

      {/* Feed */}
      <div>
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
          <p>No content yet in {currentCity.name}</p>
          <p className="text-sm">Be the first to post!</p>
        </div>
      )}
    </div>
  );
}
