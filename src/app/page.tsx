"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin,
  Users,
  Calendar,
  Heart,
  Wallet,
  MessageCircle,
  ArrowRight,
  Coins,
  BarChart3,
  CheckCircle,
  Banknote,
  Share2,
  ImagePlus,
  Bell,
  Map,
  Shield,
  Zap,
  Globe,
  Star,
} from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Pick Your City",
    description:
      "Choose from cities like Bangalore, Mumbai, San Francisco, London, and more. Each city has its own thriving community.",
    icon: Globe,
    color: "#6366F1",
  },
  {
    step: "02",
    title: "Connect Your Wallet",
    description:
      "Link your Solana wallet to unlock tipping, crowdfunding, and on-chain reputation. Works with Phantom, Solflare, and more.",
    icon: Wallet,
    color: "#14B8A6",
  },
  {
    step: "03",
    title: "Join Your Tribes",
    description:
      "Find communities that match your interests — cycling, food, tech, art, music, gaming, and 10+ more categories.",
    icon: Users,
    color: "#FB7185",
  },
  {
    step: "04",
    title: "Start Contributing",
    description:
      "Post casts, create events, run polls, help with tasks, fund causes, and earn karma to build your reputation.",
    icon: Zap,
    color: "#FB923C",
  },
];

const features = [
  {
    icon: Heart,
    title: "Social Feed",
    description:
      "Share photo casts, like and comment on posts, bookmark your favorites, and build a following in your neighborhood.",
    color: "#EF4444",
  },
  {
    icon: Coins,
    title: "SOL Tipping",
    description:
      "Tip creators directly with Solana. Choose from preset amounts, see your tip history, and verify transactions on-chain.",
    color: "#F59E0B",
  },
  {
    icon: Calendar,
    title: "Local Events",
    description:
      "Discover meetups, cleanups, workshops, and festivals happening nearby. Create events and track RSVPs.",
    color: "#14B8A6",
  },
  {
    icon: BarChart3,
    title: "Community Polls",
    description:
      "Ask your community anything. Create multi-option polls and watch the votes come in real-time.",
    color: "#EC4899",
  },
  {
    icon: CheckCircle,
    title: "Local Tasks",
    description:
      "Need help moving? Looking for a dog walker? Post tasks with optional SOL rewards for community helpers.",
    color: "#F97316",
  },
  {
    icon: Banknote,
    title: "Crowdfunding",
    description:
      "Rally your neighborhood behind a cause. Fund community gardens, local art projects, or neighborhood repairs.",
    color: "#A78BFA",
  },
  {
    icon: MessageCircle,
    title: "Tribe Chat",
    description:
      "Real-time conversations with your tribe members. Discuss topics, plan events, and stay in the loop.",
    color: "#3B82F6",
  },
  {
    icon: Map,
    title: "Neighborhood Map",
    description:
      "See what's happening around you. Find nearby events, people, and places on an interactive local map.",
    color: "#10B981",
  },
  {
    icon: Bell,
    title: "Live Notifications",
    description:
      "Stay updated when someone likes your post, tips your content, or joins your tribe. Never miss a beat.",
    color: "#6366F1",
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    description:
      "Share casts, events, and tribes with friends via native share or link copy. Grow your community organically.",
    color: "#0EA5E9",
  },
  {
    icon: ImagePlus,
    title: "Photo Casts",
    description:
      "Upload photos from your camera or gallery. Preview before posting and share moments from your neighborhood.",
    color: "#8B5CF6",
  },
  {
    icon: Shield,
    title: "Karma & Reputation",
    description:
      "Earn karma for every contribution. Level up from Newcomer to Legend and unlock community trust badges.",
    color: "#059669",
  },
];

const cities = [
  { name: "Bangalore", emoji: "🇮🇳", members: "15K+", tribes: "42 tribes" },
  { name: "Mumbai", emoji: "🇮🇳", members: "23K+", tribes: "58 tribes" },
  { name: "Delhi", emoji: "🇮🇳", members: "19K+", tribes: "35 tribes" },
  { name: "San Francisco", emoji: "🇺🇸", members: "12K+", tribes: "31 tribes" },
  { name: "London", emoji: "🇬🇧", members: "22K+", tribes: "47 tribes" },
  { name: "New York", emoji: "🇺🇸", members: "29K+", tribes: "63 tribes" },
];

const stats = [
  { label: "Active Communities", value: "276+" },
  { label: "City Members", value: "120K+" },
  { label: "Events Created", value: "3.2K+" },
  { label: "SOL Tipped", value: "850+" },
];

const karmaLevels = [
  { level: "Newcomer", range: "0–100", color: "#94A3B8" },
  { level: "Neighbor", range: "100–500", color: "#6366F1" },
  { level: "Local", range: "500–1K", color: "#14B8A6" },
  { level: "Trusted", range: "1K–5K", color: "#FB923C" },
  { level: "Pillar", range: "5K–10K", color: "#EC4899" },
  { level: "Legend", range: "10K+", color: "#EAB308" },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen">
      {/* Ambient backgrounds */}
      <div className="glow-blue animate-pulse-slow" />

      {/* Header */}
      <nav className="fixed top-0 z-50 flex w-full items-center justify-between bg-background/80 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black lowercase tracking-tight">
            tribe
          </span>
          <span className="hidden sm:inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            on Solana
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/onboarding"
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 pt-32 pb-24">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mb-8 flex w-fit items-center gap-2 rounded-full border bg-background/50 px-4 py-1.5 text-xs font-semibold backdrop-blur-sm"
        >
          <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          Hyperlocal Social Networking on Solana
        </motion.div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-6 text-5xl font-black tracking-tight sm:text-7xl lg:text-8xl">
            Your neighborhood,
            <br />
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              your tribe
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg font-medium text-muted-foreground sm:text-xl">
            The social network for your city. Discover local events, join
            neighborhood tribes, tip creators with SOL, and build real
            connections where you live.
          </p>
        </motion.div>

        {/* CTA + Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-24 flex flex-col items-center gap-8"
        >
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-black text-primary-foreground shadow-lg transition-all hover:opacity-90 active:scale-95"
            >
              Join Your City <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 rounded-full border px-8 py-4 text-lg font-bold transition-all hover:bg-muted active:scale-95"
            >
              Explore Events
            </Link>
          </div>

          <div className="grid w-full max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-black tracking-tight sm:text-3xl">
                  {stat.value}
                </p>
                <p className="text-xs font-medium text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* How It Works */}
        <section className="mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-black tracking-tight sm:text-5xl">
              How it works
            </h2>
            <p className="mx-auto max-w-lg text-base font-medium text-muted-foreground">
              Get started in minutes. Pick your city, connect your wallet, and
              dive into your local community.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, idx) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative rounded-3xl border bg-background/50 p-6"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl"
                    style={{
                      backgroundColor: `${step.color}15`,
                      color: step.color,
                    }}
                  >
                    <step.icon className="h-6 w-6" />
                  </div>
                  <span
                    className="text-3xl font-black"
                    style={{ color: `${step.color}30` }}
                  >
                    {step.step}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-bold">{step.title}</h3>
                <p className="text-sm font-medium leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* What You Can Do */}
        <section className="mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-black tracking-tight sm:text-5xl">
              Everything you need to
              <br />
              build your local community
            </h2>
            <p className="mx-auto max-w-lg text-base font-medium text-muted-foreground">
              From sharing moments to funding projects, Tribe gives you all the
              tools to connect, contribute, and grow your neighborhood.
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="group rounded-3xl border bg-background/50 p-6 transition-all hover:bg-background hover:shadow-lg"
              >
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl transition-transform group-hover:scale-110"
                  style={{
                    backgroundColor: `${feature.color}15`,
                    color: feature.color,
                  }}
                >
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-base font-bold">{feature.title}</h3>
                <p className="text-sm font-medium leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Solana Integration */}
        <section className="mb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative overflow-hidden rounded-[32px] border bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 p-8 sm:p-12">
              <div className="relative z-10 grid gap-8 lg:grid-cols-2 lg:items-center">
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs font-bold">
                    <Wallet className="h-3.5 w-3.5" />
                    Powered by Solana
                  </div>
                  <h2 className="mb-4 text-3xl font-black tracking-tight sm:text-4xl">
                    Real value for
                    <br />
                    real communities
                  </h2>
                  <p className="mb-6 max-w-md text-base font-medium text-muted-foreground">
                    Connect your Solana wallet to tip creators, fund community
                    projects, and earn on-chain reputation. Every interaction is
                    verifiable, every tip is real.
                  </p>
                  <div className="space-y-3">
                    {[
                      "Tip posts with SOL — 0.01, 0.05, 0.1, or 0.5 SOL presets",
                      "Fund community crowdfunds with transparent tracking",
                      "Every transaction verifiable on Solana Explorer",
                      "Works with Phantom, Solflare, and all major wallets",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-2 text-sm"
                      >
                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                        <span className="font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="rounded-2xl border bg-background/80 p-5 backdrop-blur-sm">
                    <p className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Wallet Balance
                    </p>
                    <p className="text-3xl font-black">12.45 SOL</p>
                    <p className="text-sm text-muted-foreground">
                      Fq3k...x8Yd
                    </p>
                  </div>
                  <div className="rounded-2xl border bg-background/80 p-5 backdrop-blur-sm">
                    <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Recent Tips Sent
                    </p>
                    <div className="space-y-2.5">
                      {[
                        {
                          user: "@priya_art",
                          amount: "0.1 SOL",
                          time: "2m ago",
                        },
                        {
                          user: "@rahul_cycles",
                          amount: "0.05 SOL",
                          time: "1h ago",
                        },
                        {
                          user: "@maya_cooks",
                          amount: "0.5 SOL",
                          time: "3h ago",
                        },
                      ].map((tip) => (
                        <div
                          key={tip.user}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400" />
                            <span className="text-sm font-bold">
                              {tip.user}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold text-green-500">
                              {tip.amount}
                            </span>
                            <p className="text-[10px] text-muted-foreground">
                              {tip.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Karma System */}
        <section className="mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-black tracking-tight sm:text-5xl">
              Earn karma, build trust
            </h2>
            <p className="mx-auto max-w-lg text-base font-medium text-muted-foreground">
              Every post, tip, event, and helpful action earns you karma. Rise
              through the ranks and become a community legend.
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {karmaLevels.map((level, idx) => (
              <motion.div
                key={level.level}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="flex flex-col items-center gap-2 rounded-2xl border p-4 text-center"
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: `${level.color}20`,
                    color: level.color,
                  }}
                >
                  <Star className="h-5 w-5" />
                </div>
                <p className="text-sm font-bold">{level.level}</p>
                <p className="text-[10px] font-medium text-muted-foreground">
                  {level.range} pts
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Cities Section */}
        <section className="mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-black tracking-tight sm:text-5xl">
              Live in {cities.length} cities
            </h2>
            <p className="mx-auto max-w-lg text-base font-medium text-muted-foreground">
              Find your city and join thousands of neighbors already building
              stronger local communities.
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {cities.map((city, idx) => (
              <motion.div
                key={city.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center gap-4 rounded-2xl border bg-background/50 p-5 transition-all hover:bg-background hover:shadow-md"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted text-2xl">
                  {city.emoji}
                </div>
                <div>
                  <h3 className="text-base font-bold">{city.name}</h3>
                  <p className="text-sm font-semibold text-muted-foreground">
                    {city.members} members
                  </p>
                  <p className="text-xs text-muted-foreground/60">
                    {city.tribes}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Footer */}
        <section className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative overflow-hidden rounded-[32px] border bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10 px-8 py-16 sm:px-12 sm:py-24">
              <h2 className="mb-4 text-4xl font-black tracking-tight sm:text-6xl">
                Ready to find
                <br />
                your tribe?
              </h2>
              <p className="mx-auto mb-8 max-w-md text-base font-medium text-muted-foreground">
                Join thousands of people connecting with their neighbors,
                supporting local creators, and building communities that matter.
              </p>
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-12 py-5 text-xl font-black text-primary-foreground shadow-xl transition-all hover:opacity-90 active:scale-95"
              >
                Get Started Free <ArrowRight className="h-6 w-6" />
              </Link>
            </div>
          </motion.div>

          <div className="mt-12 text-sm font-bold uppercase tracking-widest text-muted-foreground">
            &copy; 2025 Tribe. Hyperlocal communities on Solana.
          </div>
        </section>
      </main>
    </div>
  );
}
