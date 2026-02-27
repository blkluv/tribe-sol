import type { City } from "@/types";

export async function loadCityData(city: City) {
  const [
    { casts },
    { exploreItems },
    { polls },
    { tasks },
    { crowdfunds },
    { tribes },
  ] = await Promise.all([
    import("@/data/casts"),
    import("@/data/explore"),
    import("@/data/polls"),
    import("@/data/tasks"),
    import("@/data/crowdfunds"),
    import("@/data/tribes"),
  ]);

  return {
    casts: casts.filter((c: { cityId?: string }) => c.cityId === city.id),
    events: exploreItems.filter((e: { cityId?: string }) => e.cityId === city.id),
    polls: polls.filter((p: { id: string }) => p.id.includes(city.id.slice(0, 3))),
    tasks: tasks[city.id] || [],
    crowdfunds: crowdfunds[city.id] || [],
    tribes: tribes.filter((t: { cityId?: string }) => t.cityId === city.id),
  };
}
