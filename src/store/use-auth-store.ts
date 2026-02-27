"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TapestryProfile } from "@/types/tapestry";

export type AuthStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "creating_profile"
  | "authenticated";

interface AuthState {
  status: AuthStatus;
  walletAddress: string | null;
  tapestryProfile: TapestryProfile | null;
  error: string | null;

  setStatus: (status: AuthStatus) => void;
  setWalletAddress: (address: string | null) => void;
  setTapestryProfile: (profile: TapestryProfile | null) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      status: "disconnected",
      walletAddress: null,
      tapestryProfile: null,
      error: null,

      setStatus: (status) => set({ status, error: null }),
      setWalletAddress: (walletAddress) => set({ walletAddress }),
      setTapestryProfile: (tapestryProfile) =>
        set({
          tapestryProfile,
          status: tapestryProfile ? "authenticated" : "connected",
        }),
      setError: (error) => set({ error }),
      reset: () =>
        set({
          status: "disconnected",
          walletAddress: null,
          tapestryProfile: null,
          error: null,
        }),
    }),
    {
      name: "tribe-auth",
      partialize: (state) => ({
        walletAddress: state.walletAddress,
        tapestryProfile: state.tapestryProfile,
        status: state.tapestryProfile ? "authenticated" : "disconnected",
      }),
    }
  )
);
