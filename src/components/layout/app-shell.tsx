"use client";

import Link from "next/link";
import { BottomNav } from "./bottom-nav";
import { SidebarNav } from "./sidebar-nav";
import { useAuth } from "@/hooks/use-auth";
import { useTribeStore } from "@/store/use-tribe-store";
import { Wallet, ExternalLink, Users } from "lucide-react";
import { formatNumber } from "@/lib/utils";

import { WalletButton } from "@/components/tribe/wallet-button";

function RightSidebar() {
  const { isAuthenticated, profile, walletAddress } = useAuth();
  const { tribes, currentUser, joinTribe } = useTribeStore();

  const displayAddress = walletAddress
    ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
    : null;

  const suggestedTribes = tribes.filter((t) => !t.isJoined).slice(0, 3);

  return (
    <aside className="hidden lg:block w-[350px] p-10 space-y-10 sticky top-0 h-screen overflow-y-auto bg-white border-l border-[#f0f0f0]">
      {/* Wallet / Profile Info */}
      <div className="space-y-6">
        {isAuthenticated && profile ? (
          <div className="space-y-6">
            <div className="flex items-center gap-5">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-black font-bold text-2xl">
                {profile.username.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-0.5 min-w-0">
                <p className="text-lg font-bold truncate leading-none">{profile.username}</p>
                {displayAddress && (
                  <p className="text-xs text-muted-foreground font-mono mt-1">
                    {displayAddress}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-6">
              <div>
                <p className="text-lg font-bold">{profile.socialCounts?.followers || 0}</p>
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Followers</p>
              </div>
              <div>
                <p className="text-lg font-bold">{profile.socialCounts?.following || 0}</p>
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Following</p>
              </div>
            </div>

            {walletAddress && (
              <div className="rounded-[24px] bg-muted/50 p-5 space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  <Wallet className="h-3.5 w-3.5" />
                  <span>Solana Devnet</span>
                </div>
                <p className="text-xs font-mono break-all text-black/60">
                  {walletAddress}
                </p>
                <a
                  href={`https://explorer.solana.com/address/${walletAddress}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
                >
                  View on Explorer
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>
        ) : currentUser ? (
          <div className="space-y-6">
            <div className="flex items-center gap-5">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-black font-bold text-2xl">
                {currentUser.displayName.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-0.5 min-w-0">
                <p className="text-lg font-bold truncate leading-none">{currentUser.displayName}</p>
                <p className="text-xs text-muted-foreground mt-1">@{currentUser.username}</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div>
                <p className="text-lg font-bold">1.2K</p>
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Followers</p>
              </div>
              <div>
                <p className="text-lg font-bold">340</p>
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Following</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-5 py-2">
            <div className="h-16 w-16 rounded-full bg-muted animate-pulse" />
            <div className="space-y-2">
              <div className="h-5 w-24 rounded bg-muted animate-pulse" />
              <div className="h-4 w-32 rounded bg-muted animate-pulse" />
            </div>
          </div>
        )}

        <WalletButton className="w-full h-14" />
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Suggested Tribes</span>
          <Link href="/tribes" className="text-xs font-bold text-primary hover:opacity-70">See All</Link>
        </div>
        <div className="space-y-4">
          {suggestedTribes.map((tribe) => (
            <div key={tribe.id} className="flex items-center gap-4">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: `${tribe.color}15`, color: tribe.color }}
              >
                <Users className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{tribe.name}</p>
                <p className="text-[11px] font-medium text-muted-foreground">{formatNumber(tribe.members)} members</p>
              </div>
              <button
                onClick={() => joinTribe(tribe.id)}
                className="text-xs font-bold text-primary hover:opacity-80 transition-opacity"
              >
                Join
              </button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex flex-1 justify-center">
        <main className="w-full max-w-[800px] flex px-4">
          <div className="flex-1 w-full min-h-screen pb-32 pt-6 bg-white">
            {children}
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
