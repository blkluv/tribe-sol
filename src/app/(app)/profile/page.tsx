"use client";

import { useState } from "react";
import Image from "next/image";
import { Settings, MapPin, Calendar, BadgeCheck, Star, Award, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useTribeStore } from "@/store/use-tribe-store";
import { karmaLevelConfig, getKarmaProgress } from "@/lib/theme";
import { cn, formatNumber } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

const tabs = ["Activity", "Badges", "Stats"];

export default function ProfilePage() {
  const { currentUser, currentCity } = useTribeStore();
  const [activeTab, setActiveTab] = useState("Activity");

  if (!currentUser) {
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const karma = currentUser.karma;
  const levelConfig = karma ? karmaLevelConfig[karma.level] : null;
  const progress = karma ? getKarmaProgress(karma.totalKarma, karma.level) : 0;

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b bg-white/95 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-black lowercase tracking-tighter">{currentUser.username}</h1>
          <BadgeCheck className="h-4 w-4 text-blue-500" />
        </div>
        <div className="flex items-center gap-4">
          <button className="text-muted-foreground hover:text-foreground">
            <PlusCircle className="h-6 w-6" />
          </button>
          <Link href="/settings" className="text-muted-foreground hover:text-foreground">
            <Settings className="h-6 w-6" />
          </Link>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Profile Info Row */}
        <div className="flex items-center gap-8 mb-6">
          <div className="relative h-20 w-20 flex-none overflow-hidden rounded-full ring-2 ring-muted ring-offset-2">
            <Image
              src={currentUser.avatarUrl}
              alt={currentUser.displayName}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
          <div className="flex-1 flex justify-around">
            <div className="text-center">
              <p className="text-[16px] font-black">42</p>
              <p className="text-[12px] text-muted-foreground font-medium">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-[16px] font-black">1.2k</p>
              <p className="text-[12px] text-muted-foreground font-medium">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-[16px] font-black">{karma?.totalKarma || 0}</p>
              <p className="text-[12px] text-muted-foreground font-medium lowercase">Karma</p>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-6">
          <h2 className="text-[14px] font-bold tracking-tight">{currentUser.displayName}</h2>
          <p className="text-[14px] text-muted-foreground mb-1">@{currentUser.username}</p>
          {currentUser.bio && (
            <p className="text-[14px] leading-snug mb-2 whitespace-pre-wrap">{currentUser.bio}</p>
          )}
          <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span className="font-medium">{currentUser.location || "Earth"}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-8">
          <button className="flex-1 rounded-lg bg-muted/50 py-2 text-[14px] font-bold hover:bg-muted transition-colors">Edit Profile</button>
          <button className="flex-1 rounded-lg bg-muted/50 py-2 text-[14px] font-bold hover:bg-muted transition-colors">Share Profile</button>
        </div>

        {/* Karma Progress Card */}
        {karma && levelConfig && (
          <div className="mb-8 rounded-2xl border bg-muted/10 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl shadow-sm bg-white"
                  style={{ color: levelConfig.color }}
                >
                  <Star className="h-6 w-6 fill-current" />
                </div>
                <div>
                  <p className="text-sm font-black lowercase tracking-tight">{levelConfig.label}</p>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    Level {karma.level}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-black">{formatNumber(karma.totalKarma)}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Total Karma</p>
              </div>
            </div>
            <Progress value={progress} className="h-1.5" />
            <div className="mt-2 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
              <span>Recent Progress</span>
              <span>{Math.round(progress)}% to next level</span>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-t -mx-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 flex flex-col items-center py-3 text-[12px] font-bold uppercase tracking-widest transition-colors",
                activeTab === tab
                  ? "text-black border-t-2 border-black -mt-[2px]"
                  : "text-muted-foreground hover:text-black"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Activity Tab Grid */}
        <div className="py-4 -mx-4">
          {activeTab === "Activity" && (
            <div className="grid grid-cols-3 gap-[1px]">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <div key={i} className="relative aspect-square bg-muted animate-pulse">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Award className="h-8 w-8 text-black/5" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "Badges" && (
            <div className="grid grid-cols-2 gap-3 px-4">
              {["Community Leader", "Event Organizer", "Top Contributor", "Early Adopter"].map(
                (badge) => (
                  <div key={badge} className="flex flex-col items-center gap-3 rounded-2xl border p-6 text-center shadow-sm">
                    <div className="h-16 w-16 rounded-full bg-amber-500/10 flex items-center justify-center">
                      <Award className="h-8 w-8 text-amber-500" />
                    </div>
                    <span className="text-sm font-bold tracking-tight">{badge}</span>
                  </div>
                )
              )}
            </div>
          )}

          {activeTab === "Stats" && (
            <div className="space-y-2 px-4">
              {karma && (
                <>
                  <div className="flex justify-between rounded-xl border p-4 bg-muted/5">
                    <span className="text-sm font-bold text-muted-foreground lowercase">Posts Karma</span>
                    <span className="text-[15px] font-black">{karma.breakdown.postsKarma}</span>
                  </div>
                  <div className="flex justify-between rounded-xl border p-4 bg-muted/5">
                    <span className="text-sm font-bold text-muted-foreground lowercase">Helpful Karma</span>
                    <span className="text-[15px] font-black">{karma.breakdown.helpfulKarma}</span>
                  </div>
                  <div className="flex justify-between rounded-xl border p-4 bg-muted/5">
                    <span className="text-sm font-bold text-muted-foreground lowercase">Events Karma</span>
                    <span className="text-[15px] font-black">{karma.breakdown.eventsKarma}</span>
                  </div>
                  <div className="flex justify-between rounded-xl border p-4 bg-muted/5">
                    <span className="text-sm font-bold text-muted-foreground lowercase">Community Karma</span>
                    <span className="text-[15px] font-black">{karma.breakdown.communityKarma}</span>
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
