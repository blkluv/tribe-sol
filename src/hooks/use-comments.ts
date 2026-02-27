"use client";

import { useState, useCallback } from "react";
import { useAuth } from "./use-auth";
import * as tapestry from "@/lib/tapestry";
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
      const result = await tapestry.getComments(contentId);
      setComments(result.comments || []);
      setTotal(result.total || 0);
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
        const newComment = await tapestry.createComment(
          profile.id,
          contentId,
          text.trim()
        );
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
        await tapestry.deleteComment(commentId);
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
