"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import type { Poll } from "@/types";
import { cn } from "@/lib/utils";
import { useTribeStore } from "@/store/use-tribe-store";

interface PollCardProps {
  poll: Poll;
}

export function PollCard({ poll }: PollCardProps) {
  const { votePoll } = useTribeStore();
  const totalVotes = Object.values(poll.votes).reduce((a, b) => a + b, 0);
  const hasVoted = !!poll.userVote;

  return (
    <div className="border-b bg-background px-4 py-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="relative h-10 w-10 overflow-hidden rounded-full">
          <Image
            src={poll.user.avatarUrl}
            alt={poll.user.displayName}
            fill
            className="object-cover"
            sizes="40px"
          />
        </div>
        <div className="flex-1">
          <span className="text-sm font-semibold">{poll.user.displayName}</span>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <BarChart3 className="h-3 w-3" />
            <span>Poll &middot; {poll.timestamp}</span>
          </div>
        </div>
      </div>

      <p className="mb-3 text-sm font-semibold">{poll.question}</p>

      {poll.imageUrl && (
        <div className="relative mb-3 aspect-video overflow-hidden rounded-xl">
          <Image src={poll.imageUrl} alt="" fill className="object-cover" sizes="600px" />
        </div>
      )}

      <div className="space-y-2">
        {poll.options.map((opt) => {
          const votes = poll.votes[opt.id] || 0;
          const pct = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
          const isSelected = poll.userVote === opt.id;

          return (
            <motion.button
              key={opt.id}
              whileTap={{ scale: 0.98 }}
              disabled={hasVoted}
              onClick={() => votePoll(poll.id, opt.id)}
              className={cn(
                "relative w-full overflow-hidden rounded-xl border px-4 py-3 text-left text-sm transition-all",
                isSelected
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10"
                  : "hover:bg-muted"
              )}
            >
              {hasVoted && (
                <div
                  className="absolute inset-y-0 left-0 bg-indigo-500/10 transition-all"
                  style={{ width: `${pct}%` }}
                />
              )}
              <div className="relative flex items-center justify-between">
                <span className={cn(isSelected && "font-medium")}>{opt.text}</span>
                {hasVoted && (
                  <span className="text-xs text-muted-foreground">{Math.round(pct)}%</span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        {totalVotes} votes &middot; {poll.duration} days left
      </p>
    </div>
  );
}
