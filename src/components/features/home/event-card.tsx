"use client";

import Image from "next/image";
import { Calendar, MapPin, Users } from "lucide-react";
import type { ExploreItem } from "@/types";
import { formatNumber } from "@/lib/utils";

interface EventCardProps {
  event: ExploreItem;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <div className="border-b bg-background px-4 py-4">
      <div className="overflow-hidden rounded-2xl border">
        {event.imageUrl && (
          <div className="relative aspect-video">
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover"
              sizes="600px"
            />
            {event.isTrending && (
              <span className="absolute left-3 top-3 rounded-full bg-rose-500 px-2.5 py-0.5 text-xs font-medium text-white">
                Trending
              </span>
            )}
          </div>
        )}
        <div className="p-4">
          <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{event.timeAgo}</span>
          </div>
          <h3 className="mb-1 text-base font-semibold">{event.title}</h3>
          <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
            {event.description}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {event.location}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {formatNumber(event.participants)} going
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
