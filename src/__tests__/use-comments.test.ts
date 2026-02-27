import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useComments } from "@/hooks/use-comments";

// Mock global fetch
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

// Mock useAuth hook
vi.mock("@/hooks/use-auth", () => ({
  useAuth: vi.fn(),
}));

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

// SDK-shaped comment response
const sdkComment1 = {
  comment: { id: "comment-1", text: "Great post!", created_at: 1704067200 },
  contentId: "content-1",
  author: { id: "user-1", username: "testuser", namespace: "tribe", created_at: 1704067200 },
  socialCounts: { likeCount: 0 },
};

const sdkComment2 = {
  comment: { id: "comment-2", text: "Thanks!", created_at: 1704070800 },
  contentId: "content-1",
  author: { id: "user-2", username: "otheruser", namespace: "tribe", created_at: 1704070800 },
  socialCounts: { likeCount: 0 },
};

function mockOkResponse(data: unknown) {
  return Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  });
}

function mockErrorResponse(status = 500) {
  return Promise.resolve({
    ok: false,
    status,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve("Error"),
  });
}

describe("useComments", () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue(mockAuth as ReturnType<typeof useAuth>);
    mockFetch.mockReset();
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
      mockFetch.mockReturnValue(
        mockOkResponse({ comments: [sdkComment1, sdkComment2] })
      );

      const { result } = renderHook(() => useComments("content-1"));

      await act(async () => {
        await result.current.fetchComments();
      });

      expect(result.current.comments).toHaveLength(2);
      expect(result.current.total).toBe(2);
      expect(result.current.isLoading).toBe(false);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/comments?contentId=content-1")
      );
    });

    it("should do nothing when contentId is null", async () => {
      const { result } = renderHook(() => useComments(null));

      await act(async () => {
        await result.current.fetchComments();
      });

      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("should handle error during fetch", async () => {
      mockFetch.mockReturnValue(mockErrorResponse());

      const { result } = renderHook(() => useComments("content-1"));

      await act(async () => {
        await result.current.fetchComments();
      });

      expect(result.current.error).toBeTruthy();
      expect(result.current.isLoading).toBe(false);
    });

    it("should handle null/undefined comments in response", async () => {
      mockFetch.mockReturnValue(mockOkResponse({ comments: undefined }));

      const { result } = renderHook(() => useComments("content-1"));

      await act(async () => {
        await result.current.fetchComments();
      });

      expect(result.current.comments).toEqual([]);
      expect(result.current.total).toBe(0);
    });

    it("should clear error before re-fetching", async () => {
      mockFetch
        .mockReturnValueOnce(mockErrorResponse())
        .mockReturnValueOnce(mockOkResponse({ comments: [sdkComment1] }));

      const { result } = renderHook(() => useComments("content-1"));

      // First fetch fails
      await act(async () => {
        await result.current.fetchComments();
      });
      expect(result.current.error).toBeTruthy();

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
      mockFetch.mockReturnValue(
        mockOkResponse({ id: "comment-3", text: "New comment!", created_at: 1704153600 })
      );

      const { result } = renderHook(() => useComments("content-1"));

      await act(async () => {
        await result.current.addComment("New comment!");
      });

      expect(result.current.comments).toHaveLength(1);
      expect(result.current.comments[0].text).toBe("New comment!");
      expect(result.current.total).toBe(1);
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/comments",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            profileId: "user-1",
            contentId: "content-1",
            text: "New comment!",
          }),
        })
      );
    });

    it("should trim whitespace from comment text", async () => {
      mockFetch.mockReturnValue(
        mockOkResponse({ id: "c1", text: "spaced text", created_at: 123 })
      );

      const { result } = renderHook(() => useComments("content-1"));

      await act(async () => {
        await result.current.addComment("  spaced text  ");
      });

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/comments",
        expect.objectContaining({
          body: JSON.stringify({
            profileId: "user-1",
            contentId: "content-1",
            text: "spaced text",
          }),
        })
      );
    });

    it("should do nothing when contentId is null", async () => {
      const { result } = renderHook(() => useComments(null));

      await act(async () => {
        await result.current.addComment("test");
      });

      expect(mockFetch).not.toHaveBeenCalled();
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

      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("should do nothing when text is empty/whitespace", async () => {
      const { result } = renderHook(() => useComments("content-1"));

      await act(async () => {
        await result.current.addComment("");
      });
      expect(mockFetch).not.toHaveBeenCalled();

      await act(async () => {
        await result.current.addComment("   ");
      });
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("should set error on failure", async () => {
      mockFetch.mockReturnValue(mockErrorResponse());

      const { result } = renderHook(() => useComments("content-1"));

      await act(async () => {
        await result.current.addComment("test comment");
      });

      expect(result.current.error).toBeTruthy();
    });
  });

  describe("deleteComment", () => {
    it("should optimistically remove comment from list", async () => {
      // First fetch returns comments
      mockFetch.mockReturnValueOnce(
        mockOkResponse({ comments: [sdkComment1, sdkComment2] })
      );

      const { result } = renderHook(() => useComments("content-1"));

      await act(async () => {
        await result.current.fetchComments();
      });
      expect(result.current.comments).toHaveLength(2);

      // Delete returns ok
      mockFetch.mockReturnValueOnce(mockOkResponse({}));

      await act(async () => {
        await result.current.deleteComment("comment-1");
      });

      expect(result.current.comments).toHaveLength(1);
      expect(result.current.comments[0].id).toBe("comment-2");
      expect(result.current.total).toBe(1);
    });

    it("should not go below 0 for total count", async () => {
      mockFetch.mockReturnValue(mockOkResponse({}));

      const { result } = renderHook(() => useComments("content-1"));

      // total starts at 0
      await act(async () => {
        await result.current.deleteComment("nonexistent");
      });

      expect(result.current.total).toBe(0);
    });

    it("should refetch comments on delete failure (rollback)", async () => {
      // First fetch
      mockFetch.mockReturnValueOnce(
        mockOkResponse({ comments: [sdkComment1, sdkComment2] })
      );

      const { result } = renderHook(() => useComments("content-1"));

      await act(async () => {
        await result.current.fetchComments();
      });

      // Delete fails, then refetch succeeds
      mockFetch
        .mockReturnValueOnce(mockErrorResponse())
        .mockReturnValueOnce(
          mockOkResponse({ comments: [sdkComment1, sdkComment2] })
        );

      await act(async () => {
        await result.current.deleteComment("comment-1");
      });

      // Should have refetched (3 total calls: initial fetch, failed delete, refetch)
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });
  });
});
