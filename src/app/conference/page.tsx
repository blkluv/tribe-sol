"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Users,
  Mic,
  Building2,
  Network,
  User,
  ArrowLeft,
} from "lucide-react";

const tabs = [
  { id: "schedule", label: "Schedule", icon: Calendar },
  { id: "speakers", label: "Speakers", icon: Mic },
  { id: "venues", label: "Venues", icon: Building2 },
  { id: "networking", label: "Network", icon: Network },
  { id: "profile", label: "Profile", icon: User },
];

const mockEvents = [
  { id: "ce1", title: "Opening Keynote: The Future of Ethereum", time: "9:00 AM - 10:00 AM", track: "Main Stage", speaker: "Vitalik Buterin", isKeynote: true },
  { id: "ce2", title: "Zero Knowledge Proofs Workshop", time: "10:30 AM - 12:00 PM", track: "ZK Track", speaker: "Anna Rose" },
  { id: "ce3", title: "DeFi: The Next Chapter", time: "1:00 PM - 2:00 PM", track: "DeFi Track", speaker: "Hayden Adams" },
  { id: "ce4", title: "Building on Layer 2", time: "2:30 PM - 3:30 PM", track: "Scaling Track", speaker: "Karl Floersch" },
  { id: "ce5", title: "Community Building in Web3", time: "4:00 PM - 5:00 PM", track: "Community Track", speaker: "Community Panel" },
];

const mockSpeakers = [
  { id: "s1", name: "Vitalik Buterin", title: "Co-founder", company: "Ethereum", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" },
  { id: "s2", name: "Anna Rose", title: "Host", company: "Zero Knowledge Podcast", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
  { id: "s3", name: "Hayden Adams", title: "Founder", company: "Uniswap", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop" },
  { id: "s4", name: "Karl Floersch", title: "CEO", company: "Optimism", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
];

export default function ConferencePage() {
  const [activeTab, setActiveTab] = useState("schedule");

  return (
    <div>
      {/* Hero */}
      <div className="relative h-48 bg-gradient-to-br from-violet-600 to-indigo-600">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative flex h-full flex-col justify-end p-4 text-white">
          <Link href="/home" className="absolute left-4 top-4 rounded-full bg-white/20 p-2 backdrop-blur-sm">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold">Devconnect</h1>
          <p className="text-sm text-white/80">A week of independent Ethereum events</p>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-white/70">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Nov 12-19, 2024
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              Istanbul, Turkey
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              12,500 attendees
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-b-2 border-violet-500 text-violet-600"
                  : "text-muted-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === "schedule" && (
          <div className="space-y-3">
            <h2 className="text-base font-semibold">Day 1 - Monday, Nov 12</h2>
            {mockEvents.map((event) => (
              <div
                key={event.id}
                className={`rounded-xl border p-4 ${
                  event.isKeynote ? "border-violet-200 bg-violet-50 dark:border-violet-500/20 dark:bg-violet-500/5" : ""
                }`}
              >
                {event.isKeynote && (
                  <span className="mb-2 inline-block rounded-full bg-violet-500 px-2 py-0.5 text-xs text-white">
                    Keynote
                  </span>
                )}
                <h3 className="text-sm font-semibold">{event.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {event.time} &middot; {event.track}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{event.speaker}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "speakers" && (
          <div className="grid grid-cols-2 gap-3">
            {mockSpeakers.map((speaker) => (
              <div key={speaker.id} className="flex flex-col items-center rounded-xl border p-4 text-center">
                <div className="relative mb-3 h-16 w-16 overflow-hidden rounded-full">
                  <Image src={speaker.avatar} alt="" fill className="object-cover" sizes="64px" />
                </div>
                <p className="text-sm font-semibold">{speaker.name}</p>
                <p className="text-xs text-muted-foreground">{speaker.title}</p>
                <p className="text-xs text-muted-foreground">{speaker.company}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "venues" && (
          <div className="space-y-3">
            <div className="rounded-xl border p-4">
              <h3 className="font-semibold">Istanbul Congress Center</h3>
              <p className="text-sm text-muted-foreground">Main venue for keynotes and workshops</p>
              <p className="mt-1 text-xs text-muted-foreground">
                <MapPin className="mr-1 inline h-3 w-3" />
                Harbiye, Sisli, Istanbul
              </p>
            </div>
          </div>
        )}

        {activeTab === "networking" && (
          <div className="flex h-48 flex-col items-center justify-center text-center">
            <Network className="mb-3 h-10 w-10 text-muted-foreground" />
            <p className="font-semibold">Networking</p>
            <p className="text-sm text-muted-foreground">Connect with fellow attendees</p>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="flex h-48 flex-col items-center justify-center text-center">
            <User className="mb-3 h-10 w-10 text-muted-foreground" />
            <p className="font-semibold">Conference Profile</p>
            <p className="text-sm text-muted-foreground">Set up your conference profile</p>
          </div>
        )}
      </div>
    </div>
  );
}
