import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useTapestryProfile } from "@/hooks/use-tapestry-profile";
import type { TapestryProfile } from "@/types/tapestry";

// Mock the tapestry client
vi.mock("@/lib/tapestry", () => ({
  getProfile: vi.fn(),
}));

import * as tapestry from "@/lib/tapestry";

const mockProfile: TapestryProfile = {
  id: "profile-1",
  blockchain: "SOLANA",
  walletAddress: "wallet123",
  username: "testuser",
  bio: "Hello world",
  namespace: "tribe",
  created_at: "2025-01-01T00:00:00Z",
  socialCounts: { followers: 10, following: 5, posts: 3 },
};

describe("useTapestryProfile", () => {
  beforeEach(() => {
    vi.mocked(tapestry.getProfile).mockReset();
  });

  describe("Initial state", () => {
    it("should start with null profile, not loading, no error when no profileId", () => {
      const { result } = renderHook(() => useTapestryProfile(null));

      expect(result.current.profile).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it("should start with null profile when profileId is undefined", () => {
      const { result } = renderHook(() => useTapestryProfile(undefined));

      expect(result.current.profile).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("Fetching profile", () => {
    it("should fetch profile when profileId is provided", async () => {
      vi.mocked(tapestry.getProfile).mockResolvedValue(mockProfile);

      const { result } = renderHook(() => useTapestryProfile("profile-1"));

      await waitFor(() => {
        expect(result.current.profile).toEqual(mockProfile);
      });

      expect(tapestry.getProfile).toHaveBeenCalledWith("profile-1");
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it("should not fetch when profileId is null", () => {
      renderHook(() => useTapestryProfile(null));

      expect(tapestry.getProfile).not.toHaveBeenCalled();
    });

    it("should set isLoading true while fetching", async () => {
      let resolvePromise: (value: TapestryProfile) => void;
      vi.mocked(tapestry.getProfile).mockReturnValue(
        new Promise((resolve) => {
          resolvePromise = resolve;
        })
      );

      const { result } = renderHook(() => useTapestryProfile("profile-1"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(true);
      });

      await act(async () => {
        resolvePromise!(mockProfile);
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe("Error handling", () => {
    it("should set error when fetch fails with Error", async () => {
      vi.mocked(tapestry.getProfile).mockRejectedValue(
        new Error("Network error")
      );

      const { result } = renderHook(() => useTapestryProfile("profile-1"));

      await waitFor(() => {
        expect(result.current.error).toBe("Network error");
      });

      expect(result.current.profile).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });

    it("should set generic error when fetch fails with non-Error", async () => {
      vi.mocked(tapestry.getProfile).mockRejectedValue("string error");

      const { result } = renderHook(() => useTapestryProfile("profile-1"));

      await waitFor(() => {
        expect(result.current.error).toBe("Failed to fetch profile");
      });
    });
  });

  describe("Re-fetching", () => {
    it("should refetch when profileId changes", async () => {
      const profile2 = { ...mockProfile, id: "profile-2", username: "user2" };
      vi.mocked(tapestry.getProfile)
        .mockResolvedValueOnce(mockProfile)
        .mockResolvedValueOnce(profile2);

      const { result, rerender } = renderHook(
        ({ id }) => useTapestryProfile(id),
        { initialProps: { id: "profile-1" as string | null } }
      );

      await waitFor(() => {
        expect(result.current.profile?.id).toBe("profile-1");
      });

      rerender({ id: "profile-2" });

      await waitFor(() => {
        expect(result.current.profile?.id).toBe("profile-2");
      });

      expect(tapestry.getProfile).toHaveBeenCalledTimes(2);
    });

    it("should support manual refetch", async () => {
      vi.mocked(tapestry.getProfile)
        .mockResolvedValueOnce(mockProfile)
        .mockResolvedValueOnce({ ...mockProfile, bio: "Updated bio" });

      const { result } = renderHook(() => useTapestryProfile("profile-1"));

      await waitFor(() => {
        expect(result.current.profile?.bio).toBe("Hello world");
      });

      await act(async () => {
        result.current.refetch();
      });

      await waitFor(() => {
        expect(result.current.profile?.bio).toBe("Updated bio");
      });
    });
  });
});
