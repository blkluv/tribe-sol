"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Hash, Users } from "lucide-react";
import { useTribeStore } from "@/store/use-tribe-store";
import { formatNumber } from "@/lib/utils";

const tabs = ["Posts", "Subchannels", "About"];

export default function ChannelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { tribes } = useTribeStore();
  const [activeTab, setActiveTab] = useState("Posts");

  const channel = tribes.find((t) => t.id === id);

  if (!channel) {
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">
        Channel not found
      </div>
    );
  }

  return (
    <div>
      <div className="sticky top-0 z-40 flex items-center gap-3 border-b bg-background/80 px-4 py-3 backdrop-blur-lg">
        <button onClick={() => router.back()} className="rounded-full p-1 hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold">{channel.name}</h1>
          <p className="text-xs text-muted-foreground">{formatNumber(channel.members)} members</p>
        </div>
      </div>

      <div className="border-b px-4">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium ${
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

      <div className="p-4">
        {activeTab === "Posts" && (
          <p className="text-center text-sm text-muted-foreground">No posts yet in this channel</p>
        )}

        {activeTab === "Subchannels" && (
          <div className="space-y-2">
            {channel.subchannels.map((sub) => (
              <div key={sub.id} className="flex items-center gap-3 rounded-xl border p-3">
                <Hash className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{sub.name}</p>
                  <p className="text-xs text-muted-foreground">{sub.description}</p>
                </div>
                <span className="text-xs text-muted-foreground">
                  <Users className="mr-1 inline h-3 w-3" />
                  {formatNumber(sub.members)}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "About" && (
          <div>
            <p className="mb-4 text-sm text-muted-foreground">{channel.description}</p>
            <h3 className="mb-2 text-sm font-semibold">Rules</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {channel.rules.map((rule, i) => (
                <li key={i}>&bull; {rule}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
