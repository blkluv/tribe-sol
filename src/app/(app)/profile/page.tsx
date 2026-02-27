"use client";

import { useState } from "react";
import Image from "next/image";
import { Settings, MapPin, BadgeCheck, Star, Award, PlusCircle, Wallet, Heart, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useTribeStore } from "@/store/use-tribe-store";
import { useAuth } from "@/hooks/use-auth";
import { useTapestryProfile } from "@/hooks/use-tapestry-profile";
import { karmaLevelConfig, getKarmaProgress } from "@/lib/theme";
import { cn, formatNumber } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { useShare } from "@/hooks/use-share";
import * as tapestry from "@/lib/tapestry";

const tabs = ["Activity", "Badges", "Stats"];

function ActivityGrid() {
  const { casts } = useTribeStore();
  const userCasts = casts.filter((c) => c.imageUrl).slice(0, 9);

  if (userCasts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Award className="mb-3 h-10 w-10 text-muted-foreground/30" />
        <p className="text-sm font-medium text-muted-foreground">No posts yet</p>
        <p className="text-xs text-muted-foreground/70">Start sharing to see your activity here</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-[2px]">
      {userCasts.map((cast) => (
        <div key={cast.id} className="group relative aspect-square overflow-hidden bg-muted">
          <Image
            src={cast.imageUrl}
            alt={cast.caption}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 33vw, 200px"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex items-center gap-3 text-white text-sm font-semibold">
              <span className="flex items-center gap-1">
                <Heart className="h-4 w-4 fill-white" /> {cast.likes}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4 fill-white" /> {cast.comments.length}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProfilePage() {
  const { currentUser, updateCurrentUser } = useTribeStore();
  const { isAuthenticated, profile: tapestryProfile, walletAddress } = useAuth();
  const { profile: freshProfile } = useTapestryProfile(
    isAuthenticated ? tapestryProfile?.id : null
  );
  const { share, showToast } = useShare();
  const [activeTab, setActiveTab] = useState("Activity");
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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

  // Use fresh Tapestry profile data when available, fall back to cached, then mock
  const activeProfile = freshProfile || tapestryProfile;
  const socialCounts = isAuthenticated && activeProfile?.socialCounts
    ? activeProfile.socialCounts
    : { followers: 1200, following: 340, posts: 42 };

  const displayName = isAuthenticated && activeProfile
    ? activeProfile.username
    : currentUser.displayName;

  const displayBio = isAuthenticated && activeProfile?.bio
    ? activeProfile.bio
    : currentUser.bio;

  const displayAddress = walletAddress
    ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
    : null;

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b bg-background/95 px-4 py-3 backdrop-blur-md">
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
              <p className="text-[16px] font-black">{formatNumber(socialCounts.posts)}</p>
              <p className="text-[12px] text-muted-foreground font-medium">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-[16px] font-black">{formatNumber(socialCounts.followers)}</p>
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
          <h2 className="text-[14px] font-bold tracking-tight">{displayName}</h2>
          <p className="text-[14px] text-muted-foreground mb-1">@{currentUser.username}</p>
          {displayBio && (
            <p className="text-[14px] leading-snug mb-2 whitespace-pre-wrap">{displayBio}</p>
          )}
          <div className="flex items-center gap-3 text-[13px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              <span className="font-medium">{currentUser.location || "Earth"}</span>
            </div>
            {isAuthenticated && displayAddress && (
              <div className="flex items-center gap-1.5">
                <Wallet className="h-3.5 w-3.5" />
                <span className="font-mono text-[12px]">{displayAddress}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => {
              if (isEditing) {
                setIsEditing(false);
              } else {
                setEditName(currentUser.displayName);
                setEditBio(currentUser.bio || "");
                setEditLocation(currentUser.location || "");
                setIsEditing(true);
              }
            }}
            className={cn(
              "flex-1 rounded-lg py-2 text-[14px] font-bold transition-colors",
              isEditing ? "bg-muted text-muted-foreground" : "bg-muted/50 hover:bg-muted"
            )}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
          <button
            onClick={() => share(
              displayName || currentUser.username,
              displayBio || "",
              `${typeof window !== "undefined" ? window.location.origin : ""}/profile`
            )}
            className="flex-1 rounded-lg bg-muted/50 py-2 text-[14px] font-bold hover:bg-muted transition-colors"
          >
            Share Profile
          </button>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <div className="mb-8 space-y-3 rounded-2xl border bg-muted/10 p-4">
            <div>
              <label className="mb-1 block text-xs font-bold text-muted-foreground">Display Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-muted-foreground">Bio</label>
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-muted-foreground">Location</label>
              <input
                type="text"
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
                className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button
              disabled={isSaving || !editName.trim()}
              onClick={async () => {
                setIsSaving(true);
                updateCurrentUser({
                  displayName: editName.trim(),
                  bio: editBio.trim(),
                  location: editLocation.trim(),
                });
                if (isAuthenticated && tapestryProfile?.id) {
                  try {
                    await tapestry.updateProfile(tapestryProfile.id, {
                      username: editName.trim(),
                      bio: editBio.trim(),
                    });
                  } catch {
                    // Non-fatal
                  }
                }
                setIsSaving(false);
                setIsEditing(false);
              }}
              className="w-full rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}

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
            <ActivityGrid />
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

      {showToast && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background shadow-lg animate-in fade-in slide-in-from-bottom-4">
          Link copied!
        </div>
      )}
    </div>
  );
}
