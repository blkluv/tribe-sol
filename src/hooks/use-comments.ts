"use client";

import { useState, useCallback } from "react";
import { useAuth } from "./use-auth";
import type { TapestryComment } from "@/types/tapestry";

interface UseCommentsReturn {
  comments: TapestryComment[];
  total: number;
  isLoading: boolean;
  error: string | null;
  fetchComments: () => Promise<void>;
  addComment: (text: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
}

export function useComments(contentId: string | null): UseCommentsReturn {
  const { profile, isAuthenticated } = useAuth();
  const [comments, setComments] = useState<TapestryComment[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    if (!contentId) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/comments?contentId=${encodeURIComponent(contentId)}`
      );
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();

      // Map SDK response shape to our TapestryComment type
      const mapped: TapestryComment[] = (data.comments || []).map(
        (c: {
          comment: { id: string; text: string; created_at: number };
          contentId?: string;
          author?: { id: string; username: string; bio?: string | null; image?: string | null; namespace: string; created_at: number };
        }) => ({
          id: c.comment.id,
          profileId: c.author?.id || "",
          contentId: c.contentId || contentId,
          text: c.comment.text,
          created_at: String(c.comment.created_at),
          profile: c.author
            ? {
                id: c.author.id,
                blockchain: "SOLANA",
                walletAddress: "",
                username: c.author.username,
                bio: c.author.bio || undefined,
                image: c.author.image || undefined,
                namespace: c.author.namespace,
                created_at: String(c.author.created_at),
              }
            : undefined,
        })
      );
      setComments(mapped);
      setTotal(mapped.length);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load comments"
      );
    } finally {
      setIsLoading(false);
    }
  }, [contentId]);

  const addComment = useCallback(
    async (text: string) => {
      if (!contentId || !isAuthenticated || !profile?.id || !text.trim()) return;

      setIsLoading(true);

      try {
        const res = await fetch("/api/comments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            profileId: profile.id,
            contentId,
            text: text.trim(),
          }),
        });
        if (!res.ok) throw new Error(`API error ${res.status}`);
        const data = await res.json();

        const newComment: TapestryComment = {
          id: data.id,
          profileId: profile.id,
          contentId,
          text: data.text,
          created_at: String(data.created_at),
        };
        setComments((prev) => [...prev, newComment]);
        setTotal((t) => t + 1);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to add comment"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [contentId, isAuthenticated, profile?.id]
  );

  const removeComment = useCallback(
    async (commentId: string) => {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      setTotal((t) => Math.max(0, t - 1));

      try {
        const res = await fetch(
          `/api/comments?id=${encodeURIComponent(commentId)}`,
          { method: "DELETE" }
        );
        if (!res.ok) throw new Error("Failed");
      } catch {
        // Refetch on failure to restore correct state
        fetchComments();
      }
    },
    [fetchComments]
  );

  return {
    comments,
    total,
    isLoading,
    error,
    fetchComments,
    addComment,
    deleteComment: removeComment,
  };
}
