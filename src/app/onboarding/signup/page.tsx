"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AtSign, FileText, ArrowRight, Wallet, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function SignUpPage() {
  const router = useRouter();
  const { walletAddress, createProfile, status, error } = useAuth();
  const [form, setForm] = useState({ username: "", bio: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username.trim()) return;

    await createProfile(form.username.trim(), form.bio.trim() || undefined);
  };

  // Redirect on successful profile creation
  if (status === "authenticated") {
    router.push("/home");
    return null;
  }

  const isCreating = status === "creating_profile";
  const isValid = form.username.trim().length >= 3;

  // Truncate wallet address for display
  const displayAddress = walletAddress
    ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
    : null;

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500 text-xl font-bold text-white">
          T
        </div>
        <h1 className="mb-2 text-2xl font-bold">Create Your Profile</h1>
        <p className="mb-8 text-muted-foreground">
          Set up your Tribe profile on Solana.
        </p>
      </motion.div>

      {/* Connected Wallet Display */}
      {displayAddress && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border bg-muted/30 p-3">
          <Wallet className="h-5 w-5 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Connected Wallet</p>
            <p className="text-sm font-mono font-medium">{displayAddress}</p>
          </div>
          <div className="h-2 w-2 rounded-full bg-green-500" />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <AtSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Username (min 3 characters)"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            disabled={isCreating}
            className="w-full rounded-xl border bg-background py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
          />
        </div>

        <div className="relative">
          <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <textarea
            placeholder="Bio (optional)"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            disabled={isCreating}
            rows={3}
            className="w-full rounded-xl border bg-background py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 resize-none"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={!isValid || isCreating}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-indigo-500 py-3.5 text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {isCreating ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Creating Profile...
            </>
          ) : (
            <>
              Create Profile
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <button
          onClick={() => router.push("/home")}
          className="font-medium text-indigo-500 hover:underline"
        >
          Go to Home
        </button>
      </p>
    </div>
  );
}
