"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, MapPin, Users, Calendar, Flame } from "lucide-react";
import { useTribeStore } from "@/store/use-tribe-store";
import { cn, formatNumber } from "@/lib/utils";

const categories = ["All", "Events", "Trending", "Nearby"];

export default function ExplorePage() {
  const { events, currentCity } = useTribeStore();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredEvents = events
    .filter((e) => e.title.toLowerCase().includes(search.toLowerCase()))
    .filter((e) => {
      if (activeCategory === "Events") return e.type === "event";
      if (activeCategory === "Trending") return e.isTrending;
      return true;
    })
    .sort((a, b) => activeCategory === "Nearby" ? b.participants - a.participants : 0);

  return (
    <div className="bg-background">
      {/* Search Bar Header */}
      <div className="sticky top-0 z-40 space-y-4 border-b bg-background/95 px-4 py-4 backdrop-blur-md">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={`Search in ${currentCity?.name || "your city"}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border bg-muted/30 py-3 pl-12 pr-4 text-[15px] font-medium outline-none transition-all focus:bg-background focus:ring-2 focus:ring-primary/5"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap rounded-lg px-4 py-1.5 text-[14px] font-bold transition-all active:scale-95 ${activeCategory === cat
                ? "bg-black text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Modern Grid */}
      <div className="grid gap-1 grid-cols-3 p-1">
        {filteredEvents.map((event, idx) => (
          <Link
            key={event.id}
            href={`/explore/event/${event.id}`}
            className={cn(
              "relative aspect-square overflow-hidden group bg-muted",
              // Periodic large items like Instagram
              idx % 10 === 0 && "col-span-2 row-span-2 aspect-auto h-full"
            )}
          >
            {event.imageUrl ? (
              <Image
                src={event.imageUrl}
                alt={event.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                No Image
              </div>
            )}

            <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 flex flex-col justify-end p-4">
              <h3 className="text-white text-xs font-bold truncate">{event.title}</h3>
              <div className="flex items-center gap-2 text-white/80 text-[10px]">
                <Flame className="h-2.5 w-2.5" />
                <span>{formatNumber(event.participants)}</span>
              </div>
            </div>

            {event.isTrending && (
              <span className="absolute right-2 top-2 rounded-full bg-white/20 backdrop-blur-md p-1.5">
                <Flame className="h-3 w-3 text-white" />
              </span>
            )}
          </Link>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
          <div className="rounded-full border-2 p-6">
            <Search className="h-10 w-10 text-muted-foreground" />
          </div>
          <p className="font-bold text-muted-foreground">No results found</p>
        </div>
      )}
    </div>
  );
}
