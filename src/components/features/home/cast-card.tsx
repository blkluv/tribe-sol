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
import { TipButton } from "@/components/tribe/tip-button";
import { CommentSheet } from "./comment-sheet";

interface CastCardProps {
  cast: Cast;
}

export function CastCard({ cast }: CastCardProps) {
  const { likeCast, bookmarkCast, tipCast } = useTribeStore();
  const { isAuthenticated } = useAuth();
  const tapestryId = cast.tapestryContentId || null;
  const { isLiked, likeCount, toggleLike } = useLike(
    tapestryId,
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
    likeCast(cast.id);
    if (isAuthenticated) {
      await toggleLike();
    }
  };

  const isShortCaption = cast.caption.length < 60;

  return (
    <div className="group relative bg-white rounded-[32px] border border-[#f0f0f0] p-6 shadow-sm transition-all hover:shadow-xl hover:shadow-black/[0.03] overflow-hidden">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-muted overflow-hidden relative border border-[#f0f0f0]">
            <Image
              src={cast.user.avatarUrl}
              alt={cast.user.displayName}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-[14px] font-bold tracking-tight">@{cast.user.username}</p>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{cast.timestamp}</p>
          </div>
        </div>
        <div className="rounded-full bg-[#f5f5f5] px-3 py-1 text-[11px] font-bold tracking-tight">
          Casting
        </div>
      </div>

      {/* Caption Content */}
      <div className={cn(
        "mb-5 leading-tight tracking-tight",
        isShortCaption ? "text-[22px] font-bold" : "text-[16px] font-medium text-black/80"
      )}>
        {cast.caption}
      </div>

      {/* Integrated Image */}
      {cast.imageUrl && (
        <div className="relative mb-6 overflow-hidden rounded-[24px] bg-[#f5f5f5] aspect-[4/5]">
          <Image
            src={cast.imageUrl}
            alt={cast.caption}
            fill
            className="object-cover transition-transform group-hover:scale-105 duration-700"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        </div>
      )}

      {/* Interactions Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={handleLike}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-full transition-all active:scale-90",
              isLiked ? "bg-red-50 text-red-500" : "hover:bg-[#f5f5f5] text-[#666]"
            )}
          >
            <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
            <span className="text-[13px] font-bold">{formatNumber(likeCount)}</span>
          </button>

          <button
            onClick={() => setShowComments(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-[#f5f5f5] text-[#666] transition-all active:scale-90"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-[13px] font-bold">{formatNumber(cast.comments.length)}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <TipButton
            tipCount={cast.tipCount}
            onTip={handleTip}
            isWalletReady={isWalletReady}
            className="px-4 py-2"
          />
          <button
            onClick={() => bookmarkCast(cast.id)}
            className={cn(
              "p-2 rounded-full transition-all active:scale-90",
              cast.isSaved ? "bg-black text-white" : "hover:bg-[#f5f5f5] text-[#666]"
            )}
          >
            <Bookmark className={cn("h-5 w-5", cast.isSaved && "fill-current")} />
          </button>
        </div>
      </div>

      <CommentSheet
        contentId={tapestryId}
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        localCommentCount={cast.comments.length}
      />

      {/* Share toast */}
      {showShareToast && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-black px-6 py-3 text-sm font-bold text-white shadow-2xl animate-in fade-in slide-in-from-bottom-4">
          Link copied!
        </div>
      )}
    </div>
  );
}
