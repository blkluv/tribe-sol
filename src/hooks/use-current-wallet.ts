"use client";

import { useState, useEffect, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import * as tapestry from "@/lib/tapestry";

export function useCurrentWallet() {
  const { publicKey, connected, connecting } = useWallet();
  const [mainUsername, setMainUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const hasSearched = useRef(false);

  const walletAddress = publicKey?.toBase58() ?? null;
  const isConnected = connected && !!walletAddress;

  useEffect(() => {
    if (!walletAddress || !connected) {
      hasSearched.current = false;
      setMainUsername(null);
      return;
    }

    if (hasSearched.current) return;
    hasSearched.current = true;
    setLoading(true);

    tapestry
      .searchProfiles(walletAddress)
      .then((result) => {
        const found = result.profiles?.find(
          (p) => p.walletAddress === walletAddress
        );
        if (found) {
          setMainUsername(found.username);
        }
      })
      .catch(() => {
        // No profile found
      })
      .finally(() => setLoading(false));
  }, [walletAddress, connected]);

  return {
    walletAddress,
    isConnected,
    mainUsername,
    loading: loading || connecting,
  };
}
