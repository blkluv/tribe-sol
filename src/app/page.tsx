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
  Sparkles,
  Upload,
  Plus,
} from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Hyperlocal Discovery",
    description: "Find events, people, and communities right in your neighborhood.",
  },
  {
    icon: Users,
    title: "Join Tribes",
    description: "Connect with like-minded people in interest-based local communities.",
  },
  {
    icon: Calendar,
    title: "Local Events",
    description: "Discover and create events happening around you. From meetups to cleanups.",
  },
  {
    icon: Heart,
    title: "Karma & Reputation",
    description: "Earn karma for contributing to your community. Level up from Newcomer to Legend.",
  },
  {
    icon: Wallet,
    title: "Tip & Support",
    description: "Tip great content creators and support community crowdfunds.",
  },
  {
    icon: MessageCircle,
    title: "Tribe Chat",
    description: "Real-time conversations with your tribe members. Stay connected.",
  },
];

const cities = [
  { name: "Bangalore", emoji: "🇮🇳", members: "15K+" },
  { name: "Mumbai", emoji: "🇮🇳", members: "23K+" },
  { name: "Delhi", emoji: "🇮🇳", members: "19K+" },
  { name: "San Francisco", emoji: "🇺🇸", members: "12K+" },
  { name: "London", emoji: "🇬🇧", members: "22K+" },
  { name: "New York", emoji: "🇺🇸", members: "29K+" },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen">
      {/* Ambient backgrounds */}
      <div className="glow-blue animate-pulse-slow" />

      {/* Header */}
      <nav className="fixed top-0 z-50 flex w-full items-center justify-between bg-background/80 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black lowercase tracking-tight">tribe</span>
        </div>
        <Link
          href="/onboarding"
          className="rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 active:scale-95"
        >
          Join Your City
        </Link>
      </nav>

      <main className="mx-auto max-w-5xl px-6 pt-32 pb-24">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mb-8 flex w-fit items-center gap-2 rounded-full border bg-white/50 px-4 py-1.5 text-xs font-semibold backdrop-blur-sm"
        >
          <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          Hyperlocal Social Networking
        </motion.div>

        {/* Hero Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h1 className="mb-6 text-5xl font-black tracking-tight sm:text-7xl lg:text-8xl">
            Your neighborhood,<br />
            <span className="text-muted-foreground/30">your tribe</span>
          </h1>
          <p className="mx-auto max-w-xl text-lg font-medium text-muted-foreground">
            Connect with your local community. Discover events, join tribes,
            earn karma, and build meaningful connections in your city.
          </p>
        </motion.div>

        {/* Main Interaction Card (Supertoons Style) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative mx-auto mb-32 max-w-2xl"
        >
          <div className="absolute -inset-1 rounded-[44px] bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-20 blur-xl" />
          <div className="super-shadow relative rounded-[40px] border bg-white p-8">
            <div className="flex flex-col items-center justify-center space-y-8 py-12">
              <div className="group relative flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-[32px] border-2 border-dashed border-muted-foreground/20 bg-muted/50 transition-all hover:border-primary/40 hover:bg-muted">
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform group-hover:scale-110">
                    <Plus className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Find your community</h3>
                    <p className="text-sm text-muted-foreground">Select your city to get started</p>
                  </div>
                </div>
              </div>

              <div className="grid w-full grid-cols-3 gap-3">
                {cities.slice(0, 3).map((city) => (
                  <button
                    key={city.name}
                    className="flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all hover:bg-muted active:scale-95"
                  >
                    <span className="text-2xl">{city.emoji}</span>
                    <span className="text-xs font-bold">{city.name}</span>
                  </button>
                ))}
              </div>

              <Link
                href="/onboarding"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary py-5 text-xl font-black text-primary-foreground shadow-lg transition-all hover:opacity-90 active:scale-95"
              >
                Join Tribe <ArrowRight className="h-6 w-6" />
              </Link>
            </div>

            {/* Made by badge */}
            <div className="absolute -bottom-4 right-8 flex items-center gap-2 rounded-full bg-black px-3 py-1.5 text-[10px] font-bold text-white uppercase tracking-wider">
              Made for the community
            </div>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="super-shadow group rounded-[32px] border bg-white/50 p-8 transition-all hover:bg-white"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted transition-transform group-hover:scale-110">
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="mb-3 text-xl font-bold">{feature.title}</h3>
              <p className="text-sm font-medium leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Cities Section */}
        <section className="mt-32">
          <div className="mb-12 text-center text-3xl font-black lowercase tracking-tight">
            live in {cities.length} cities
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {cities.map((city) => (
              <div
                key={city.name}
                className="flex items-center gap-4 rounded-[24px] border border-muted-foreground/10 bg-white/30 p-4 backdrop-blur-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-xl">
                  {city.emoji}
                </div>
                <div>
                  <h3 className="font-bold">{city.name}</h3>
                  <p className="text-xs font-semibold text-muted-foreground">{city.members} members</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Footer */}
        <section className="mt-48 text-center">
          <h2 className="mb-8 text-4xl font-black tracking-tight sm:text-6xl">
            Ready to find<br />
            your tribe?
          </h2>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-12 py-5 text-xl font-black text-primary-foreground shadow-xl transition-all hover:opacity-90 active:scale-95"
          >
            Get Started Free <ArrowRight className="h-6 w-6" />
          </Link>
          <div className="mt-12 text-sm font-bold text-muted-foreground uppercase tracking-widest">
            &copy; 2024 Tribe. building hyperlocal communities.
          </div>
        </section>
      </main>
    </div>
  );
}
