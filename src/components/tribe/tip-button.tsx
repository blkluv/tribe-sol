"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, Loader2, Check, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

export interface TipButtonProps {
  tipCount?: number;
  onTip: (amount: number) => Promise<{ success: boolean; signature?: string }>;
  isWalletReady: boolean;
  className?: string;
}

const presetAmounts = [
  { value: 0.01, label: "0.01" },
  { value: 0.05, label: "0.05" },
  { value: 0.1, label: "0.1" },
  { value: 0.5, label: "0.5" },
];

export function TipButton({
  tipCount = 0,
  onTip,
  isWalletReady,
  className,
}: TipButtonProps) {
  const [open, setOpen] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);
  const [result, setResult] = React.useState<{
    success: boolean;
    signature?: string;
  } | null>(null);

  const handleTip = async (amount: number) => {
    setIsSending(true);
    setResult(null);
    const res = await onTip(amount);
    setResult(res);
    setIsSending(false);
    if (res.success) {
      setTimeout(() => {
        setOpen(false);
        setResult(null);
      }, 2500);
    }
  };

  return (
    <>
      <motion.button
        type="button"
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium",
          "bg-amber-50 text-amber-600 hover:bg-amber-100",
          "dark:bg-amber-950 dark:text-amber-400 dark:hover:bg-amber-900",
          "transition-colors",
          className
        )}
      >
        <Coins className="size-3.5" />
        <span>Tip</span>
        {tipCount > 0 && (
          <span className="text-amber-500 font-bold">{tipCount}</span>
        )}
      </motion.button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>Send a Tip</SheetTitle>
            <SheetDescription>
              {isWalletReady
                ? "Choose an amount to tip this creator (SOL on Devnet)"
                : "Connect your wallet to send tips"}
            </SheetDescription>
          </SheetHeader>

          <AnimatePresence mode="wait">
            {result?.success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3 p-8"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-500/10">
                  <Check className="h-7 w-7 text-green-600" />
                </div>
                <p className="text-sm font-bold text-green-600">
                  Tip sent successfully!
                </p>
                {result.signature && (
                  <a
                    href={`https://explorer.solana.com/tx/${result.signature}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    View on Explorer
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="amounts"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-4 gap-3 p-4"
              >
                {presetAmounts.map((amount) => (
                  <motion.button
                    key={amount.value}
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    disabled={!isWalletReady || isSending}
                    onClick={() => handleTip(amount.value)}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-xl border-2 border-muted p-4",
                      "hover:border-amber-400 hover:bg-amber-50",
                      "dark:hover:border-amber-600 dark:hover:bg-amber-950",
                      "transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    )}
                  >
                    {isSending ? (
                      <Loader2 className="size-5 animate-spin text-amber-500" />
                    ) : (
                      <Coins className="size-5 text-amber-500" />
                    )}
                    <span className="text-sm font-bold">
                      {amount.label}
                      <span className="text-muted-foreground ml-0.5 text-[10px]">
                        SOL
                      </span>
                    </span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {result && !result.success && (
            <p className="px-4 pb-4 text-center text-xs text-red-500">
              Transaction failed. Make sure you have enough SOL on Devnet.
            </p>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
