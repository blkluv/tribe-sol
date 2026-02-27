"use client";

import { useState } from "react";
import Image from "next/image";
import { Settings, MapPin, Calendar, BadgeCheck, Star, Award } from "lucide-react";
import Link from "next/link";
import { useTribeStore } from "@/store/use-tribe-store";
import { karmaLevelConfig, getKarmaProgress } from "@/lib/theme";
import { formatNumber } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

const tabs = ["Activity", "Badges", "Stats"];

export default function ProfilePage() {
  const { currentUser, currentCity } = useTribeStore();
  const [activeTab, setActiveTab] = useState("Activity");

  if (!currentUser) {
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  const karma = currentUser.karma;
  const levelConfig = karma ? karmaLevelConfig[karma.level] : null;
  const progress = karma ? getKarmaProgress(karma.totalKarma, karma.level) : 0;

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b bg-background/80 px-4 py-3 backdrop-blur-lg">
        <h1 className="text-lg font-bold">Profile</h1>
        <Link href="/settings" className="rounded-full p-2 hover:bg-muted">
          <Settings className="h-5 w-5" />
        </Link>
      </div>

      {/* Cover + Avatar */}
      <div className="relative h-32 bg-gradient-to-r from-indigo-500 to-violet-500">
        {currentCity && (
          <Image
            src={currentCity.imageUrl}
            alt=""
            fill
            className="object-cover opacity-50"
            sizes="100vw"
          />
        )}
      </div>
      <div className="px-4">
        <div className="relative -mt-12 mb-3 flex items-end gap-4">
          <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-background">
            <Image
              src={currentUser.avatarUrl}
              alt={currentUser.displayName}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
          <div className="mb-1 flex-1">
            <div className="flex items-center gap-1.5">
              <h2 className="text-xl font-bold">{currentUser.displayName}</h2>
              {currentUser.isVerified && <BadgeCheck className="h-5 w-5 text-indigo-500" />}
            </div>
            <p className="text-sm text-muted-foreground">@{currentUser.username}</p>
          </div>
        </div>

        {currentUser.bio && (
          <p className="mb-3 text-sm">{currentUser.bio}</p>
        )}

        <div className="mb-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
          {currentUser.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {currentUser.location}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Joined {currentUser.joinedDate || "2024"}
          </span>
        </div>

        {/* Karma */}
        {karma && levelConfig && (
          <div className="mb-4 rounded-2xl border p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${levelConfig.color}20`, color: levelConfig.color }}
                >
                  <Star className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{levelConfig.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatNumber(karma.totalKarma)} karma
                  </p>
                </div>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="mt-1 text-xs text-muted-foreground">
              {Math.round(progress)}% to next level
            </p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="mb-4 grid grid-cols-3 gap-3">
          {[
            { label: "Posts", value: 42 },
            { label: "Events", value: 15 },
            { label: "Tasks", value: 8 },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border p-3 text-center">
              <p className="text-lg font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b">
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

        <div className="py-4">
          {activeTab === "Activity" && (
            <div className="space-y-3">
              {[
                { title: "Neighborhood Cleanup Success!", time: "2 days ago", type: "Post" },
                { title: "Book Club Meeting", time: "1 week ago", type: "Event" },
                { title: "Helped with Moving", time: "2 weeks ago", type: "Task" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Award className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.type} &middot; {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "Badges" && (
            <div className="grid grid-cols-2 gap-3">
              {["Community Leader", "Event Organizer", "Top Contributor", "Early Adopter"].map(
                (badge) => (
                  <div key={badge} className="flex items-center gap-2 rounded-xl border p-3">
                    <Award className="h-5 w-5 text-amber-500" />
                    <span className="text-sm font-medium">{badge}</span>
                  </div>
                )
              )}
            </div>
          )}

          {activeTab === "Stats" && (
            <div className="space-y-3">
              {karma && (
                <>
                  <div className="flex justify-between rounded-xl border p-3">
                    <span className="text-sm text-muted-foreground">Posts Karma</span>
                    <span className="text-sm font-semibold">{karma.breakdown.postsKarma}</span>
                  </div>
                  <div className="flex justify-between rounded-xl border p-3">
                    <span className="text-sm text-muted-foreground">Helpful Karma</span>
                    <span className="text-sm font-semibold">{karma.breakdown.helpfulKarma}</span>
                  </div>
                  <div className="flex justify-between rounded-xl border p-3">
                    <span className="text-sm text-muted-foreground">Events Karma</span>
                    <span className="text-sm font-semibold">{karma.breakdown.eventsKarma}</span>
                  </div>
                  <div className="flex justify-between rounded-xl border p-3">
                    <span className="text-sm text-muted-foreground">Community Karma</span>
                    <span className="text-sm font-semibold">{karma.breakdown.communityKarma}</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
