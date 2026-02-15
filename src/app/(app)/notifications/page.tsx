"use client";

import Image from "next/image";
import { Heart, MessageCircle, UserPlus, Calendar, Hash } from "lucide-react";

const notifications = [
  { id: "n1", type: "like", user: "Priya Mehta", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", message: "liked your post about Mumbai street food", time: "2m ago", isRead: false },
  { id: "n2", type: "comment", user: "Emily Chen", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop", message: "commented: 'This is amazing! Would love to attend'", time: "5m ago", isRead: false },
  { id: "n3", type: "follow", user: "Lisa Brown", avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop", message: "started following you", time: "12m ago", isRead: false },
  { id: "n4", type: "like", user: "Neha Sharma", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop", message: "and 23 others liked your community event post", time: "15m ago", isRead: false },
  { id: "n5", type: "event", user: "James Wilson", avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop", message: "invited you to Thames Path Cleanup Event", time: "28m ago", isRead: false },
  { id: "n6", type: "channel", user: "Maria Garcia", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop", message: "added you to Central Park Music Lovers", time: "45m ago", isRead: true },
  { id: "n7", type: "comment", user: "Rahul Verma", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop", message: "replied to your comment on Old Delhi food walk poll", time: "1h ago", isRead: true },
  { id: "n8", type: "like", user: "Sophie Taylor", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop", message: "liked your yoga session photo", time: "1h ago", isRead: true },
  { id: "n9", type: "follow", user: "Alex Rodriguez", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", message: "started following you", time: "2h ago", isRead: true },
  { id: "n10", type: "event", user: "David Kim", avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop", message: "is attending your community garden meetup", time: "2h ago", isRead: true },
];

const iconMap = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
  event: Calendar,
  channel: Hash,
};

const colorMap = {
  like: "text-pink-500 bg-pink-100 dark:bg-pink-500/10",
  comment: "text-blue-500 bg-blue-100 dark:bg-blue-500/10",
  follow: "text-indigo-500 bg-indigo-100 dark:bg-indigo-500/10",
  event: "text-green-500 bg-green-100 dark:bg-green-500/10",
  channel: "text-cyan-500 bg-cyan-100 dark:bg-cyan-500/10",
};

export default function NotificationsPage() {
  return (
    <div>
      <div className="sticky top-0 z-40 border-b bg-background/80 px-4 py-3 backdrop-blur-lg">
        <h1 className="text-lg font-bold">Notifications</h1>
      </div>

      <div>
        {notifications.map((notif) => {
          const Icon = iconMap[notif.type as keyof typeof iconMap] || Heart;
          const colorClass = colorMap[notif.type as keyof typeof colorMap] || colorMap.like;

          return (
            <div
              key={notif.id}
              className={`flex items-start gap-3 border-b px-4 py-3 ${
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
                <div className="mt-2 h-2 w-2 rounded-full bg-indigo-500" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
