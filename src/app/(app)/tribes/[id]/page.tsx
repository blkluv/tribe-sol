"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Users, Lock, Shield, Hash, Share2, MapPin, Calendar, Star, Crown } from "lucide-react";
import { useTribeStore } from "@/store/use-tribe-store";
import { useShare } from "@/hooks/use-share";
import { formatNumber } from "@/lib/utils";
import { CastCard } from "@/components/features/home/cast-card";
import type { User } from "@/types";

const tabs = ["Feed", "Events", "Members", "About"];

export default function TribeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { tribes, joinTribe, leaveTribe, casts, events } = useTribeStore();
  const { share, showToast } = useShare();
  const [activeTab, setActiveTab] = useState("Feed");
  const [members, setMembers] = useState<User[]>([]);

  const tribe = tribes.find((t) => t.id === id);

  // Lazy-load members from users data
  useEffect(() => {
    if (!tribe) return;
    import("@/data/users").then(({ users }) => {
      setMembers(users.filter((u) => u.cityId === tribe.cityId));
    });
  }, [tribe]);

  if (!tribe) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Tribe not found</p>
      </div>
    );
  }

  const tribeCasts = casts.filter((c) => c.tribeId === tribe.id);
  const cityCasts = casts.filter((c) => c.cityId === tribe.cityId);
  const feedCasts = tribeCasts.length > 0 ? tribeCasts : cityCasts.slice(0, 5);
  const tribeEvents = events.filter((e) => e.cityId === tribe.cityId);

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-40 flex items-center gap-3 border-b bg-background/80 px-4 py-3 backdrop-blur-lg">
        <button onClick={() => router.back()} className="rounded-full p-1 hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="flex-1 truncate text-lg font-bold">{tribe.name}</h1>
        <button
          onClick={() => share(
            tribe.name,
            tribe.description,
            `${typeof window !== "undefined" ? window.location.origin : ""}/tribes/${id}`
          )}
          className="rounded-full p-2 hover:bg-muted"
        >
          <Share2 className="h-5 w-5" />
        </button>
      </div>

      {/* Hero */}
      {tribe.imageUrl && (
        <div className="relative h-40">
          <Image src={tribe.imageUrl} alt={tribe.name} fill className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}

      {/* Info */}
      <div className="p-4">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">{tribe.name}</h2>
              {tribe.isPrivate && <Lock className="h-4 w-4 text-muted-foreground" />}
            </div>
            <p className="text-sm text-muted-foreground">
              {formatNumber(tribe.members)} members
            </p>
          </div>
          <button
            onClick={() => (tribe.isJoined ? leaveTribe(tribe.id) : joinTribe(tribe.id))}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
              tribe.isJoined
                ? "bg-muted text-muted-foreground"
                : "text-white"
            }`}
            style={!tribe.isJoined ? { backgroundColor: tribe.color } : undefined}
          >
            {tribe.isJoined ? "Leave" : "Join Tribe"}
          </button>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">{tribe.description}</p>

        {/* Tabs */}
        <div className="flex gap-1 border-b">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-foreground text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "Feed" && (
          <div>
            {feedCasts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                <Users className="mb-3 h-10 w-10 text-muted-foreground/30" />
                <p className="text-sm font-bold text-muted-foreground">No posts yet</p>
                <p className="text-xs text-muted-foreground/70">Be the first to share something in this tribe!</p>
              </div>
            ) : (
              <div>
                {tribeCasts.length === 0 && (
                  <div className="border-b bg-muted/10 px-4 py-2.5">
                    <p className="text-xs font-medium text-muted-foreground">
                      Showing recent posts from {tribe.cityId.replace("-", " ")}
                    </p>
                  </div>
                )}
                <div className="space-y-1">
                  {feedCasts.map((cast) => (
                    <CastCard key={cast.id} cast={cast} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "Events" && (
          <div className="p-4">
            {tribeEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Calendar className="mb-3 h-10 w-10 text-muted-foreground/30" />
                <p className="text-sm font-bold text-muted-foreground">No upcoming events</p>
                <p className="text-xs text-muted-foreground/70">Check back soon or create one!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tribeEvents.map((event) => (
                  <Link
                    key={event.id}
                    href={`/explore/event/${event.id}`}
                    className="flex gap-3 rounded-2xl border p-3 transition-all hover:bg-muted/30"
                  >
                    {event.imageUrl && (
                      <div className="relative h-20 w-20 flex-none overflow-hidden rounded-xl bg-muted">
                        <Image src={event.imageUrl} alt={event.title} fill className="object-cover" sizes="80px" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold truncate">{event.title}</h3>
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{event.location}</span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{event.timeAgo}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <span>{formatNumber(event.participants)} attending</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "Members" && (
          <div className="p-4 space-y-2">
            {members.map((member) => {
              const isMod = tribe.moderators.includes(member.id);
              return (
                <div key={member.id} className="flex items-center gap-3 rounded-xl border p-3">
                  <div className="relative h-10 w-10 flex-none overflow-hidden rounded-full">
                    <Image src={member.avatarUrl} alt={member.displayName} fill className="object-cover" sizes="40px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold truncate">{member.displayName}</span>
                      {isMod && (
                        <span className="flex items-center gap-0.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                          <Crown className="h-2.5 w-2.5" /> Mod
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">@{member.username}</p>
                  </div>
                  {member.karma && (
                    <div className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5">
                      <Star className="h-3 w-3" style={{ color: getKarmaColor(member.karma.level) }} />
                      <span className="text-[10px] font-bold capitalize">{member.karma.level}</span>
                    </div>
                  )}
                </div>
              );
            })}
            {members.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">Loading members...</p>
            )}
          </div>
        )}

        {activeTab === "About" && (
          <div className="p-4 space-y-4">
            {tribe.subchannels.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-semibold">Subchannels</h3>
                <div className="space-y-2">
                  {tribe.subchannels.map((sub) => (
                    <div key={sub.id} className="flex items-center gap-3 rounded-xl border p-3">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{sub.name}</p>
                        <p className="text-xs text-muted-foreground">{sub.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tribe.rules.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-semibold">Rules</h3>
                <div className="space-y-1.5">
                  {tribe.rules.map((rule, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield className="h-3.5 w-3.5" />
                      {rule}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showToast && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background shadow-lg animate-in fade-in slide-in-from-bottom-4">
          Link copied!
        </div>
      )}
    </div>
  );
}

function getKarmaColor(level: string): string {
  const colors: Record<string, string> = {
    newcomer: "#94A3B8",
    neighbor: "#6366F1",
    local: "#14B8A6",
    trusted: "#FB923C",
    pillar: "#EC4899",
    legend: "#EAB308",
  };
  return colors[level] || "#94A3B8";
}
