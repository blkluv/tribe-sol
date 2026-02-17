"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./use-auth";
import * as tapestry from "@/lib/tapestry";

interface UseLikeReturn {
  isLiked: boolean;
  likeCount: number;
  isLoading: boolean;
  toggleLike: () => Promise<void>;
}

export function useLike(
  contentId: string | null,
  initialLiked: boolean,
  initialCount: number
): UseLikeReturn {
  const { profile, isAuthenticated } = useAuth();
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);

  // Sync with props
  useEffect(() => {
    setIsLiked(initialLiked);
    setLikeCount(initialCount);
  }, [initialLiked, initialCount]);

  // Check initial like status from Tapestry
  useEffect(() => {
    if (!isAuthenticated || !profile?.id || !contentId) return;

    tapestry
      .checkLikeStatus(profile.id, contentId)
      .then((result) => setIsLiked(result.isLiked))
      .catch(() => {});
  }, [isAuthenticated, profile?.id, contentId]);

  const toggleLike = useCallback(async () => {
    if (!contentId || isLoading) return;

    const wasLiked = isLiked;
    // Optimistic update
    setIsLiked(!wasLiked);
    setLikeCount((c) => (wasLiked ? c - 1 : c + 1));
    setIsLoading(true);

    try {
      if (isAuthenticated && profile?.id) {
        if (wasLiked) {
          await tapestry.unlikeContent(profile.id, contentId);
        } else {
          await tapestry.likeContent(profile.id, contentId);
        }
      }
    } catch {
      // Rollback on failure
      setIsLiked(wasLiked);
      setLikeCount((c) => (wasLiked ? c + 1 : c - 1));
    } finally {
      setIsLoading(false);
    }
  }, [contentId, isLiked, isLoading, isAuthenticated, profile?.id]);

  return { isLiked, likeCount, isLoading, toggleLike };
}
