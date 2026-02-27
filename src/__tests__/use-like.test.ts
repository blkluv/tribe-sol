import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useLike } from "@/hooks/use-like";

// Mock tapestry client
vi.mock("@/lib/tapestry", () => ({
  checkLikeStatus: vi.fn(),
  likeContent: vi.fn(),
  unlikeContent: vi.fn(),
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
  status: "authenticated",
  walletAddress: "wallet123",
  error: null,
  isConnected: true,
  createProfile: vi.fn(),
  logout: vi.fn(),
};

describe("useLike", () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue(mockAuth as ReturnType<typeof useAuth>);
    vi.mocked(tapestry.checkLikeStatus).mockReset();
    vi.mocked(tapestry.likeContent).mockReset();
    vi.mocked(tapestry.unlikeContent).mockReset();
  });

  describe("Initial state", () => {
    it("should initialize with provided values", () => {
      vi.mocked(tapestry.checkLikeStatus).mockResolvedValue({ isLiked: false });

      const { result } = renderHook(() => useLike("content-1", true, 5));

      expect(result.current.isLiked).toBe(true);
      expect(result.current.likeCount).toBe(5);
      expect(result.current.isLoading).toBe(false);
    });

    it("should sync with prop changes", async () => {
      vi.mocked(tapestry.checkLikeStatus).mockResolvedValue({ isLiked: false });

      const { result, rerender } = renderHook(
        ({ liked, count }) => useLike("content-1", liked, count),
        { initialProps: { liked: false, count: 0 } }
      );

      expect(result.current.isLiked).toBe(false);
      expect(result.current.likeCount).toBe(0);

      rerender({ liked: true, count: 3 });

      await waitFor(() => {
        expect(result.current.isLiked).toBe(true);
        expect(result.current.likeCount).toBe(3);
      });
    });
  });

  describe("Check like status on mount", () => {
    it("should check like status from Tapestry when authenticated", async () => {
      vi.mocked(tapestry.checkLikeStatus).mockResolvedValue({ isLiked: true });

      const { result } = renderHook(() => useLike("content-1", false, 5));

      await waitFor(() => {
        expect(result.current.isLiked).toBe(true);
      });

      expect(tapestry.checkLikeStatus).toHaveBeenCalledWith(
        "user-1",
        "content-1"
      );
    });

    it("should not check like status when not authenticated", () => {
      vi.mocked(useAuth).mockReturnValue({
        ...mockAuth,
        isAuthenticated: false,
        profile: null,
      } as ReturnType<typeof useAuth>);

      renderHook(() => useLike("content-1", false, 5));

      expect(tapestry.checkLikeStatus).not.toHaveBeenCalled();
    });

    it("should not check like status when contentId is null", () => {
      renderHook(() => useLike(null, false, 0));

      expect(tapestry.checkLikeStatus).not.toHaveBeenCalled();
    });

    it("should silently ignore check errors", async () => {
      vi.mocked(tapestry.checkLikeStatus).mockRejectedValue(
        new Error("fail")
      );

      const { result } = renderHook(() => useLike("content-1", false, 5));

      // Should remain at initial value, no error thrown
      await waitFor(() => {
        expect(result.current.isLiked).toBe(false);
      });
    });
  });

  describe("toggleLike - liking", () => {
    it("should optimistically update isLiked and likeCount when liking", async () => {
      vi.mocked(tapestry.checkLikeStatus).mockResolvedValue({ isLiked: false });
      vi.mocked(tapestry.likeContent).mockResolvedValue(undefined);

      const { result } = renderHook(() => useLike("content-1", false, 5));

      // Wait for the initial checkLikeStatus effect to settle
      await waitFor(() => {
        expect(tapestry.checkLikeStatus).toHaveBeenCalled();
      });

      await act(async () => {
        await result.current.toggleLike();
      });

      expect(result.current.isLiked).toBe(true);
      expect(result.current.likeCount).toBe(6);
      expect(tapestry.likeContent).toHaveBeenCalledWith("user-1", "content-1");
    });

    it("should optimistically update when unliking", async () => {
      vi.mocked(tapestry.checkLikeStatus).mockResolvedValue({ isLiked: true });
      vi.mocked(tapestry.unlikeContent).mockResolvedValue(undefined);

      const { result } = renderHook(() => useLike("content-1", true, 5));

      // Wait for the initial checkLikeStatus effect to settle (sets isLiked to true)
      await waitFor(() => {
        expect(tapestry.checkLikeStatus).toHaveBeenCalled();
      });

      await act(async () => {
        await result.current.toggleLike();
      });

      expect(result.current.isLiked).toBe(false);
      expect(result.current.likeCount).toBe(4);
      expect(tapestry.unlikeContent).toHaveBeenCalledWith(
        "user-1",
        "content-1"
      );
    });
  });

  describe("toggleLike - rollback on error", () => {
    it("should rollback like on API failure", async () => {
      vi.mocked(tapestry.checkLikeStatus).mockResolvedValue({ isLiked: false });
      vi.mocked(tapestry.likeContent).mockRejectedValue(new Error("fail"));

      const { result } = renderHook(() => useLike("content-1", false, 5));

      await act(async () => {
        await result.current.toggleLike();
      });

      // Should rollback
      expect(result.current.isLiked).toBe(false);
      expect(result.current.likeCount).toBe(5);
    });

    it("should rollback unlike on API failure", async () => {
      vi.mocked(tapestry.checkLikeStatus).mockResolvedValue({ isLiked: true });
      vi.mocked(tapestry.unlikeContent).mockRejectedValue(new Error("fail"));

      const { result } = renderHook(() => useLike("content-1", true, 5));

      await act(async () => {
        await result.current.toggleLike();
      });

      // Should rollback
      expect(result.current.isLiked).toBe(true);
      expect(result.current.likeCount).toBe(5);
    });
  });

  describe("toggleLike - guards", () => {
    it("should do nothing when contentId is null", async () => {
      const { result } = renderHook(() => useLike(null, false, 0));

      await act(async () => {
        await result.current.toggleLike();
      });

      expect(tapestry.likeContent).not.toHaveBeenCalled();
      expect(tapestry.unlikeContent).not.toHaveBeenCalled();
    });

    it("should still do optimistic update when not authenticated (local-only toggle)", async () => {
      vi.mocked(useAuth).mockReturnValue({
        ...mockAuth,
        isAuthenticated: false,
        profile: null,
      } as ReturnType<typeof useAuth>);

      const { result } = renderHook(() => useLike("content-1", false, 5));

      await act(async () => {
        await result.current.toggleLike();
      });

      // Optimistic update still happens, just no API call
      expect(result.current.isLiked).toBe(true);
      expect(result.current.likeCount).toBe(6);
      expect(tapestry.likeContent).not.toHaveBeenCalled();
    });
  });

  describe("isLoading state", () => {
    it("should set isLoading during toggle", async () => {
      let resolvePromise: () => void;
      vi.mocked(tapestry.checkLikeStatus).mockResolvedValue({ isLiked: false });
      vi.mocked(tapestry.likeContent).mockReturnValue(
        new Promise<void>((resolve) => {
          resolvePromise = resolve;
        })
      );

      const { result } = renderHook(() => useLike("content-1", false, 5));

      // Start the toggle but don't await
      let togglePromise: Promise<void>;
      act(() => {
        togglePromise = result.current.toggleLike();
      });

      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        resolvePromise!();
        await togglePromise!;
      });

      expect(result.current.isLoading).toBe(false);
    });

    it("should prevent concurrent toggles while loading", async () => {
      let resolvePromise: () => void;
      vi.mocked(tapestry.checkLikeStatus).mockResolvedValue({ isLiked: false });
      vi.mocked(tapestry.likeContent).mockReturnValue(
        new Promise<void>((resolve) => {
          resolvePromise = resolve;
        })
      );

      const { result } = renderHook(() => useLike("content-1", false, 5));

      // First toggle
      let firstToggle: Promise<void>;
      act(() => {
        firstToggle = result.current.toggleLike();
      });

      // Second toggle should be a no-op (isLoading is true)
      await act(async () => {
        await result.current.toggleLike();
      });

      // Only one API call should have been made
      expect(tapestry.likeContent).toHaveBeenCalledTimes(1);

      await act(async () => {
        resolvePromise!();
        await firstToggle!;
      });
    });
  });
});
