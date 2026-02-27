"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, Trash2 } from "lucide-react";
import { useComments } from "@/hooks/use-comments";
import { useAuth } from "@/hooks/use-auth";

interface CommentSheetProps {
  contentId: string | null;
  isOpen: boolean;
  onClose: () => void;
  localCommentCount: number;
}

export function CommentSheet({
  contentId,
  isOpen,
  onClose,
  localCommentCount,
}: CommentSheetProps) {
  const { comments, isLoading, fetchComments, addComment, deleteComment } =
    useComments(contentId);
  const { isAuthenticated, profile } = useAuth();
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && contentId) {
      fetchComments();
    }
  }, [isOpen, contentId, fetchComments]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    await addComment(text);
    setText("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[70vh] overflow-hidden rounded-t-2xl bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="text-sm font-bold">
                Comments{" "}
                <span className="text-muted-foreground">
                  ({comments.length || localCommentCount})
                </span>
              </h3>
              <button
                onClick={onClose}
                className="rounded-full p-1 hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Comments List */}
            <div className="max-h-[calc(70vh-120px)] overflow-y-auto px-4 py-3">
              {isLoading && comments.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : comments.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  {isAuthenticated
                    ? "No comments yet. Be the first!"
                    : "Connect wallet to comment"}
                </p>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="h-8 w-8 flex-none rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                        {(comment.profile?.username || comment.profileId)
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-bold">
                            {comment.profile?.username || comment.profileId}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-[13px] leading-snug">
                          {comment.text}
                        </p>
                      </div>
                      {profile?.id === comment.profileId && (
                        <button
                          onClick={() => deleteComment(comment.id)}
                          className="flex-none p-1 text-muted-foreground hover:text-red-500"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            {isAuthenticated && (
              <form
                onSubmit={handleSubmit}
                className="flex items-center gap-2 border-t px-4 py-3"
              >
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Add a comment..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                <button
                  type="submit"
                  disabled={!text.trim() || isLoading}
                  className="flex-none rounded-full p-2 text-indigo-500 hover:bg-indigo-50 disabled:opacity-30"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
