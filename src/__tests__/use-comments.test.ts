import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useComments } from "@/hooks/use-comments";
import type { TapestryComment } from "@/types/tapestry";

// Mock tapestry client
vi.mock("@/lib/tapestry", () => ({
  getComments: vi.fn(),
  createComment: vi.fn(),
  deleteComment: vi.fn(),
}));

// Mock useAuth hook
vi.mock("@/hooks/use-auth", () => ({
  useAuth: vi.fn(),
}));

import * as tapestry from "@/lib/tapestry";
import { useAuth } from "@/hooks/use-auth";

const mockAuth = {
  profile: { id: "user-1" },
  isAuthenticated: true,
  status: "authenticated" as const,
  walletAddress: "wallet123",
  error: null,
  isConnected: true,
  createProfile: vi.fn(),
  logout: vi.fn(),
};

const mockComment: TapestryComment = {
  id: "comment-1",
  profileId: "user-1",
  contentId: "content-1",
  text: "Great post!",
  created_at: "2025-01-01T00:00:00Z",
};

const mockComment2: TapestryComment = {
  id: "comment-2",
  profileId: "user-2",
  contentId: "content-1",
  text: "Thanks!",
  created_at: "2025-01-01T01:00:00Z",
};

describe("useComments", () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue(mockAuth as ReturnType<typeof useAuth>);
    vi.mocked(tapestry.getComments).mockReset();
    vi.mocked(tapestry.createComment).mockReset();
    vi.mocked(tapestry.deleteComment).mockReset();
  });

  describe("Initial state", () => {
    it("should start with empty comments, zero total, not loading, no error", () => {
      const { result } = renderHook(() => useComments("content-1"));

      expect(result.current.comments).toEqual([]);
      expect(result.current.total).toBe(0);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe("fetchComments", () => {
    it("should fetch comments for given contentId", async () => {
      vi.mocked(tapestry.getComments).mockResolvedValue({
        comments: [mockComment, mockComment2],
        total: 2,
      });

      const { result } = renderHook(() => useComments("content-1"));

      await act(async () => {
        await result.current.fetchComments();
      });

      expect(result.current.comments).toHaveLength(2);
      expect(result.current.total).toBe(2);
      expect(result.current.isLoading).toBe(false);
      expect(tapestry.getComments).toHaveBeenCalledWith("content-1");
    });

    it("should do nothing when contentId is null", async () => {
      const { result } = renderHook(() => useComments(null));

      await act(async () => {
        await result.current.fetchComments();
      });

      expect(tapestry.getComments).not.toHaveBeenCalled();
    });

    it("should handle error during fetch", async () => {
      vi.mocked(tapestry.getComments).mockRejectedValue(
        new Error("Network error")
      );

      const { result } = renderHook(() => useComments("content-1"));

      await act(async () => {
        await result.current.fetchComments();
      });

      expect(result.current.error).toBe("Network error");
      expect(result.current.isLoading).toBe(false);
    });

    it("should handle non-Error during fetch", async () => {
      vi.mocked(tapestry.getComments).mockRejectedValue("string error");

      const { result } = renderHook(() => useComments("content-1"));

      await act(async () => {
        await result.current.fetchComments();
      });

      expect(result.current.error).toBe("Failed to load comments");
    });

    it("should handle null/undefined comments in response", async () => {
      vi.mocked(tapestry.getComments).mockResolvedValue({
        comments: undefined as unknown as TapestryComment[],
        total: undefined as unknown as number,
      });

      const { result } = renderHook(() => useComments("content-1"));

      await act(async () => {
        await result.current.fetchComments();
      });

      expect(result.current.comments).toEqual([]);
      expect(result.current.total).toBe(0);
    });

    it("should clear error before re-fetching", async () => {
      vi.mocked(tapestry.getComments)
        .mockRejectedValueOnce(new Error("fail"))
        .mockResolvedValueOnce({ comments: [mockComment], total: 1 });

      const { result } = renderHook(() => useComments("content-1"));

      // First fetch fails
      await act(async () => {
        await result.current.fetchComments();
      });
      expect(result.current.error).toBe("fail");

      // Second fetch succeeds — error should be cleared
      await act(async () => {
        await result.current.fetchComments();
      });
      expect(result.current.error).toBeNull();
      expect(result.current.comments).toHaveLength(1);
    });
  });

  describe("addComment", () => {
    it("should create a comment and append to list", async () => {
      const newComment: TapestryComment = {
        id: "comment-3",
        profileId: "user-1",
        contentId: "content-1",
        text: "New comment!",
        created_at: "2025-01-02T00:00:00Z",
      };
      vi.mocked(tapestry.createComment).mockResolvedValue(newComment);

      const { result } = renderHook(() => useComments("content-1"));

      await act(async () => {
        await result.current.addComment("New comment!");
      });

      expect(result.current.comments).toHaveLength(1);
      expect(result.current.comments[0].text).toBe("New comment!");
      expect(result.current.total).toBe(1);
      expect(tapestry.createComment).toHaveBeenCalledWith(
        "user-1",
        "content-1",
        "New comment!"
      );
    });

    it("should trim whitespace from comment text", async () => {
      vi.mocked(tapestry.createComment).mockResolvedValue(mockComment);

      const { result } = renderHook(() => useComments("content-1"));

      await act(async () => {
        await result.current.addComment("  spaced text  ");
      });

      expect(tapestry.createComment).toHaveBeenCalledWith(
        "user-1",
        "content-1",
        "spaced text"
      );
    });

    it("should do nothing when contentId is null", async () => {
      const { result } = renderHook(() => useComments(null));

      await act(async () => {
        await result.current.addComment("test");
      });

      expect(tapestry.createComment).not.toHaveBeenCalled();
    });

    it("should do nothing when not authenticated", async () => {
      vi.mocked(useAuth).mockReturnValue({
        ...mockAuth,
        isAuthenticated: false,
        profile: null,
      } as ReturnType<typeof useAuth>);

      const { result } = renderHook(() => useComments("content-1"));

      await act(async () => {
        await result.current.addComment("test");
      });

      expect(tapestry.createComment).not.toHaveBeenCalled();
    });

    it("should do nothing when text is empty/whitespace", async () => {
      const { result } = renderHook(() => useComments("content-1"));

      await act(async () => {
        await result.current.addComment("");
      });
      expect(tapestry.createComment).not.toHaveBeenCalled();

      await act(async () => {
        await result.current.addComment("   ");
      });
      expect(tapestry.createComment).not.toHaveBeenCalled();
    });

    it("should set error on failure", async () => {
      vi.mocked(tapestry.createComment).mockRejectedValue(
        new Error("Create failed")
      );

      const { result } = renderHook(() => useComments("content-1"));

      await act(async () => {
        await result.current.addComment("test comment");
      });

      expect(result.current.error).toBe("Create failed");
    });
  });

  describe("deleteComment", () => {
    it("should optimistically remove comment from list", async () => {
      vi.mocked(tapestry.getComments).mockResolvedValue({
        comments: [mockComment, mockComment2],
        total: 2,
      });
      vi.mocked(tapestry.deleteComment).mockResolvedValue(undefined);

      const { result } = renderHook(() => useComments("content-1"));

      // First fetch comments
      await act(async () => {
        await result.current.fetchComments();
      });
      expect(result.current.comments).toHaveLength(2);

      // Delete first comment
      await act(async () => {
        await result.current.deleteComment("comment-1");
      });

      expect(result.current.comments).toHaveLength(1);
      expect(result.current.comments[0].id).toBe("comment-2");
      expect(result.current.total).toBe(1);
      expect(tapestry.deleteComment).toHaveBeenCalledWith("comment-1");
    });

    it("should not go below 0 for total count", async () => {
      vi.mocked(tapestry.deleteComment).mockResolvedValue(undefined);

      const { result } = renderHook(() => useComments("content-1"));

      // total starts at 0
      await act(async () => {
        await result.current.deleteComment("nonexistent");
      });

      expect(result.current.total).toBe(0);
    });

    it("should refetch comments on delete failure (rollback)", async () => {
      vi.mocked(tapestry.getComments).mockResolvedValue({
        comments: [mockComment, mockComment2],
        total: 2,
      });
      vi.mocked(tapestry.deleteComment).mockRejectedValue(
        new Error("Delete failed")
      );

      const { result } = renderHook(() => useComments("content-1"));

      await act(async () => {
        await result.current.fetchComments();
      });

      // Reset call count after initial fetch
      vi.mocked(tapestry.getComments).mockClear();
      vi.mocked(tapestry.getComments).mockResolvedValue({
        comments: [mockComment, mockComment2],
        total: 2,
      });

      await act(async () => {
        await result.current.deleteComment("comment-1");
      });

      // Should have refetched to restore correct state
      expect(tapestry.getComments).toHaveBeenCalledTimes(1);
    });
  });

  describe("Multiple operations", () => {
    it("should handle fetch → add → delete sequence", async () => {
      vi.mocked(tapestry.getComments).mockResolvedValue({
        comments: [mockComment],
        total: 1,
      });

      const newComment: TapestryComment = {
        id: "comment-new",
        profileId: "user-1",
        contentId: "content-1",
        text: "Added!",
        created_at: "2025-01-02T00:00:00Z",
      };
      vi.mocked(tapestry.createComment).mockResolvedValue(newComment);
      vi.mocked(tapestry.deleteComment).mockResolvedValue(undefined);

      const { result } = renderHook(() => useComments("content-1"));

      // Fetch
      await act(async () => {
        await result.current.fetchComments();
      });
      expect(result.current.comments).toHaveLength(1);
      expect(result.current.total).toBe(1);

      // Add
      await act(async () => {
        await result.current.addComment("Added!");
      });
      expect(result.current.comments).toHaveLength(2);
      expect(result.current.total).toBe(2);

      // Delete original
      await act(async () => {
        await result.current.deleteComment("comment-1");
      });
      expect(result.current.comments).toHaveLength(1);
      expect(result.current.comments[0].id).toBe("comment-new");
      expect(result.current.total).toBe(1);
    });
  });
});
