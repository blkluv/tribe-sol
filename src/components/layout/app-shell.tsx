"use client";

import { BottomNav } from "./bottom-nav";
import { SidebarNav } from "./sidebar-nav";
import { useAuth } from "@/hooks/use-auth";
import { Wallet, ExternalLink } from "lucide-react";

function RightSidebar() {
  const { isAuthenticated, profile, walletAddress } = useAuth();

  const displayAddress = walletAddress
    ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
    : null;

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
          <button className="text-xs font-bold hover:opacity-70">See All</button>
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            <div className="flex-1 space-y-1">
              <div className="h-3 w-20 rounded bg-muted animate-pulse" />
              <div className="h-2 w-24 rounded bg-muted animate-pulse" />
            </div>
            <button className="text-xs font-bold text-blue-500">Follow</button>
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
          <div className="flex-1 w-full max-w-[630px] border-x min-h-screen pb-20 md:pb-0 bg-white shadow-sm">
            {children}
          </div>
          <RightSidebar />
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
