"use client";

import { MapPin, Users, Calendar } from "lucide-react";
import { useTribeStore } from "@/store/use-tribe-store";

export default function MapPage() {
  const { currentCity } = useTribeStore();

  return (
    <div>
      <div className="sticky top-0 z-40 flex items-center gap-2 border-b bg-background/80 px-4 py-3 backdrop-blur-lg">
        <MapPin className="h-5 w-5" style={{ color: "var(--tribe-primary)" }} />
        <h1 className="text-lg font-bold">Map</h1>
        <span className="text-sm text-muted-foreground">{currentCity?.name}</span>
      </div>

      <div className="flex h-[calc(100vh-120px)] flex-col items-center justify-center bg-muted/30 p-8 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-500/10">
          <MapPin className="h-10 w-10 text-indigo-500" />
        </div>
        <h2 className="mb-2 text-xl font-bold">Map Discovery</h2>
        <p className="mb-6 max-w-sm text-sm text-muted-foreground">
          Discover nearby users, events, and places in {currentCity?.name || "your city"}.
          Interactive map coming soon with Leaflet/OpenStreetMap.
        </p>
        <div className="grid w-full max-w-sm grid-cols-2 gap-3">
          <div className="rounded-xl border bg-background p-4 text-center">
            <Users className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
            <p className="text-sm font-medium">3 Nearby</p>
            <p className="text-xs text-muted-foreground">Users</p>
          </div>
          <div className="rounded-xl border bg-background p-4 text-center">
            <Calendar className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
            <p className="text-sm font-medium">3 Events</p>
            <p className="text-xs text-muted-foreground">Happening</p>
          </div>
        </div>
      </div>
    </div>
  );
}
