"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, MapPin, Users, Calendar, Flame } from "lucide-react";
import { useTribeStore } from "@/store/use-tribe-store";
import { formatNumber } from "@/lib/utils";

const categories = ["All", "Events", "Trending", "Nearby"];

export default function ExplorePage() {
  const { events, currentCity } = useTribeStore();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="sticky top-0 z-40 border-b bg-background/80 px-4 py-3 backdrop-blur-lg">
        <h1 className="mb-3 text-lg font-bold">Explore</h1>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={`Search in ${currentCity?.name || "your city"}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border bg-muted/50 py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 p-4 sm:grid-cols-2">
        {filteredEvents.map((event) => (
          <Link
            key={event.id}
            href={`/explore/event/${event.id}`}
            className="overflow-hidden rounded-2xl border shadow-tribe-subtle transition-shadow hover:shadow-tribe-small"
          >
            {event.imageUrl && (
              <div className="relative aspect-video">
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                {event.isTrending && (
                  <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-rose-500 px-2.5 py-0.5 text-xs font-medium text-white">
                    <Flame className="h-3 w-3" />
                    Trending
                  </span>
                )}
              </div>
            )}
            <div className="p-4">
              <h3 className="mb-1 font-semibold">{event.title}</h3>
              <p className="mb-2 text-sm text-muted-foreground line-clamp-2">
                {event.description}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {event.location}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {formatNumber(event.participants)}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {event.timeAgo}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="flex h-64 flex-col items-center justify-center text-muted-foreground">
          <p>No events found</p>
        </div>
      )}
    </div>
  );
}
