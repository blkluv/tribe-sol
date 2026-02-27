"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, MessageCircle, UserPlus, Calendar, Hash, Coins, Users, CheckCircle } from "lucide-react";
import { useNotificationStore } from "@/store/use-notification-store";

const iconMap: Record<string, React.ElementType> = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
  event: Calendar,
  channel: Hash,
  tip: Coins,
  join: Users,
};

const colorMap: Record<string, string> = {
  like: "text-pink-500 bg-pink-100 dark:bg-pink-500/10",
  comment: "text-blue-500 bg-blue-100 dark:bg-blue-500/10",
  follow: "text-indigo-500 bg-indigo-100 dark:bg-indigo-500/10",
  event: "text-green-500 bg-green-100 dark:bg-green-500/10",
  channel: "text-cyan-500 bg-cyan-100 dark:bg-cyan-500/10",
  tip: "text-amber-500 bg-amber-100 dark:bg-amber-500/10",
  join: "text-violet-500 bg-violet-100 dark:bg-violet-500/10",
};

export default function NotificationsPage() {
  const router = useRouter();
  const { notifications, unreadCount, markAllRead, markRead } = useNotificationStore();

  const handleNotifClick = (id: string, href?: string) => {
    markRead(id);
    if (href) {
      router.push(href);
    }
  };

  return (
    <div>
      <div className="sticky top-0 z-40 flex items-center justify-between border-b bg-background/80 px-4 py-3 backdrop-blur-lg">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <span className="rounded-full bg-indigo-500 px-2 py-0.5 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1 text-xs font-medium text-indigo-500 hover:text-indigo-600 transition-colors"
          >
            <CheckCircle className="h-3.5 w-3.5" />
            Mark all read
          </button>
        )}
      </div>

      <div>
        {notifications.map((notif) => {
          const Icon = iconMap[notif.type] || Heart;
          const colorClass = colorMap[notif.type] || colorMap.like;

          return (
            <button
              key={notif.id}
              onClick={() => handleNotifClick(notif.id, notif.href)}
              className={`flex w-full items-start gap-3 border-b px-4 py-3 text-left transition-colors hover:bg-muted/30 ${
                !notif.isRead ? "bg-indigo-50/50 dark:bg-indigo-500/5" : ""
              }`}
            >
              <div className="relative">
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image src={notif.avatar} alt="" fill className="object-cover" sizes="40px" />
                </div>
                <div className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full ${colorClass}`}>
                  <Icon className="h-3 w-3" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-semibold">{notif.user}</span>{" "}
                  {notif.message}
                </p>
                <p className="text-xs text-muted-foreground">{notif.time}</p>
              </div>
              {!notif.isRead && (
                <div className="mt-2 h-2 w-2 flex-none rounded-full bg-indigo-500" />
              )}
            </button>
          );
        })}
      </div>

      {notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-sm font-bold text-muted-foreground">No notifications yet</p>
          <p className="text-xs text-muted-foreground/70">Interactions will show up here</p>
        </div>
      )}
    </div>
  );
}
