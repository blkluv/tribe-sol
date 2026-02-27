import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useFollow } from "@/hooks/use-follow";

// Mock tapestry client
vi.mock("@/lib/tapestry", () => ({
  checkFollowStatus: vi.fn(),
  followUser: vi.fn(),
  unfollowUser: vi.fn(),
}));

// Mock useAuth hook
vi.mock("@/hooks/use-auth", () => ({
  useAuth: vi.fn(),
}));

import * as tapestry from "@/lib/tapestry";
import { useAuth } from "@/hooks/use-auth";

const mockAuth = {
  profile: { id: "my-profile" },
  isAuthenticated: true,
  status: "authenticated" as const,
  walletAddress: "wallet123",
  error: null,
  isConnected: true,
  createProfile: vi.fn(),
  logout: vi.fn(),
};

describe("useFollow", () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue(mockAuth as ReturnType<typeof useAuth>);
    vi.mocked(tapestry.checkFollowStatus).mockReset();
    vi.mocked(tapestry.followUser).mockReset();
    vi.mocked(tapestry.unfollowUser).mockReset();
  });

  describe("Initial state", () => {
    it("should start not following", () => {
      vi.mocked(tapestry.checkFollowStatus).mockResolvedValue({
        isFollowing: false,
      });

      const { result } = renderHook(() => useFollow("other-user"));

      expect(result.current.isFollowing).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("Check follow status on mount", () => {
    it("should check follow status when authenticated with valid targetProfileId", async () => {
      vi.mocked(tapestry.checkFollowStatus).mockResolvedValue({
        isFollowing: true,
      });

      const { result } = renderHook(() => useFollow("other-user"));

      await waitFor(() => {
        expect(result.current.isFollowing).toBe(true);
      });

      expect(tapestry.checkFollowStatus).toHaveBeenCalledWith(
        "my-profile",
        "other-user"
      );
    });

    it("should not check when not authenticated", () => {
      vi.mocked(useAuth).mockReturnValue({
        ...mockAuth,
        isAuthenticated: false,
        profile: null,
      } as ReturnType<typeof useAuth>);

      renderHook(() => useFollow("other-user"));

      expect(tapestry.checkFollowStatus).not.toHaveBeenCalled();
    });

    it("should not check when targetProfileId is null", () => {
      renderHook(() => useFollow(null));

      expect(tapestry.checkFollowStatus).not.toHaveBeenCalled();
    });

    it("should not check follow status for self (same profile ID)", () => {
      renderHook(() => useFollow("my-profile"));

      expect(tapestry.checkFollowStatus).not.toHaveBeenCalled();
    });

    it("should silently ignore check errors", async () => {
      vi.mocked(tapestry.checkFollowStatus).mockRejectedValue(
        new Error("fail")
      );

      const { result } = renderHook(() => useFollow("other-user"));

      await waitFor(() => {
        expect(result.current.isFollowing).toBe(false);
      });
    });
  });

  describe("toggleFollow - following", () => {
    it("should optimistically follow and call API", async () => {
      vi.mocked(tapestry.checkFollowStatus).mockResolvedValue({
        isFollowing: false,
      });
      vi.mocked(tapestry.followUser).mockResolvedValue(undefined);

      const { result } = renderHook(() => useFollow("other-user"));

      // Wait for the initial checkFollowStatus effect to settle
      await waitFor(() => {
        expect(tapestry.checkFollowStatus).toHaveBeenCalled();
      });

      await act(async () => {
        await result.current.toggleFollow();
      });

      expect(result.current.isFollowing).toBe(true);
      expect(tapestry.followUser).toHaveBeenCalledWith(
        "my-profile",
        "other-user"
      );
    });

    it("should optimistically unfollow and call API", async () => {
      vi.mocked(tapestry.checkFollowStatus).mockResolvedValue({
        isFollowing: true,
      });
      vi.mocked(tapestry.unfollowUser).mockResolvedValue(undefined);

      const { result } = renderHook(() => useFollow("other-user"));

      await waitFor(() => {
        expect(result.current.isFollowing).toBe(true);
      });

      await act(async () => {
        await result.current.toggleFollow();
      });

      expect(result.current.isFollowing).toBe(false);
      expect(tapestry.unfollowUser).toHaveBeenCalledWith(
        "my-profile",
        "other-user"
      );
    });
  });

  describe("toggleFollow - rollback on error", () => {
    it("should rollback follow on API failure", async () => {
      vi.mocked(tapestry.checkFollowStatus).mockResolvedValue({
        isFollowing: false,
      });
      vi.mocked(tapestry.followUser).mockRejectedValue(new Error("fail"));

      const { result } = renderHook(() => useFollow("other-user"));

      await act(async () => {
        await result.current.toggleFollow();
      });

      expect(result.current.isFollowing).toBe(false);
    });

    it("should rollback unfollow on API failure", async () => {
      vi.mocked(tapestry.checkFollowStatus).mockResolvedValue({
        isFollowing: true,
      });
      vi.mocked(tapestry.unfollowUser).mockRejectedValue(new Error("fail"));

      const { result } = renderHook(() => useFollow("other-user"));

      await waitFor(() => {
        expect(result.current.isFollowing).toBe(true);
      });

      await act(async () => {
        await result.current.toggleFollow();
      });

      expect(result.current.isFollowing).toBe(true);
    });
  });

  describe("toggleFollow - guards", () => {
    it("should do nothing when not authenticated", async () => {
      vi.mocked(useAuth).mockReturnValue({
        ...mockAuth,
        isAuthenticated: false,
        profile: null,
      } as ReturnType<typeof useAuth>);

      const { result } = renderHook(() => useFollow("other-user"));

      await act(async () => {
        await result.current.toggleFollow();
      });

      expect(tapestry.followUser).not.toHaveBeenCalled();
      expect(tapestry.unfollowUser).not.toHaveBeenCalled();
    });

    it("should do nothing when targetProfileId is null", async () => {
      const { result } = renderHook(() => useFollow(null));

      await act(async () => {
        await result.current.toggleFollow();
      });

      expect(tapestry.followUser).not.toHaveBeenCalled();
    });

    it("should prevent concurrent toggles while loading", async () => {
      let resolvePromise: () => void;
      vi.mocked(tapestry.checkFollowStatus).mockResolvedValue({
        isFollowing: false,
      });
      vi.mocked(tapestry.followUser).mockReturnValue(
        new Promise<void>((resolve) => {
          resolvePromise = resolve;
        })
      );

      const { result } = renderHook(() => useFollow("other-user"));

      // First toggle
      let firstToggle: Promise<void>;
      act(() => {
        firstToggle = result.current.toggleFollow();
      });

      // Second toggle while first is in progress — should be a no-op
      await act(async () => {
        await result.current.toggleFollow();
      });

      expect(tapestry.followUser).toHaveBeenCalledTimes(1);

      await act(async () => {
        resolvePromise!();
        await firstToggle!;
      });
    });
  });

  describe("isLoading state", () => {
    it("should set isLoading during toggle", async () => {
      let resolvePromise: () => void;
      vi.mocked(tapestry.checkFollowStatus).mockResolvedValue({
        isFollowing: false,
      });
      vi.mocked(tapestry.followUser).mockReturnValue(
        new Promise<void>((resolve) => {
          resolvePromise = resolve;
        })
      );

      const { result } = renderHook(() => useFollow("other-user"));

      let togglePromise: Promise<void>;
      act(() => {
        togglePromise = result.current.toggleFollow();
      });

      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        resolvePromise!();
        await togglePromise!;
      });

      expect(result.current.isLoading).toBe(false);
    });
  });
});
