"use client";

import { useState, useEffect } from "react";
import type { TapestryProfile } from "@/types/tapestry";

interface TapestryProfileData {
  profile: TapestryProfile | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useTapestryProfile(
  profileId: string | null | undefined
): TapestryProfileData {
  const [profile, setProfile] = useState<TapestryProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!profileId) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/profiles/info?username=${encodeURIComponent(profileId)}`
      );
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      setProfile({
        id: data.profile.id,
        blockchain: "SOLANA",
        walletAddress: data.walletAddress || "",
        username: data.profile.username,
        bio: data.profile.bio || undefined,
        image: data.profile.image || undefined,
        namespace: data.profile.namespace,
        created_at: String(data.profile.created_at),
        socialCounts: {
          followers: data.socialCounts?.followers || 0,
          following: data.socialCounts?.following || 0,
          posts: 0,
        },
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch profile"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId]);

  return { profile, isLoading, error, refetch: fetchProfile };
}
