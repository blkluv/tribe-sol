"use client";

import Image from "next/image";
import { MapPin, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { Crowdfund } from "@/types";
import { formatNumber } from "@/lib/utils";

interface CrowdfundCardProps {
  crowdfund: Crowdfund;
}

export function CrowdfundCard({ crowdfund }: CrowdfundCardProps) {
  const progress = Math.min((crowdfund.raised / crowdfund.goal) * 100, 100);

  return (
    <div className="border-b bg-background px-4 py-4">
      <div className="overflow-hidden rounded-2xl border">
        {crowdfund.imageUrl && (
          <div className="relative aspect-video">
            <Image
              src={crowdfund.imageUrl}
              alt={crowdfund.title}
              fill
              className="object-cover"
              sizes="600px"
            />
          </div>
        )}
        <div className="p-4">
          <div className="mb-2 flex items-center gap-3">
            <div className="relative h-8 w-8 overflow-hidden rounded-full">
              <Image src={crowdfund.user.avatarUrl} alt="" fill className="object-cover" sizes="32px" />
            </div>
            <span className="text-xs text-muted-foreground">{crowdfund.user.displayName}</span>
          </div>
          <h3 className="mb-1 text-base font-semibold">{crowdfund.title}</h3>
          <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
            {crowdfund.description}
          </p>

          <div className="mb-2">
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-semibold text-green-600">
                ₹{formatNumber(crowdfund.raised)}
              </span>
              <span className="text-muted-foreground">
                of ₹{formatNumber(crowdfund.goal)}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {crowdfund.contributors} contributors
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {crowdfund.location}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
