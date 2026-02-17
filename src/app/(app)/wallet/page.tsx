"use client";

import { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Copy,
  Check,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function WalletPage() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const { isConnected, walletAddress, isAuthenticated, profile, logout } = useAuth();
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch real SOL balance
  useEffect(() => {
    if (!publicKey) {
      setBalance(null);
      return;
    }

    setIsLoadingBalance(true);
    connection
      .getBalance(publicKey)
      .then((lamports) => setBalance(lamports / LAMPORTS_PER_SOL))
      .catch(() => setBalance(null))
      .finally(() => setIsLoadingBalance(false));
  }, [publicKey, connection]);

  const handleCopy = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const displayAddress = walletAddress
    ? `${walletAddress.slice(0, 8)}...${walletAddress.slice(-8)}`
    : null;

  if (!isConnected) {
    return (
      <div>
        <div className="sticky top-0 z-40 border-b bg-background/80 px-4 py-3 backdrop-blur-lg">
          <h1 className="text-lg font-bold">Wallet</h1>
        </div>

        <div className="flex flex-col items-center justify-center px-4 py-20">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
            <Wallet className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="mb-2 text-lg font-bold">Connect Your Wallet</h2>
          <p className="mb-6 text-center text-sm text-muted-foreground">
            Connect a Solana wallet to view your balance and interact with the
            blockchain.
          </p>
          <button
            onClick={() => setVisible(true)}
            className="flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background"
          >
            <Wallet className="h-4 w-4" />
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="sticky top-0 z-40 border-b bg-background/80 px-4 py-3 backdrop-blur-lg">
        <h1 className="text-lg font-bold">Wallet</h1>
      </div>

      {/* Balance Card */}
      <div className="p-4">
        <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 p-6 text-white shadow-tribe-large">
          <p className="mb-1 text-sm text-white/70">SOL Balance</p>
          <p className="mb-4 text-3xl font-bold">
            {isLoadingBalance ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : balance !== null ? (
              `${balance.toFixed(4)} SOL`
            ) : (
              "—"
            )}
          </p>
          {isAuthenticated && profile && (
            <p className="text-sm text-white/70">
              @{profile.username}
            </p>
          )}
        </div>
      </div>

      {/* Wallet Address */}
      <div className="px-4 pb-4">
        <div className="rounded-xl border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Wallet Address
            </span>
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-600">
              Devnet
            </span>
          </div>

          <div className="flex items-center gap-2">
            <p className="flex-1 truncate font-mono text-sm">
              {displayAddress}
            </p>
            <button
              onClick={handleCopy}
              className="rounded-lg p-2 hover:bg-muted transition-colors"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </div>

          <div className="flex gap-2">
            <a
              href={`https://explorer.solana.com/address/${walletAddress}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Explorer
            </a>
            <button
              onClick={logout}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 px-4 pb-4">
        <div className="rounded-xl border p-3">
          <div className="flex items-center gap-2 text-green-600">
            <ArrowDownLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Network</span>
          </div>
          <p className="mt-1 text-lg font-bold">Devnet</p>
        </div>
        <div className="rounded-xl border p-3">
          <div className="flex items-center gap-2 text-indigo-500">
            <ArrowUpRight className="h-4 w-4" />
            <span className="text-sm font-medium">Status</span>
          </div>
          <p className="mt-1 text-lg font-bold">Connected</p>
        </div>
      </div>

      {/* Tapestry Profile */}
      {isAuthenticated && profile && (
        <div className="px-4 pb-4">
          <h2 className="mb-3 text-base font-semibold">Tapestry Profile</h2>
          <div className="rounded-xl border p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Username</span>
              <span className="text-sm font-medium">@{profile.username}</span>
            </div>
            {profile.bio && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Bio</span>
                <span className="text-sm font-medium truncate ml-4">
                  {profile.bio}
                </span>
              </div>
            )}
            {profile.socialCounts && (
              <>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Followers
                  </span>
                  <span className="text-sm font-bold">
                    {profile.socialCounts.followers}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Following
                  </span>
                  <span className="text-sm font-bold">
                    {profile.socialCounts.following}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Posts</span>
                  <span className="text-sm font-bold">
                    {profile.socialCounts.posts}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
