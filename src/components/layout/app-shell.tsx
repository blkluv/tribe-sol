"use client";

import Link from "next/link";
import { BottomNav } from "./bottom-nav";
import { SidebarNav } from "./sidebar-nav";
import { useAuth } from "@/hooks/use-auth";
import { useTribeStore } from "@/store/use-tribe-store";
import { Wallet, ExternalLink, Users } from "lucide-react";
import { formatNumber } from "@/lib/utils";

function RightSidebar() {
  const { isAuthenticated, profile, walletAddress } = useAuth();
  const { tribes, currentUser, joinTribe } = useTribeStore();

  const displayAddress = walletAddress
    ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
    : null;

  const suggestedTribes = tribes.filter((t) => !t.isJoined).slice(0, 3);

  return (
    <aside className="hidden lg:block w-[350px] p-8 space-y-8 sticky top-0 h-screen overflow-y-auto">
      {/* Wallet / Profile Info */}
      {isAuthenticated && profile ? (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
              {profile.username.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-0.5 min-w-0">
              <p className="text-sm font-bold truncate">{profile.username}</p>
              {displayAddress && (
                <p className="text-xs text-muted-foreground font-mono">
                  {displayAddress}
                </p>
              )}
            </div>
          </div>

          {profile.socialCounts && (
            <div className="flex gap-4 text-center">
              <div>
                <p className="text-sm font-black">{profile.socialCounts.followers}</p>
                <p className="text-[10px] text-muted-foreground">Followers</p>
              </div>
              <div>
                <p className="text-sm font-black">{profile.socialCounts.following}</p>
                <p className="text-[10px] text-muted-foreground">Following</p>
              </div>
              <div>
                <p className="text-sm font-black">{profile.socialCounts.posts}</p>
                <p className="text-[10px] text-muted-foreground">Posts</p>
              </div>
            </div>
          )}

          {walletAddress && (
            <div className="rounded-xl border p-3 space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Wallet className="h-3.5 w-3.5" />
                <span className="font-medium">Solana Devnet</span>
              </div>
              <p className="text-xs font-mono break-all text-muted-foreground">
                {walletAddress}
              </p>
              <a
                href={`https://explorer.solana.com/address/${walletAddress}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[11px] text-indigo-500 hover:underline"
              >
                View on Explorer
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
        </div>
      ) : currentUser ? (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg">
              {currentUser.displayName.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-0.5 min-w-0">
              <p className="text-sm font-bold truncate">{currentUser.displayName}</p>
              <p className="text-xs text-muted-foreground">@{currentUser.username}</p>
            </div>
          </div>
          <div className="flex gap-4 text-center">
            <div>
              <p className="text-sm font-black">1.2K</p>
              <p className="text-[10px] text-muted-foreground">Followers</p>
            </div>
            <div>
              <p className="text-sm font-black">340</p>
              <p className="text-[10px] text-muted-foreground">Following</p>
            </div>
            <div>
              <p className="text-sm font-black">42</p>
              <p className="text-[10px] text-muted-foreground">Posts</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
          <div className="space-y-1">
            <div className="h-4 w-24 rounded bg-muted animate-pulse" />
            <div className="h-3 w-32 rounded bg-muted animate-pulse" />
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-muted-foreground">Suggested Tribes</span>
          <Link href="/tribes" className="text-xs font-bold hover:opacity-70">See All</Link>
        </div>
        {suggestedTribes.map((tribe) => (
          <div key={tribe.id} className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full"
              style={{ backgroundColor: `${tribe.color}20`, color: tribe.color }}
            >
              <Users className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate">{tribe.name}</p>
              <p className="text-[10px] text-muted-foreground">{formatNumber(tribe.members)} members</p>
            </div>
            <button
              onClick={() => joinTribe(tribe.id)}
              className="text-xs font-bold text-blue-500 hover:text-blue-600 transition-colors"
            >
              Join
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNav />
      <div className="flex flex-1 justify-center">
        <main className="w-full max-w-[1000px] flex">
          <div className="flex-1 w-full max-w-[630px] border-x min-h-screen pb-20 md:pb-0 bg-background shadow-sm">
            {children}
          </div>
          <RightSidebar />
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
