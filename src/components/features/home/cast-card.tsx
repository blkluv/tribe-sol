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
    <div className="bg-white border-b border-muted/30">
      {/* Header */}
      <div className="flex items-center gap-3 px-3 py-3">
        <div className="relative h-9 w-9 overflow-hidden rounded-full ring-1 ring-muted">
          <Image
            src={cast.user.avatarUrl}
            alt={cast.user.displayName}
            fill
            className="object-cover"
            sizes="36px"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[13px] font-bold tracking-tight hover:underline cursor-pointer">{cast.user.username}</span>
            {cast.user.isVerified && (
              <span className="text-[10px] text-blue-500 font-black">●</span>
            )}
            <span className="text-[13px] text-muted-foreground">•</span>
            <span className="text-[13px] text-muted-foreground">{cast.timestamp}</span>
          </div>
        </div>
        <button className="text-muted-foreground hover:text-foreground">
          <div className="flex gap-0.5">
            <div className="h-1 w-1 rounded-full bg-current" />
            <div className="h-1 w-1 rounded-full bg-current" />
            <div className="h-1 w-1 rounded-full bg-current" />
          </div>
        </button>
      </div>

      {/* Image Container */}
      <div className="relative aspect-square bg-muted/20">
        <Image
          src={cast.imageUrl}
          alt={cast.caption}
          fill
          className="object-cover transition-all hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, 600px"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-3 py-3">
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => likeCast(cast.id)}
            className="transition-colors hover:opacity-70"
          >
            <Heart
              className={cn(
                "h-7 w-7",
                cast.isLiked ? "fill-red-500 text-red-500" : "text-foreground stroke-[2px]"
              )}
            />
          </motion.button>
          <button className="transition-colors hover:opacity-70">
            <MessageCircle className="h-7 w-7 stroke-[2px]" />
          </button>
          <button className="transition-colors hover:opacity-70">
            <Share2 className="h-7 w-7 stroke-[2px]" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          {cast.tipCount > 0 && (
            <button className="flex items-center gap-1.5 rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-bold text-yellow-600 transition-colors hover:bg-yellow-400/20">
              <Coins className="h-3.5 w-3.5" />
              Tip {cast.tipCount}
            </button>
          )}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => bookmarkCast(cast.id)}
            className="transition-colors hover:opacity-70"
          >
            <Bookmark
              className={cn(
                "h-7 w-7 stroke-[2px]",
                cast.isSaved ? "fill-foreground text-foreground" : "text-foreground"
              )}
            />
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-4 space-y-1.5">
        <p className="text-[14px] font-bold tracking-tight">{formatNumber(cast.likes)} likes</p>
        <div className="text-[14px] leading-snug">
          <span className="font-bold tracking-tight hover:underline cursor-pointer mr-1.5">{cast.user.username}</span>
          <span className="font-medium text-foreground/90">{cast.caption}</span>
        </div>
        {cast.comments.length > 0 && (
          <button className="text-[14px] text-muted-foreground hover:text-muted-foreground/80 transition-colors">
            View all {cast.comments.length} comments
          </button>
        )}
      </div>
    </div>
  );
}
