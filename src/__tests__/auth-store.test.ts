import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "@/store/use-auth-store";
import type { TapestryProfile } from "@/types/tapestry";

const mockProfile: TapestryProfile = {
  id: "profile-1",
  blockchain: "SOLANA",
  walletAddress: "ABC123wallet",
  username: "testuser",
  bio: "Test bio",
  namespace: "tribe",
  created_at: "2025-01-01T00:00:00Z",
  socialCounts: { followers: 10, following: 5, posts: 3 },
};

describe("useAuthStore", () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useAuthStore.getState().reset();
  });

  describe("Initial State", () => {
    it("should start with disconnected status", () => {
      const state = useAuthStore.getState();
      expect(state.status).toBe("disconnected");
    });

    it("should start with null walletAddress", () => {
      const state = useAuthStore.getState();
      expect(state.walletAddress).toBeNull();
    });

    it("should start with null tapestryProfile", () => {
      const state = useAuthStore.getState();
      expect(state.tapestryProfile).toBeNull();
    });

    it("should start with null error", () => {
      const state = useAuthStore.getState();
      expect(state.error).toBeNull();
    });
  });

  describe("setStatus", () => {
    it("should update status", () => {
      useAuthStore.getState().setStatus("connecting");
      expect(useAuthStore.getState().status).toBe("connecting");
    });

    it("should clear error when setting status", () => {
      useAuthStore.getState().setError("some error");
      expect(useAuthStore.getState().error).toBe("some error");

      useAuthStore.getState().setStatus("connected");
      expect(useAuthStore.getState().error).toBeNull();
    });

    it("should support all status values", () => {
      const statuses = [
        "disconnected",
        "connecting",
        "connected",
        "creating_profile",
        "authenticated",
      ] as const;

      for (const s of statuses) {
        useAuthStore.getState().setStatus(s);
        expect(useAuthStore.getState().status).toBe(s);
      }
    });
  });

  describe("setWalletAddress", () => {
    it("should set wallet address", () => {
      useAuthStore.getState().setWalletAddress("wallet123");
      expect(useAuthStore.getState().walletAddress).toBe("wallet123");
    });

    it("should allow setting wallet address to null", () => {
      useAuthStore.getState().setWalletAddress("wallet123");
      useAuthStore.getState().setWalletAddress(null);
      expect(useAuthStore.getState().walletAddress).toBeNull();
    });
  });

  describe("setTapestryProfile", () => {
    it("should set profile and auto-update status to authenticated", () => {
      useAuthStore.getState().setStatus("connected");
      useAuthStore.getState().setTapestryProfile(mockProfile);

      const state = useAuthStore.getState();
      expect(state.tapestryProfile).toEqual(mockProfile);
      expect(state.status).toBe("authenticated");
    });

    it("should set status to connected when profile is null", () => {
      useAuthStore.getState().setTapestryProfile(mockProfile);
      expect(useAuthStore.getState().status).toBe("authenticated");

      useAuthStore.getState().setTapestryProfile(null);
      expect(useAuthStore.getState().status).toBe("connected");
    });

    it("should store full profile data", () => {
      useAuthStore.getState().setTapestryProfile(mockProfile);
      const profile = useAuthStore.getState().tapestryProfile;

      expect(profile?.id).toBe("profile-1");
      expect(profile?.walletAddress).toBe("ABC123wallet");
      expect(profile?.username).toBe("testuser");
      expect(profile?.bio).toBe("Test bio");
      expect(profile?.socialCounts?.followers).toBe(10);
    });
  });

  describe("setError", () => {
    it("should set error message", () => {
      useAuthStore.getState().setError("Network error");
      expect(useAuthStore.getState().error).toBe("Network error");
    });

    it("should allow clearing error with null", () => {
      useAuthStore.getState().setError("Error");
      useAuthStore.getState().setError(null);
      expect(useAuthStore.getState().error).toBeNull();
    });
  });

  describe("reset", () => {
    it("should reset all state to initial values", () => {
      // Set various state
      useAuthStore.getState().setWalletAddress("wallet123");
      useAuthStore.getState().setTapestryProfile(mockProfile);
      useAuthStore.getState().setError("some error");

      // Reset
      useAuthStore.getState().reset();

      const state = useAuthStore.getState();
      expect(state.status).toBe("disconnected");
      expect(state.walletAddress).toBeNull();
      expect(state.tapestryProfile).toBeNull();
      expect(state.error).toBeNull();
    });
  });

  describe("Persistence partialize", () => {
    it("should partialize to include walletAddress, tapestryProfile, and derived status", () => {
      // The persist middleware's partialize function derives status from profile
      useAuthStore.getState().setWalletAddress("wallet123");
      useAuthStore.getState().setTapestryProfile(mockProfile);

      // Access the persist API to check partialize
      const persistApi = (useAuthStore as unknown as { persist: { getOptions: () => { partialize: (state: ReturnType<typeof useAuthStore.getState>) => unknown } } }).persist;
      const options = persistApi.getOptions();
      const partialized = options.partialize(useAuthStore.getState()) as {
        walletAddress: string | null;
        tapestryProfile: TapestryProfile | null;
        status: string;
      };

      expect(partialized.walletAddress).toBe("wallet123");
      expect(partialized.tapestryProfile).toEqual(mockProfile);
      expect(partialized.status).toBe("authenticated");
    });

    it("should set status to disconnected in partialize when no profile", () => {
      useAuthStore.getState().setStatus("connected");

      const persistApi = (useAuthStore as unknown as { persist: { getOptions: () => { partialize: (state: ReturnType<typeof useAuthStore.getState>) => unknown } } }).persist;
      const options = persistApi.getOptions();
      const partialized = options.partialize(useAuthStore.getState()) as {
        status: string;
      };

      expect(partialized.status).toBe("disconnected");
    });
  });

  describe("State Transitions", () => {
    it("should handle full auth flow: disconnected → connecting → connected → creating_profile → authenticated", () => {
      expect(useAuthStore.getState().status).toBe("disconnected");

      useAuthStore.getState().setStatus("connecting");
      expect(useAuthStore.getState().status).toBe("connecting");

      useAuthStore.getState().setStatus("connected");
      useAuthStore.getState().setWalletAddress("wallet123");
      expect(useAuthStore.getState().status).toBe("connected");

      useAuthStore.getState().setStatus("creating_profile");
      expect(useAuthStore.getState().status).toBe("creating_profile");

      useAuthStore.getState().setTapestryProfile(mockProfile);
      expect(useAuthStore.getState().status).toBe("authenticated");
    });

    it("should handle logout: authenticated → disconnected", () => {
      useAuthStore.getState().setWalletAddress("wallet123");
      useAuthStore.getState().setTapestryProfile(mockProfile);
      expect(useAuthStore.getState().status).toBe("authenticated");

      useAuthStore.getState().reset();
      expect(useAuthStore.getState().status).toBe("disconnected");
      expect(useAuthStore.getState().walletAddress).toBeNull();
      expect(useAuthStore.getState().tapestryProfile).toBeNull();
    });

    it("should handle profile creation failure: creating_profile → connected (with error)", () => {
      useAuthStore.getState().setStatus("creating_profile");
      useAuthStore.getState().setError("Creation failed");
      useAuthStore.getState().setStatus("connected");

      expect(useAuthStore.getState().status).toBe("connected");
      // setStatus clears error
      expect(useAuthStore.getState().error).toBeNull();
    });
  });
});
