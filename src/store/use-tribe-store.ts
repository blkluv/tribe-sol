"use client";

import { create } from "zustand";
import type { City, Cast, Poll, Task, Crowdfund, Tribe, ExploreItem, User } from "@/types";
import { useAuthStore } from "./use-auth-store";
import { useNotificationStore } from "./use-notification-store";
import { useUIStore } from "./use-ui-store";

interface TribeStore {
  // State
  currentCity: City | null;
  casts: Cast[];
  events: ExploreItem[];
  polls: Poll[];
  tasks: Task[];
  crowdfunds: Crowdfund[];
  tribes: Tribe[];
  currentUser: User | null;
  isSwitchingCity: boolean;
  tapestryProfileId: string | null;

  // City actions
  setInitialData: (data: {
    city: City;
    user: User;
    casts: Cast[];
    events: ExploreItem[];
    polls: Poll[];
    tasks: Task[];
    crowdfunds: Crowdfund[];
    tribes: Tribe[];
  }) => void;
  switchCity: (
    city: City,
    data: {
      casts: Cast[];
      events: ExploreItem[];
      polls: Poll[];
      tasks: Task[];
      crowdfunds: Crowdfund[];
      tribes: Tribe[];
    }
  ) => void;

  // Cast actions
  likeCast: (castId: string) => void;
  bookmarkCast: (castId: string) => void;
  tipCast: (castId: string, amount: number) => void;
  addCast: (cast: Cast) => void;

  // Poll actions
  votePoll: (pollId: string, optionId: string) => void;
  addPoll: (poll: Poll) => void;

  // Task actions
  addTask: (task: Task) => void;

  // Crowdfund actions
  addCrowdfund: (crowdfund: Crowdfund) => void;

  // Tribe actions
  joinTribe: (tribeId: string) => void;
  leaveTribe: (tribeId: string) => void;
  addTribe: (tribe: Tribe) => void;

  // Event actions
  addEvent: (event: ExploreItem) => void;

  // User actions
  updateCurrentUser: (updates: Partial<User>) => void;

  // Tapestry bridge
  setTapestryProfileId: (id: string | null) => void;
}

export const useTribeStore = create<TribeStore>((set, get) => ({
  currentCity: null,
  casts: [],
  events: [],
  polls: [],
  tasks: [],
  crowdfunds: [],
  tribes: [],
  currentUser: null,
  isSwitchingCity: false,
  tapestryProfileId: null,

  setInitialData: (data) =>
    set({
      currentCity: data.city,
      currentUser: data.user,
      casts: data.casts,
      events: data.events,
      polls: data.polls,
      tasks: data.tasks,
      crowdfunds: data.crowdfunds,
      tribes: data.tribes,
    }),

  switchCity: (city, data) => {
    set({ isSwitchingCity: true });
    setTimeout(() => {
      set({
        currentCity: city,
        casts: data.casts,
        events: data.events,
        polls: data.polls,
        tasks: data.tasks,
        crowdfunds: data.crowdfunds,
        tribes: data.tribes,
      });
      setTimeout(() => {
        set({ isSwitchingCity: false });
      }, 800);
    }, 400);
  },

  likeCast: (castId) => {
    // Optimistic local update only — Tapestry sync handled by useLike hook
    const cast = get().casts.find((c) => c.id === castId);
    const wasLiked = cast?.isLiked;
    set((state) => ({
      casts: state.casts.map((c) =>
        c.id === castId
          ? { ...c, isLiked: !c.isLiked, likes: c.isLiked ? c.likes - 1 : c.likes + 1 }
          : c
      ),
    }));

    // Push notification for likes on others' posts
    if (cast && !wasLiked) {
      const currentUser = get().currentUser;
      if (currentUser && cast.user.id !== currentUser.id) {
        useNotificationStore.getState().addNotification({
          type: "like",
          user: cast.user.displayName,
          avatar: cast.user.avatarUrl,
          message: `Your post "${cast.caption.slice(0, 40)}..." got a new like`,
          href: "/home",
        });
      }
    }
  },

  bookmarkCast: (castId) =>
    set((state) => ({
      casts: state.casts.map((c) =>
        c.id === castId ? { ...c, isSaved: !c.isSaved } : c
      ),
    })),

  tipCast: (castId, amount) => {
    const cast = get().casts.find((c) => c.id === castId);
    set((state) => ({
      casts: state.casts.map((c) =>
        c.id === castId
          ? { ...c, tipCount: c.tipCount + 1, totalTips: c.totalTips + amount }
          : c
      ),
    }));
    if (cast) {
      useNotificationStore.getState().addNotification({
        type: "tip",
        user: cast.user.displayName,
        avatar: cast.user.avatarUrl,
        message: `received a ${amount} SOL tip on "${cast.caption.slice(0, 30)}..."`,
        href: "/wallet",
      });
    }
  },

  addCast: (cast) => {
    set((state) => ({ casts: [cast, ...state.casts] }));

    // Sync to Tapestry via findOrCreate
    const authState = useAuthStore.getState();
    const profileId = authState.tapestryProfile?.id;
    if (profileId) {
      const city = get().currentCity;
      fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: cast.id,
          profileId,
          properties: [
            { key: "type", value: "cast" },
            { key: "caption", value: cast.caption },
            ...(cast.imageUrl ? [{ key: "imageUrl", value: cast.imageUrl }] : []),
            ...(city ? [{ key: "cityId", value: city.id }] : []),
          ],
        }),
      })
        .then((res) => {
          if (!res.ok) throw new Error(`API ${res.status}`);
          return res.json();
        })
        .then((data) => {
          const contentId = data?.id;
          if (contentId) {
            set((state) => ({
              casts: state.casts.map((c) =>
                c.id === cast.id ? { ...c, tapestryContentId: contentId } : c
              ),
            }));
          }
          useUIStore.getState().showToast("Post synced to Tapestry");
        })
        .catch(() => {
          useUIStore.getState().showToast("Failed to sync post to Tapestry");
        });
    }
  },

  votePoll: (pollId, optionId) =>
    set((state) => ({
      polls: state.polls.map((p) =>
        p.id === pollId
          ? {
              ...p,
              userVote: optionId,
              votes: { ...p.votes, [optionId]: (p.votes[optionId] || 0) + 1 },
            }
          : p
      ),
    })),

  addPoll: (poll) => {
    set((state) => ({ polls: [poll, ...state.polls] }));

    const authState = useAuthStore.getState();
    const profileId = authState.tapestryProfile?.id;
    if (profileId) {
      fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: `poll-${poll.id}`,
          profileId,
          properties: [
            { key: "type", value: "poll" },
            { key: "question", value: poll.question },
            { key: "options", value: JSON.stringify(poll.options) },
          ],
        }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed");
          return res.json();
        })
        .then((content) => {
          set((state) => ({
            polls: state.polls.map((p) =>
              p.id === poll.id ? { ...p, tapestryContentId: content.id } : p
            ),
          }));
        })
        .catch(() => {});
    }
  },

  addTask: (task) => {
    set((state) => ({ tasks: [task, ...state.tasks] }));

    const authState = useAuthStore.getState();
    const profileId = authState.tapestryProfile?.id;
    if (profileId) {
      fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: `task-${task.id}`,
          profileId,
          properties: [
            { key: "type", value: "task" },
            { key: "title", value: task.title },
            { key: "description", value: task.description },
            { key: "location", value: task.location },
          ],
        }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed");
          return res.json();
        })
        .then((content) => {
          set((state) => ({
            tasks: state.tasks.map((t) =>
              t.id === task.id ? { ...t, tapestryContentId: content.id } : t
            ),
          }));
        })
        .catch(() => {});
    }
  },

  addCrowdfund: (crowdfund) => {
    set((state) => ({ crowdfunds: [crowdfund, ...state.crowdfunds] }));

    const authState = useAuthStore.getState();
    const profileId = authState.tapestryProfile?.id;
    if (profileId) {
      fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: `crowdfund-${crowdfund.id}`,
          profileId,
          properties: [
            { key: "type", value: "crowdfund" },
            { key: "title", value: crowdfund.title },
            { key: "description", value: crowdfund.description },
            { key: "goal", value: String(crowdfund.goal) },
          ],
        }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed");
          return res.json();
        })
        .then((content) => {
          set((state) => ({
            crowdfunds: state.crowdfunds.map((cf) =>
              cf.id === crowdfund.id ? { ...cf, tapestryContentId: content.id } : cf
            ),
          }));
        })
        .catch(() => {});
    }
  },

  joinTribe: (tribeId) => {
    const tribe = get().tribes.find((t) => t.id === tribeId);
    set((state) => ({
      tribes: state.tribes.map((t) =>
        t.id === tribeId ? { ...t, isJoined: true } : t
      ),
    }));
    if (tribe) {
      useNotificationStore.getState().addNotification({
        type: "join",
        user: tribe.name,
        avatar: tribe.imageUrl || "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=100&h=100&fit=crop",
        message: `You joined ${tribe.name}`,
        href: `/tribes/${tribeId}`,
      });
    }
  },

  leaveTribe: (tribeId) =>
    set((state) => ({
      tribes: state.tribes.map((t) =>
        t.id === tribeId ? { ...t, isJoined: false } : t
      ),
    })),

  addTribe: (tribe) =>
    set((state) => ({ tribes: [tribe, ...state.tribes] })),

  addEvent: (event) => {
    set((state) => ({ events: [event, ...state.events] }));

    const authState = useAuthStore.getState();
    const profileId = authState.tapestryProfile?.id;
    if (profileId) {
      fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: `event-${event.id}`,
          profileId,
          properties: [
            { key: "type", value: "event" },
            { key: "title", value: event.title },
            { key: "description", value: event.description },
            { key: "location", value: event.location },
            { key: "cityId", value: event.cityId },
          ],
        }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed");
          return res.json();
        })
        .then((content) => {
          set((state) => ({
            events: state.events.map((e) =>
              e.id === event.id ? { ...e, tapestryContentId: content.id } : e
            ),
          }));
        })
        .catch(() => {});
    }
  },

  updateCurrentUser: (updates) =>
    set((state) => ({
      currentUser: state.currentUser ? { ...state.currentUser, ...updates } : null,
    })),

  setTapestryProfileId: (id) => set({ tapestryProfileId: id }),
}));
