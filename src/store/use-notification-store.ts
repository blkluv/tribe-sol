"use client";

import { create } from "zustand";

export interface Notification {
  id: string;
  type: "like" | "comment" | "follow" | "event" | "channel" | "tip" | "join";
  user: string;
  avatar: string;
  message: string;
  time: string;
  isRead: boolean;
  href?: string;
}

const seedNotifications: Notification[] = [
  { id: "n1", type: "like", user: "Priya Mehta", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", message: "liked your post about Mumbai street food", time: "2m ago", isRead: false, href: "/home" },
  { id: "n2", type: "comment", user: "Emily Chen", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop", message: "commented: 'This is amazing! Would love to attend'", time: "5m ago", isRead: false, href: "/home" },
  { id: "n3", type: "follow", user: "Lisa Brown", avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop", message: "started following you", time: "12m ago", isRead: false, href: "/profile" },
  { id: "n4", type: "like", user: "Neha Sharma", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop", message: "and 23 others liked your community event post", time: "15m ago", isRead: false, href: "/home" },
  { id: "n5", type: "event", user: "James Wilson", avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop", message: "invited you to Thames Path Cleanup Event", time: "28m ago", isRead: false, href: "/explore" },
  { id: "n6", type: "channel", user: "Maria Garcia", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop", message: "added you to Central Park Music Lovers", time: "45m ago", isRead: true, href: "/tribes" },
  { id: "n7", type: "comment", user: "Rahul Verma", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop", message: "replied to your comment on Old Delhi food walk poll", time: "1h ago", isRead: true, href: "/home" },
  { id: "n8", type: "like", user: "Sophie Taylor", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop", message: "liked your yoga session photo", time: "1h ago", isRead: true, href: "/home" },
  { id: "n9", type: "follow", user: "Alex Rodriguez", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", message: "started following you", time: "2h ago", isRead: true, href: "/profile" },
  { id: "n10", type: "event", user: "David Kim", avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop", message: "is attending your community garden meetup", time: "2h ago", isRead: true, href: "/explore" },
];

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notif: Omit<Notification, "id" | "isRead" | "time"> & { href?: string }) => void;
  markAllRead: () => void;
  markRead: (id: string) => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: seedNotifications,
  unreadCount: seedNotifications.filter((n) => !n.isRead).length,

  addNotification: (notif) => {
    const newNotif: Notification = {
      ...notif,
      id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      isRead: false,
      time: "Just now",
    };
    set((state) => ({
      notifications: [newNotif, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),

  markRead: (id) =>
    set((state) => {
      const notif = state.notifications.find((n) => n.id === id);
      if (!notif || notif.isRead) return state;
      return {
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: state.unreadCount - 1,
      };
    }),
}));
