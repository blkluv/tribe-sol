"use client";

import { useState } from "react";
import { MapPin, Users, Calendar, Navigation, Coffee, Dumbbell, Music, Zap } from "lucide-react";
import { useTribeStore } from "@/store/use-tribe-store";
import { cn } from "@/lib/utils";

const filters = [
  { id: "all", label: "All", icon: MapPin },
  { id: "events", label: "Events", icon: Calendar },
  { id: "people", label: "People", icon: Users },
  { id: "places", label: "Places", icon: Coffee },
];

const mockPins = [
  { id: 1, type: "event", label: "Yoga in the Park", x: 35, y: 25, color: "#14B8A6", icon: Dumbbell, attendees: 12 },
  { id: 2, type: "people", label: "3 members nearby", x: 55, y: 40, color: "#6366F1", icon: Users, attendees: 3 },
  { id: 3, type: "event", label: "Live Music Night", x: 70, y: 55, color: "#A78BFA", icon: Music, attendees: 45 },
  { id: 4, type: "places", label: "Co-working Hub", x: 25, y: 60, color: "#FB923C", icon: Coffee, attendees: 8 },
  { id: 5, type: "event", label: "Cycling Meetup", x: 60, y: 20, color: "#FB7185", icon: Zap, attendees: 22 },
  { id: 6, type: "people", label: "5 members nearby", x: 40, y: 70, color: "#6366F1", icon: Users, attendees: 5 },
  { id: 7, type: "places", label: "Community Garden", x: 80, y: 35, color: "#14B8A6", icon: MapPin, attendees: 6 },
];

export default function MapPage() {
  const { currentCity, events } = useTribeStore();
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedPin, setSelectedPin] = useState<number | null>(null);

  const filteredPins = activeFilter === "all"
    ? mockPins
    : mockPins.filter((p) => p.type === activeFilter);

  const nearbyCount = events.length;

  return (
    <div>
      <div className="sticky top-0 z-40 flex items-center gap-2 border-b bg-background/80 px-4 py-3 backdrop-blur-lg">
        <MapPin className="h-5 w-5" style={{ color: "var(--tribe-primary)" }} />
        <h1 className="text-lg font-bold">Map</h1>
        <span className="text-sm text-muted-foreground">{currentCity?.name}</span>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto px-4 py-3 no-scrollbar">
        {filters.map((f) => {
          const Icon = f.icon;
          return (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={cn(
                "flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                activeFilter === f.id
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Map Area */}
      <div className="relative mx-4 h-[calc(100vh-240px)] min-h-[400px] overflow-hidden rounded-2xl border bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-50 dark:from-emerald-950/30 dark:via-blue-950/30 dark:to-indigo-950/30">
        {/* Grid lines for map feel */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(8)].map((_, i) => (
            <div key={`h-${i}`} className="absolute left-0 right-0 border-b border-foreground/20" style={{ top: `${(i + 1) * 12.5}%` }} />
          ))}
          {[...Array(8)].map((_, i) => (
            <div key={`v-${i}`} className="absolute top-0 bottom-0 border-r border-foreground/20" style={{ left: `${(i + 1) * 12.5}%` }} />
          ))}
        </div>

        {/* Roads */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute left-[20%] top-0 bottom-0 w-1 bg-foreground/30 rounded-full" />
          <div className="absolute left-[50%] top-0 bottom-0 w-1.5 bg-foreground/40 rounded-full" />
          <div className="absolute left-0 right-0 top-[45%] h-1.5 bg-foreground/40 rounded-full" />
          <div className="absolute left-0 right-0 top-[75%] h-1 bg-foreground/30 rounded-full" />
        </div>

        {/* User Location */}
        <div className="absolute z-20" style={{ left: "48%", top: "45%" }}>
          <div className="relative">
            <div className="absolute -inset-4 animate-ping rounded-full bg-indigo-500/20" />
            <div className="absolute -inset-2 rounded-full bg-indigo-500/30" />
            <div className="relative h-4 w-4 rounded-full border-2 border-white bg-indigo-500 shadow-lg" />
          </div>
        </div>

        {/* Pins */}
        {filteredPins.map((pin) => {
          const Icon = pin.icon;
          const isSelected = selectedPin === pin.id;
          return (
            <button
              key={pin.id}
              onClick={() => setSelectedPin(isSelected ? null : pin.id)}
              className="absolute z-10 transition-transform hover:scale-110"
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
            >
              <div className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full shadow-lg transition-all border-2 border-white",
                isSelected && "scale-125 ring-2 ring-offset-1"
              )} style={{ backgroundColor: pin.color }}>
                <Icon className="h-4 w-4 text-white" />
              </div>
              {isSelected && (
                <div className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-lg bg-background px-3 py-1.5 text-xs font-medium shadow-lg border">
                  <p className="font-semibold">{pin.label}</p>
                  <p className="text-muted-foreground">{pin.attendees} people</p>
                </div>
              )}
            </button>
          );
        })}

        {/* Locate me button */}
        <button className="absolute bottom-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-background shadow-lg border hover:bg-muted transition-colors">
          <Navigation className="h-5 w-5" />
        </button>
      </div>

      {/* Bottom stats */}
      <div className="grid grid-cols-3 gap-3 p-4">
        <div className="rounded-xl border bg-background p-3 text-center">
          <Users className="mx-auto mb-1 h-5 w-5 text-indigo-500" />
          <p className="text-sm font-bold">8</p>
          <p className="text-[10px] text-muted-foreground">Nearby</p>
        </div>
        <div className="rounded-xl border bg-background p-3 text-center">
          <Calendar className="mx-auto mb-1 h-5 w-5 text-emerald-500" />
          <p className="text-sm font-bold">{nearbyCount}</p>
          <p className="text-[10px] text-muted-foreground">Events</p>
        </div>
        <div className="rounded-xl border bg-background p-3 text-center">
          <Coffee className="mx-auto mb-1 h-5 w-5 text-orange-500" />
          <p className="text-sm font-bold">4</p>
          <p className="text-[10px] text-muted-foreground">Places</p>
        </div>
      </div>
    </div>
  );
}
