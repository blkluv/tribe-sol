"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { motion } from "framer-motion";
import { Wallet, ArrowRight, Shield } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function ConnectWalletPage() {
  const router = useRouter();
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();
  const { isAuthenticated } = useAuth();

  // Auto-redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/home");
    }
  }, [isAuthenticated, router]);

  // Auto-redirect to city selection when wallet connects
  useEffect(() => {
    if (connected && !isAuthenticated) {
      router.push("/onboarding/city");
    }
  }, [connected, isAuthenticated, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center"
      >
        <div className="mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg">
          <Wallet className="h-14 w-14 text-white" />
        </div>

        <h1 className="mb-3 text-2xl font-bold">Connect Your Wallet</h1>
        <p className="mb-8 text-muted-foreground">
          Connect a Solana wallet to get started. Your wallet is your identity on
          Tribe.
        </p>

        <button
          onClick={() => setVisible(true)}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-base font-semibold text-background transition-opacity hover:opacity-90"
        >
          Connect Wallet
          <ArrowRight className="h-5 w-5" />
        </button>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>We never access your funds or private keys</span>
        </div>

        <button
          onClick={() => router.push("/onboarding/city")}
          className="mt-4 py-2 text-sm text-muted-foreground hover:text-foreground"
        >
          Skip for now
        </button>
      </motion.div>
    </div>
  );
}
