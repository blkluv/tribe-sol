"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { motion } from "framer-motion";
import type { Cast } from "@/types";
import { cn, formatNumber } from "@/lib/utils";
import { useTribeStore } from "@/store/use-tribe-store";
import { useLike } from "@/hooks/use-like";
import { useTip } from "@/hooks/use-tip";
import { useShare } from "@/hooks/use-share";
import { useAuth } from "@/hooks/use-auth";
import { FollowButton } from "@/components/tribe/follow-button";
import { TipButton } from "@/components/tribe/tip-button";
import { CommentSheet } from "./comment-sheet";

interface CastCardProps {
  cast: Cast;
}

export function CastCard({ cast }: CastCardProps) {
  const { likeCast, bookmarkCast, tipCast } = useTribeStore();
  const { isAuthenticated } = useAuth();
  const { isLiked, likeCount, toggleLike } = useLike(
    cast.id,
    cast.isLiked,
    cast.likes
  );
  const { sendTip, isWalletReady } = useTip();
  const { share, showToast: showShareToast } = useShare();
  const [showComments, setShowComments] = useState(false);

  const handleTip = async (amount: number) => {
    const result = await sendTip(cast.id, amount, cast.user.username);
    if (result.success) {
      tipCast(cast.id, amount);
    }
    return result;
  };

  const handleLike = async () => {
    // Always update local store
    likeCast(cast.id);
    // If authenticated, also update Tapestry
    if (isAuthenticated) {
      await toggleLike();
    }
  };

  return (
    <>
      <div className="bg-background border-b border-muted/30">
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
              <span className="text-[13px] font-bold tracking-tight hover:underline cursor-pointer">
                {cast.user.username}
              </span>
              {cast.user.isVerified && (
                <span className="text-[10px] text-blue-500 font-black">●</span>
              )}
              <span className="text-[13px] text-muted-foreground">•</span>
              <span className="text-[13px] text-muted-foreground">
                {cast.timestamp}
              </span>
            </div>
          </div>
          <FollowButton targetProfileId={cast.user.id} />
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
              onClick={handleLike}
              className="transition-colors hover:opacity-70"
            >
              <Heart
                className={cn(
                  "h-7 w-7",
                  isLiked
                    ? "fill-red-500 text-red-500"
                    : "text-foreground stroke-[2px]"
                )}
              />
            </motion.button>
            <button
              onClick={() => setShowComments(true)}
              className="transition-colors hover:opacity-70"
            >
              <MessageCircle className="h-7 w-7 stroke-[2px]" />
            </button>
            <button
              onClick={() => share(
                `${cast.user.username} on Tribe`,
                cast.caption.slice(0, 100),
                `${typeof window !== "undefined" ? window.location.origin : ""}/home#${cast.id}`
              )}
              className="transition-colors hover:opacity-70"
            >
              <Share2 className="h-7 w-7 stroke-[2px]" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <TipButton
              tipCount={cast.tipCount}
              onTip={handleTip}
              isWalletReady={isWalletReady}
            />
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => bookmarkCast(cast.id)}
              className="transition-colors hover:opacity-70"
            >
              <Bookmark
                className={cn(
                  "h-7 w-7 stroke-[2px]",
                  cast.isSaved
                    ? "fill-foreground text-foreground"
                    : "text-foreground"
                )}
              />
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pb-4 space-y-1.5">
          <p className="text-[14px] font-bold tracking-tight">
            {formatNumber(likeCount)} likes
          </p>
          <div className="text-[14px] leading-snug">
            <span className="font-bold tracking-tight hover:underline cursor-pointer mr-1.5">
              {cast.user.username}
            </span>
            <span className="font-medium text-foreground/90">
              {cast.caption}
            </span>
          </div>
          {cast.comments.length > 0 && (
            <button
              onClick={() => setShowComments(true)}
              className="text-[14px] text-muted-foreground hover:text-muted-foreground/80 transition-colors"
            >
              View all {cast.comments.length} comments
            </button>
          )}
        </div>
      </div>

      <CommentSheet
        contentId={cast.id}
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        localCommentCount={cast.comments.length}
      />

      {/* Share toast */}
      {showShareToast && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background shadow-lg animate-in fade-in slide-in-from-bottom-4">
          Link copied!
        </div>
      )}
    </>
  );
}
