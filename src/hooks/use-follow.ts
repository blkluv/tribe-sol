"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./use-auth";
import * as tapestry from "@/lib/tapestry";

interface UseFollowReturn {
  isFollowing: boolean;
  isLoading: boolean;
  toggleFollow: () => Promise<void>;
}

export function useFollow(targetProfileId: string | null): UseFollowReturn {
  const { profile, isAuthenticated } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check initial follow status
  useEffect(() => {
    if (!isAuthenticated || !profile?.id || !targetProfileId) return;
    if (profile.id === targetProfileId) return;

    tapestry
      .checkFollowStatus(profile.id, targetProfileId)
      .then((result) => setIsFollowing(result.isFollowing))
      .catch(() => {});
  }, [isAuthenticated, profile?.id, targetProfileId]);

  const toggleFollow = useCallback(async () => {
    if (!isAuthenticated || !profile?.id || !targetProfileId || isLoading) return;

    const wasFollowing = isFollowing;
    // Optimistic update
    setIsFollowing(!wasFollowing);
    setIsLoading(true);

    try {
      if (wasFollowing) {
        await tapestry.unfollowUser(profile.id, targetProfileId);
      } else {
        await tapestry.followUser(profile.id, targetProfileId);
      }
    } catch {
      // Rollback on failure
      setIsFollowing(wasFollowing);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, profile?.id, targetProfileId, isFollowing, isLoading]);

  return { isFollowing, isLoading, toggleFollow };
}
