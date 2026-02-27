"use client";

import Image from "next/image";
import { Heart, MessageCircle, Share2, Bookmark, Coins } from "lucide-react";
import { motion } from "framer-motion";
import type { Cast } from "@/types";
import { cn, formatNumber } from "@/lib/utils";
import { useTribeStore } from "@/store/use-tribe-store";

interface CastCardProps {
  cast: Cast;
}

export function CastCard({ cast }: CastCardProps) {
  const { likeCast, bookmarkCast } = useTribeStore();

  return (
    <div className="border-b bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="relative h-10 w-10 overflow-hidden rounded-full">
          <Image
            src={cast.user.avatarUrl}
            alt={cast.user.displayName}
            fill
            className="object-cover"
            sizes="40px"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold">{cast.user.displayName}</span>
            {cast.user.isVerified && (
              <span className="text-xs text-indigo-500">&#10003;</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{cast.timestamp}</p>
        </div>
      </div>

      {/* Image */}
      <div className="relative aspect-square">
        <Image
          src={cast.imageUrl}
          alt={cast.caption}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 600px"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 px-3 py-2">
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => likeCast(cast.id)}
          className="rounded-full p-2 hover:bg-muted"
        >
          <Heart
            className={cn(
              "h-6 w-6",
              cast.isLiked ? "fill-pink-500 text-pink-500" : "text-foreground"
            )}
          />
        </motion.button>
        <button className="rounded-full p-2 hover:bg-muted">
          <MessageCircle className="h-6 w-6" />
        </button>
        <button className="rounded-full p-2 hover:bg-muted">
          <Share2 className="h-6 w-6" />
        </button>
        <div className="flex-1" />
        {cast.tipCount > 0 && (
          <span className="mr-1 flex items-center gap-1 text-xs text-muted-foreground">
            <Coins className="h-3.5 w-3.5" />
            {cast.tipCount}
          </span>
        )}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => bookmarkCast(cast.id)}
          className="rounded-full p-2 hover:bg-muted"
        >
          <Bookmark
            className={cn(
              "h-6 w-6",
              cast.isSaved ? "fill-amber-500 text-amber-500" : "text-foreground"
            )}
          />
        </motion.button>
      </div>

      {/* Likes + Caption */}
      <div className="px-4 pb-3">
        <p className="mb-1 text-sm font-semibold">{formatNumber(cast.likes)} likes</p>
        <p className="text-sm">
          <span className="font-semibold">{cast.user.username} </span>
          {cast.caption}
        </p>
        {cast.comments.length > 0 && (
          <button className="mt-1 text-sm text-muted-foreground">
            View all {cast.comments.length} comments
          </button>
        )}
      </div>
    </div>
  );
}
