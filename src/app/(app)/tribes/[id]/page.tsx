"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Users, Lock, Shield, Hash, Share2 } from "lucide-react";
import { useTribeStore } from "@/store/use-tribe-store";
import { useShare } from "@/hooks/use-share";
import { formatNumber } from "@/lib/utils";

const tabs = ["Feed", "Events", "Members", "About"];

export default function TribeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { tribes, joinTribe, leaveTribe, casts } = useTribeStore();
  const { share, showToast } = useShare();
  const [activeTab, setActiveTab] = useState("Feed");

  const tribe = tribes.find((t) => t.id === id);

  if (!tribe) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Tribe not found</p>
      </div>
    );
  }

  const tribeCasts = casts.filter((c) => c.tribeId === tribe.id);

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
            style={!tribe.isJoined ? { backgroundColor: `#${tribe.color}` } : undefined}
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
      <div className="p-4">
        {activeTab === "Feed" && (
          <div>
            {tribeCasts.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">No posts yet</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                {tribeCasts.length} posts in this tribe
              </p>
            )}
          </div>
        )}

        {activeTab === "Members" && (
          <div className="text-sm text-muted-foreground">
            <p>{formatNumber(tribe.members)} members</p>
          </div>
        )}

        {activeTab === "About" && (
          <div className="space-y-4">
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
