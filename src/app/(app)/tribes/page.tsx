"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Users, Lock } from "lucide-react";
import { useTribeStore } from "@/store/use-tribe-store";
import { tribeCategoryConfig } from "@/lib/theme";
import { formatNumber } from "@/lib/utils";
import type { TribeCategory } from "@/types";

export default function TribesPage() {
  const { tribes, currentCity } = useTribeStore();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | TribeCategory>("all");

  const filtered = tribes.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "all" || t.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const joinedTribes = filtered.filter((t) => t.isJoined);
  const discoverTribes = filtered.filter((t) => !t.isJoined);

  const categories = Array.from(new Set(tribes.map((t) => t.category)));

  return (
    <div>
      <div className="sticky top-0 z-40 border-b bg-background/80 px-4 py-3 backdrop-blur-lg">
        <h1 className="mb-3 text-lg font-bold">Tribes</h1>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tribes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border bg-muted/50 py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveCategory("all")}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === "all"
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {tribeCategoryConfig[cat]?.label || cat}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {/* Your Tribes */}
        {joinedTribes.length > 0 && (
          <div className="mb-6">
            <h2 className="mb-3 text-base font-semibold">Your Tribes</h2>
            <div className="space-y-3">
              {joinedTribes.map((tribe) => (
                <TribeListItem key={tribe.id} tribe={tribe} />
              ))}
            </div>
          </div>
        )}

        {/* Discover */}
        {discoverTribes.length > 0 && (
          <div>
            <h2 className="mb-3 text-base font-semibold">Discover</h2>
            <div className="space-y-3">
              {discoverTribes.map((tribe) => (
                <TribeListItem key={tribe.id} tribe={tribe} />
              ))}
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="flex h-48 items-center justify-center text-muted-foreground">
            No tribes found
          </div>
        )}
      </div>
    </div>
  );
}

function TribeListItem({ tribe }: { tribe: import("@/types").Tribe }) {
  const { joinTribe, leaveTribe } = useTribeStore();

  return (
    <Link
      href={`/tribes/${tribe.id}`}
      className="flex items-center gap-3 rounded-2xl border p-3 transition-shadow hover:shadow-tribe-subtle"
    >
      <div
        className="flex h-12 w-12 items-center justify-center rounded-xl text-white"
        style={{ backgroundColor: `#${tribe.color}` }}
      >
        <Users className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold truncate">{tribe.name}</span>
          {tribe.isPrivate && <Lock className="h-3 w-3 text-muted-foreground" />}
        </div>
        <p className="text-xs text-muted-foreground">
          {formatNumber(tribe.members)} members
        </p>
      </div>
      <button
        onClick={(e) => {
          e.preventDefault();
          tribe.isJoined ? leaveTribe(tribe.id) : joinTribe(tribe.id);
        }}
        className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
          tribe.isJoined
            ? "bg-muted text-muted-foreground hover:bg-red-100 hover:text-red-600"
            : "text-white"
        }`}
        style={!tribe.isJoined ? { backgroundColor: "var(--tribe-primary)" } : undefined}
      >
        {tribe.isJoined ? "Joined" : "Join"}
      </button>
    </Link>
  );
}
