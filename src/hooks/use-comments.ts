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
  expandedReplies: Set<string>;
  toggleReplies: (commentId: string) => void;
  fetchReplies: (commentId: string) => Promise<void>;
  addReply: (commentId: string, text: string) => Promise<void>;
  replyingTo: string | null;
  setReplyingTo: (commentId: string | null) => void;
}

interface RawComment {
  comment: { id: string; text: string; created_at: number };
  contentId?: string;
  author?: {
    id: string;
    username: string;
    bio?: string | null;
    image?: string | null;
    namespace: string;
    created_at: number;
  };
  recentReplies?: RawComment[];
}

function mapAuthor(author: RawComment["author"]) {
  if (!author) return undefined;
  return {
    id: author.id,
    blockchain: "SOLANA" as const,
    walletAddress: "",
    username: author.username,
    bio: author.bio || undefined,
    image: author.image || undefined,
    namespace: author.namespace,
    created_at: String(author.created_at),
  };
}

function mapComment(c: RawComment, fallbackContentId: string): TapestryComment {
  const recentReplies = c.recentReplies || [];
  return {
    id: c.comment.id,
    profileId: c.author?.id || "",
    contentId: c.contentId || fallbackContentId,
    text: c.comment.text,
    created_at: String(c.comment.created_at),
    profile: mapAuthor(c.author),
    replies: recentReplies.length > 0
      ? recentReplies.map((r) => mapComment(r, fallbackContentId))
      : undefined,
    replyCount: recentReplies.length || undefined,
  };
}

export function useComments(contentId: string | null): UseCommentsReturn {
  const { profile, isAuthenticated } = useAuth();
  const [comments, setComments] = useState<TapestryComment[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(
    new Set()
  );
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

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

      const mapped: TapestryComment[] = (data.comments || []).map(
        (c: RawComment) => mapComment(c, contentId)
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
      if (!contentId || !isAuthenticated || !profile?.id || !text.trim())
        return;

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
        fetchComments();
      }
    },
    [fetchComments]
  );

  const fetchReplies = useCallback(
    async (commentId: string) => {
      try {
        const res = await fetch(
          `/api/comments?commentId=${encodeURIComponent(commentId)}`
        );
        if (!res.ok) throw new Error(`API error ${res.status}`);
        const data = await res.json();

        const mapped: TapestryComment[] = (data.comments || []).map(
          (c: RawComment) => mapComment(c, contentId || "")
        );

        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId
              ? { ...c, replies: mapped, replyCount: mapped.length }
              : c
          )
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load replies"
        );
      }
    },
    [contentId]
  );

  const toggleReplies = useCallback(
    (commentId: string) => {
      setExpandedReplies((prev) => {
        const next = new Set(prev);
        if (next.has(commentId)) {
          next.delete(commentId);
        } else {
          next.add(commentId);
          // Always fetch latest replies when expanding
          fetchReplies(commentId);
        }
        return next;
      });
    },
    [fetchReplies]
  );

  const addReply = useCallback(
    async (commentId: string, text: string) => {
      if (!contentId || !isAuthenticated || !profile?.id || !text.trim()) return;

      try {
        const res = await fetch("/api/comments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            profileId: profile.id,
            contentId,
            commentId,
            text: text.trim(),
          }),
        });
        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          throw new Error(errBody.error || `API error ${res.status}`);
        }
        const data = await res.json();

        const newReply: TapestryComment = {
          id: data.id || `temp-${Date.now()}`,
          profileId: profile.id,
          contentId,
          text: data.text || text.trim(),
          created_at: String(data.created_at || Date.now()),
          profile: profile
            ? {
                id: profile.id,
                blockchain: "SOLANA",
                walletAddress: "",
                username: profile.username,
                bio: profile.bio || undefined,
                image: profile.image || undefined,
                namespace: "",
                created_at: "",
              }
            : undefined,
        };

        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId
              ? {
                  ...c,
                  replies: [...(c.replies || []), newReply],
                  replyCount: (c.replyCount || 0) + 1,
                }
              : c
          )
        );
        // Auto-expand replies so the new reply is visible
        setExpandedReplies((prev) => {
          const next = new Set(prev);
          next.add(commentId);
          return next;
        });
        setReplyingTo(null);
      } catch (err) {
        console.error("addReply error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to add reply"
        );
      }
    },
    [contentId, isAuthenticated, profile]
  );

  return {
    comments,
    total,
    isLoading,
    error,
    fetchComments,
    addComment,
    deleteComment: removeComment,
    expandedReplies,
    toggleReplies,
    fetchReplies,
    addReply,
    replyingTo,
    setReplyingTo,
  };
}
