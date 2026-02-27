"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./use-auth";

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

  // Check initial like status — use content detail endpoint which includes hasLiked
  useEffect(() => {
    if (!isAuthenticated || !profile?.id || !contentId) return;

    // No direct "check like" endpoint in the SDK — we track locally from initial props
    // The content detail endpoint can be used if requestingProfileId is passed
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
          const res = await fetch("/api/likes", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nodeId: contentId,
              startId: profile.id,
            }),
          });
          if (!res.ok) throw new Error("Failed");
        } else {
          const res = await fetch("/api/likes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nodeId: contentId,
              startId: profile.id,
            }),
          });
          if (!res.ok) throw new Error("Failed");
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
