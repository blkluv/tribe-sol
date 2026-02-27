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
          "flex items-center gap-3 rounded-[20px] bg-muted/60 px-5 py-3 text-sm transition-all hover:bg-muted active:scale-95",
          className
        )}
      >
        <div className="relative">
          <Wallet className="h-5 w-5 text-black" />
          <div className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
        </div>
        {!compact && (
          <span className="font-bold text-black tracking-tight">{displayAddress}</span>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={() => setVisible(true)}
      className={cn(
        "flex items-center gap-3 rounded-[20px] bg-primary px-5 py-3 text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-95 shadow-sm shadow-primary/20",
        className
      )}
    >
      <Wallet className="h-5 w-5" />
      {!compact && <span>Connect Wallet</span>}
    </button>
  );
}
