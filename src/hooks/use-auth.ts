"use client";

import { useEffect, useCallback, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useAuthStore } from "@/store/use-auth-store";
import * as tapestry from "@/lib/tapestry";

export function useAuth() {
  const { publicKey, connected, connecting, disconnect, wallet } = useWallet();
  const { setVisible } = useWalletModal();
  const {
    status,
    walletAddress,
    tapestryProfile,
    error,
    setStatus,
    setWalletAddress,
    setTapestryProfile,
    setError,
    reset,
  } = useAuthStore();

  const hasSearched = useRef(false);

  const address = publicKey?.toBase58() ?? null;
  const isConnecting = connecting;

  // Sync wallet connection state
  useEffect(() => {
    if (connected && address) {
      setWalletAddress(address);

      // If we already have a profile cached, stay authenticated
      if (tapestryProfile) {
        setStatus("authenticated");
        return;
      }

      setStatus("connected");

      // Search for existing Tapestry profile by wallet address
      if (!hasSearched.current) {
        hasSearched.current = true;
        tapestry
          .searchProfiles(address)
          .then((result) => {
            const found = result.profiles?.find(
              (p) => p.walletAddress === address
            );
            if (found) {
              setTapestryProfile(found);
            }
          })
          .catch(() => {
            // No profile found, that's fine — user will create one during onboarding
          });
      }
    } else if (!connected) {
      // Only reset if we were previously connected
      if (status !== "disconnected") {
        hasSearched.current = false;
        reset();
      }
    }
  }, [
    connected,
    address,
    tapestryProfile,
    status,
    setStatus,
    setWalletAddress,
    setTapestryProfile,
    reset,
  ]);

  const createProfile = useCallback(
    async (username: string, bio?: string) => {
      if (!walletAddress) {
        setError("Wallet not connected");
        return;
      }

      setStatus("creating_profile");

      try {
        const profile = await tapestry.findOrCreateProfile(
          walletAddress,
          username,
          bio
        );
        setTapestryProfile(profile);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create profile"
        );
        setStatus("connected");
      }
    },
    [walletAddress, setStatus, setTapestryProfile, setError]
  );

  const login = useCallback(() => {
    setVisible(true);
  }, [setVisible]);

  const logout = useCallback(async () => {
    reset();
    await disconnect();
  }, [reset, disconnect]);

  return {
    status,
    walletAddress,
    profile: tapestryProfile,
    error,
    isAuthenticated: status === "authenticated",
    isConnected: connected && !!address,
    isConnecting,
    createProfile,
    login,
    logout,
  };
}
