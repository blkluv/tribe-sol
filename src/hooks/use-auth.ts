"use client";

import { useEffect, useCallback, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useAuthStore } from "@/store/use-auth-store";

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
}

export function useAuth() {
  const { publicKey, connected, connecting, disconnect } = useWallet();
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
        apiFetch<{ profiles: Array<{ profile: { id: string; username: string; bio?: string | null; image?: string | null; namespace: string; created_at: number }; wallet?: { address: string }; socialCounts: { followers: number; following: number } }> }>(
          `/api/profiles?walletAddress=${encodeURIComponent(address)}`
        )
          .then((result) => {
            const found = result.profiles?.find(
              (p) => p.wallet?.address === address
            );
            if (found) {
              setTapestryProfile({
                id: found.profile.id,
                blockchain: "SOLANA",
                walletAddress: found.wallet?.address || address,
                username: found.profile.username,
                bio: found.profile.bio || undefined,
                image: found.profile.image || undefined,
                namespace: found.profile.namespace,
                created_at: String(found.profile.created_at),
                socialCounts: {
                  followers: found.socialCounts.followers,
                  following: found.socialCounts.following,
                  posts: 0,
                },
              });
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
        const result = await apiFetch<{ profile: { id: string; username: string; bio?: string | null; image?: string | null; namespace: string; created_at: number }; walletAddress?: string }>(
          "/api/profiles/create",
          {
            method: "POST",
            body: JSON.stringify({
              walletAddress,
              username,
              blockchain: "SOLANA",
              ...(bio ? { bio } : {}),
            }),
          }
        );
        setTapestryProfile({
          id: result.profile.id,
          blockchain: "SOLANA",
          walletAddress: result.walletAddress || walletAddress,
          username: result.profile.username,
          bio: result.profile.bio || undefined,
          image: result.profile.image || undefined,
          namespace: result.profile.namespace,
          created_at: String(result.profile.created_at),
        });
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
