"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  PenSquare,
  Calendar,
  BarChart3,
  CheckCircle,
  Banknote,
  Hash,
  ArrowLeft,
  ImagePlus,
  Send,
  Loader2,
} from "lucide-react";
import { useTribeStore } from "@/store/use-tribe-store";
import { useAuth } from "@/hooks/use-auth";
import * as tapestry from "@/lib/tapestry";
import type { Cast } from "@/types";

const createOptions = [
  {
    id: "cast",
    label: "Cast",
    description: "Share a photo or update",
    icon: PenSquare,
    color: "#6366F1",
  },
  {
    id: "event",
    label: "Event",
    description: "Create a local event",
    icon: Calendar,
    color: "#14B8A6",
  },
  {
    id: "poll",
    label: "Poll",
    description: "Ask the community",
    icon: BarChart3,
    color: "#FB7185",
  },
  {
    id: "task",
    label: "Task",
    description: "Request community help",
    icon: CheckCircle,
    color: "#FB923C",
  },
  {
    id: "crowdfund",
    label: "Crowdfund",
    description: "Raise funds for a cause",
    icon: Banknote,
    color: "#A78BFA",
  },
  {
    id: "channel",
    label: "Channel",
    description: "Start a new community",
    icon: Hash,
    color: "#38BDF8",
  },
];

export default function CreatePage() {
  const router = useRouter();
  const { addCast, currentUser, currentCity } = useTribeStore();
  const { isAuthenticated, profile } = useAuth();
  const [mode, setMode] = useState<"menu" | "cast">("menu");
  const [caption, setCaption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateCast = async () => {
    if (!caption.trim() || !currentUser) return;

    setIsSubmitting(true);

    const newCast: Cast = {
      id: `cast-${Date.now()}`,
      user: {
        id: currentUser.id,
        username: currentUser.username,
        displayName: currentUser.displayName,
        avatarUrl: currentUser.avatarUrl,
        cityId: currentUser.cityId,
        isVerified: true,
      },
      caption: caption.trim(),
      imageUrl: "https://picsum.photos/seed/" + Date.now() + "/600/600",
      cityId: currentCity?.id || currentUser.cityId,
      likes: 0,
      comments: [],
      isLiked: false,
      isSaved: false,
      tipCount: 0,
      totalTips: 0,
      timestamp: "Just now",
    };

    // Optimistic local update
    addCast(newCast);

    // Persist to Tapestry if authenticated
    if (isAuthenticated && profile?.id) {
      try {
        await tapestry.createContent(profile.id, [
          { key: "type", value: "cast" },
          { key: "caption", value: caption.trim() },
          { key: "imageUrl", value: newCast.imageUrl },
          ...(currentCity
            ? [{ key: "cityId", value: currentCity.id }]
            : []),
        ]);
      } catch {
        // Non-fatal — cast is already in local store
        console.warn("Failed to persist cast to Tapestry");
      }
    }

    setIsSubmitting(false);
    router.push("/home");
  };

  if (mode === "cast") {
    return (
      <div>
        <div className="sticky top-0 z-40 flex items-center justify-between border-b bg-background/80 px-4 py-3 backdrop-blur-lg">
          <button
            onClick={() => setMode("menu")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-bold">New Cast</h1>
          <button
            onClick={handleCreateCast}
            disabled={!caption.trim() || isSubmitting}
            className="flex items-center gap-1.5 rounded-full bg-indigo-500 px-4 py-1.5 text-sm font-semibold text-white disabled:opacity-40"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Post
          </button>
        </div>

        <div className="p-4 space-y-4">
          <textarea
            placeholder="What's happening in your neighborhood?"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={4}
            autoFocus
            className="w-full resize-none bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />

          <button className="flex items-center gap-2 rounded-xl border border-dashed p-8 w-full text-muted-foreground hover:bg-muted/30 transition-colors">
            <ImagePlus className="h-6 w-6" />
            <span className="text-sm">Add photo</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="sticky top-0 z-40 border-b bg-background/80 px-4 py-3 backdrop-blur-lg">
        <h1 className="text-lg font-bold">Create</h1>
        <p className="text-sm text-muted-foreground">
          What do you want to share?
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 p-4">
        {createOptions.map((opt) => {
          const Icon = opt.icon;
          return (
            <button
              key={opt.id}
              onClick={() => {
                if (opt.id === "cast") setMode("cast");
              }}
              className="flex flex-col items-center gap-3 rounded-2xl border p-6 text-center transition-shadow hover:shadow-tribe-small"
            >
              <div
                className="flex h-14 w-14 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: `${opt.color}15`,
                  color: opt.color,
                }}
              >
                <Icon className="h-7 w-7" />
              </div>
              <div>
                <p className="font-semibold">{opt.label}</p>
                <p className="text-xs text-muted-foreground">
                  {opt.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
