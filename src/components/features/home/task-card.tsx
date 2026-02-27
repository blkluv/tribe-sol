"use client";

import Image from "next/image";
import { MapPin, Users, Clock, AlertTriangle } from "lucide-react";
import type { Task } from "@/types";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <div className="border-b bg-background px-4 py-4">
      <div className="overflow-hidden rounded-2xl border">
        {task.imageUrl && (
          <div className="relative aspect-video">
            <Image
              src={task.imageUrl}
              alt={task.title}
              fill
              className="object-cover"
              sizes="600px"
            />
            {task.isUrgent && (
              <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-medium text-white">
                <AlertTriangle className="h-3 w-3" />
                Urgent
              </span>
            )}
          </div>
        )}
        <div className="p-4">
          <div className="mb-1 flex items-center gap-3">
            <div className="relative h-8 w-8 overflow-hidden rounded-full">
              <Image src={task.user.avatarUrl} alt="" fill className="object-cover" sizes="32px" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{task.user.displayName}</p>
            </div>
          </div>
          <h3 className="mb-1 text-base font-semibold">{task.title}</h3>
          <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
            {task.description}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {task.location}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {task.helpers} helpers
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {task.timeAgo}
            </span>
          </div>
          {task.reward && (
            <div className="mt-2 inline-block rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-600 dark:bg-green-500/10 dark:text-green-400">
              {task.reward}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
