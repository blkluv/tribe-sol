"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Coins } from "lucide-react";
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
  onTip: (amount: number) => void;
  className?: string;
}

const presetAmounts = [
  { value: 10, label: "10" },
  { value: 25, label: "25" },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
];

export function TipButton({
  tipCount = 0,
  onTip,
  className,
}: TipButtonProps) {
  const [open, setOpen] = React.useState(false);

  const handleTip = (amount: number) => {
    onTip(amount);
    setOpen(false);
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
              Choose an amount to tip this creator
            </SheetDescription>
          </SheetHeader>
          <div className="grid grid-cols-4 gap-3 p-4">
            {presetAmounts.map((amount) => (
              <motion.button
                key={amount.value}
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => handleTip(amount.value)}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl border-2 border-muted p-4",
                  "hover:border-amber-400 hover:bg-amber-50",
                  "dark:hover:border-amber-600 dark:hover:bg-amber-950",
                  "transition-colors"
                )}
              >
                <Coins className="size-5 text-amber-500" />
                <span className="text-sm font-bold">
                  <span className="text-muted-foreground">&#8377;</span>
                  {amount.label}
                </span>
              </motion.button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
