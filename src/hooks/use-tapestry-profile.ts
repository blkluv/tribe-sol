"use client";

import { useState, useEffect } from "react";
import type { TapestryProfile } from "@/types/tapestry";
import * as tapestry from "@/lib/tapestry";

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
      const data = await tapestry.getProfile(profileId);
      setProfile(data);
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
