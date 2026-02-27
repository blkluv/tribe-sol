"use client";

import { useState, useEffect, useCallback } from "react";
import type { Cast } from "@/types";
import { useTribeStore } from "@/store/use-tribe-store";

/**
 * Actual Tapestry response shape from GET /contents?profileId=...
 * Properties are flattened directly onto content:
 * { content: { id, created_at, namespace, caption, type, cityId, imageUrl, ... }, socialCounts, authorProfile }
 */
interface TapestryContentItem {
  content: {
    id: string;
    created_at: number;
    namespace: string;
    // Flattened properties from findOrCreate
    [key: string]: unknown;
  } | null;
  socialCounts: {
    likeCount: number;
    commentCount: number;
  };
  authorProfile: {
    id: string;
    username: string;
    bio?: string | null;
    image?: string | null;
  };
}

/**
 * Fetches the authenticated user's posts from Tapestry
 */
export function useTapestryPosts(profileId: string | null | undefined) {
  const [posts, setPosts] = useState<Cast[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentUser = useTribeStore((s) => s.currentUser);

  const fetchPosts = useCallback(async () => {
    if (!profileId || !currentUser) {
      setPosts([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/content?profileId=${encodeURIComponent(profileId)}`
      );
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();

      const items: TapestryContentItem[] = data.contents || [];

      const casts: Cast[] = [];
      for (const item of items) {
        const c = item.content;
        if (!c) continue;

        // Properties are flattened on the content object
        if (c.type && c.type !== "cast") continue;

        const caption = (c.caption as string) || "";
        if (!caption) continue;

        const imageUrl = c.imageUrl as string | undefined;
        const cityId = (c.cityId as string) || "";

        casts.push({
          id: `tapestry-${c.id}`,
          user: currentUser,
          caption,
          ...(imageUrl ? { imageUrl } : {}),
          likes: item.socialCounts?.likeCount || 0,
          comments: [],
          timestamp: formatTimeAgo(c.created_at),
          isLiked: false,
          isSaved: false,
          tipCount: 0,
          totalTips: 0,
          cityId,
          tapestryContentId: c.id,
        });
      }

      setPosts(casts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch posts");
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, [profileId, currentUser]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, isLoading, error, refetch: fetchPosts };
}

function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(timestamp).toLocaleDateString();
}
