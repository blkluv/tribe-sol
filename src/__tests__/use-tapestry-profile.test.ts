import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useTapestryProfile } from "@/hooks/use-tapestry-profile";

// Mock global fetch
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

// SDK-shaped profile detail response
const sdkProfileDetail = {
  profile: {
    id: "profile-1",
    namespace: "tribe",
    created_at: 1704067200,
    username: "testuser",
    bio: "Hello world",
    image: null,
  },
  walletAddress: "wallet123",
  socialCounts: { followers: 10, following: 5 },
};

function mockOkResponse(data: unknown) {
  return Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  });
}

function mockErrorResponse(status = 500, body = "Error") {
  return Promise.resolve({
    ok: false,
    status,
    json: () => Promise.reject(new Error("not json")),
    text: () => Promise.resolve(body),
  });
}

describe("useTapestryProfile", () => {
  beforeEach(() => {
    mockFetch.mockReset();
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
      mockFetch.mockReturnValue(mockOkResponse(sdkProfileDetail));

      const { result } = renderHook(() => useTapestryProfile("profile-1"));

      await waitFor(() => {
        expect(result.current.profile).not.toBeNull();
      });

      expect(result.current.profile!.id).toBe("profile-1");
      expect(result.current.profile!.username).toBe("testuser");
      expect(result.current.profile!.walletAddress).toBe("wallet123");
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/profiles/info?username=profile-1")
      );
    });

    it("should not fetch when profileId is null", () => {
      renderHook(() => useTapestryProfile(null));

      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("should set isLoading true while fetching", async () => {
      let resolvePromise: (value: unknown) => void;
      mockFetch.mockReturnValue(
        new Promise((resolve) => {
          resolvePromise = resolve;
        })
      );

      const { result } = renderHook(() => useTapestryProfile("profile-1"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(true);
      });

      await act(async () => {
        resolvePromise!({
          ok: true,
          status: 200,
          json: () => Promise.resolve(sdkProfileDetail),
        });
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe("Error handling", () => {
    it("should set error when fetch fails", async () => {
      mockFetch.mockReturnValue(mockErrorResponse(404));

      const { result } = renderHook(() => useTapestryProfile("profile-1"));

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });

      expect(result.current.profile).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });

    it("should set error when fetch throws", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(() => useTapestryProfile("profile-1"));

      await waitFor(() => {
        expect(result.current.error).toBe("Network error");
      });
    });
  });

  describe("Re-fetching", () => {
    it("should refetch when profileId changes", async () => {
      const profile2 = {
        ...sdkProfileDetail,
        profile: { ...sdkProfileDetail.profile, id: "profile-2", username: "user2" },
      };
      mockFetch
        .mockReturnValueOnce(mockOkResponse(sdkProfileDetail))
        .mockReturnValueOnce(mockOkResponse(profile2));

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

      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it("should support manual refetch", async () => {
      const updatedProfile = {
        ...sdkProfileDetail,
        profile: { ...sdkProfileDetail.profile, bio: "Updated bio" },
      };
      mockFetch
        .mockReturnValueOnce(mockOkResponse(sdkProfileDetail))
        .mockReturnValueOnce(mockOkResponse(updatedProfile));

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
