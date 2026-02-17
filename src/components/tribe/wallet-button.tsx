"use client";

import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Wallet } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

interface WalletButtonProps {
  className?: string;
  compact?: boolean;
}

export function WalletButton({ className, compact }: WalletButtonProps) {
  const { setVisible } = useWalletModal();
  const { isConnected, walletAddress, logout } = useAuth();

  const displayAddress = walletAddress
    ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
    : null;

  if (isConnected && displayAddress) {
    return (
      <button
        onClick={logout}
        className={cn(
          "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-muted",
          className
        )}
      >
        <div className="relative">
          <Wallet className="h-4 w-4" />
          <div className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-green-500" />
        </div>
        {!compact && (
          <span className="font-mono text-xs">{displayAddress}</span>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={() => setVisible(true)}
      className={cn(
        "flex items-center gap-2 rounded-xl bg-foreground px-3 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90",
        className
      )}
    >
      <Wallet className="h-4 w-4" />
      {!compact && <span>Connect</span>}
    </button>
  );
}
