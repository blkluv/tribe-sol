"use client";

import { useEffect } from "react";
import { useTribeStore } from "@/store/use-tribe-store";

// Lazy-import data to avoid bundling issues with SSR
export function StoreInitializer() {
  const { currentCity, setInitialData } = useTribeStore();

  useEffect(() => {
    if (currentCity) return; // Already initialized

    // Dynamic import to avoid SSR issues
    Promise.all([
      import("@/data/cities"),
      import("@/data/users"),
      import("@/data/casts"),
      import("@/data/explore"),
      import("@/data/polls"),
      import("@/data/tasks"),
      import("@/data/crowdfunds"),
      import("@/data/tribes"),
    ]).then(
      ([
        { cities },
        { currentUser },
        { casts },
        { exploreItems },
        { polls },
        { tasks },
        { crowdfunds },
        { tribes },
      ]) => {
        const city = cities[0]; // Bangalore default
        setInitialData({
          city,
          user: currentUser,
          casts: casts.filter((c: { cityId?: string }) => c.cityId === city.id),
          events: exploreItems.filter((e: { cityId?: string }) => e.cityId === city.id),
          polls: polls.filter((p: { id: string }) => p.id.includes(city.id.slice(0, 3))),
          tasks: tasks[city.id] || [],
          crowdfunds: crowdfunds[city.id] || [],
          tribes: tribes.filter((t: { cityId?: string }) => t.cityId === city.id),
        });
      }
    ).catch(() => {
      // Data files may not exist yet during build
    });
  }, [currentCity, setInitialData]);

  return null;
}
