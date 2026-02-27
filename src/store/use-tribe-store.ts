"use client";

import { create } from "zustand";
import type { City, Cast, Poll, Task, Crowdfund, Tribe, ExploreItem, User } from "@/types";
import * as tapestry from "@/lib/tapestry";
import { useAuthStore } from "./use-auth-store";
import { useNotificationStore } from "./use-notification-store";

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
    // Optimistic local update
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
        });
      }
    }

    // Async Tapestry bridge
    const authState = useAuthStore.getState();
    const profileId = authState.tapestryProfile?.id;
    if (profileId) {
      const cast = get().casts.find((c) => c.id === castId);
      if (cast) {
        if (cast.isLiked) {
          // It was just liked (toggled from not liked)
          tapestry.likeContent(profileId, castId).catch(() => {
            // Rollback on failure
            set((state) => ({
              casts: state.casts.map((c) =>
                c.id === castId
                  ? { ...c, isLiked: false, likes: c.likes - 1 }
                  : c
              ),
            }));
          });
        } else {
          tapestry.unlikeContent(profileId, castId).catch(() => {
            set((state) => ({
              casts: state.casts.map((c) =>
                c.id === castId
                  ? { ...c, isLiked: true, likes: c.likes + 1 }
                  : c
              ),
            }));
          });
        }
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
      });
    }
  },

  addCast: (cast) => {
    set((state) => ({ casts: [cast, ...state.casts] }));

    // Async Tapestry bridge
    const authState = useAuthStore.getState();
    const profileId = authState.tapestryProfile?.id;
    if (profileId) {
      const city = get().currentCity;
      tapestry
        .createContent(profileId, [
          { key: "type", value: "cast" },
          { key: "caption", value: cast.caption },
          { key: "imageUrl", value: cast.imageUrl },
          ...(city ? [{ key: "cityId", value: city.id }] : []),
        ])
        .catch(() => {
          console.warn("Failed to persist cast to Tapestry");
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

  addPoll: (poll) =>
    set((state) => ({ polls: [poll, ...state.polls] })),

  addTask: (task) =>
    set((state) => ({ tasks: [task, ...state.tasks] })),

  addCrowdfund: (crowdfund) =>
    set((state) => ({ crowdfunds: [crowdfund, ...state.crowdfunds] })),

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

  addEvent: (event) =>
    set((state) => ({ events: [event, ...state.events] })),

  setTapestryProfileId: (id) => set({ tapestryProfileId: id }),
}));
