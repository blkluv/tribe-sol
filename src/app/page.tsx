"use client";

import Link from "next/link";
import Image from "next/image";
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
} from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Hyperlocal Discovery",
    description: "Find events, people, and communities right in your neighborhood.",
    color: "#6366F1",
  },
  {
    icon: Users,
    title: "Join Tribes",
    description: "Connect with like-minded people in interest-based local communities.",
    color: "#14B8A6",
  },
  {
    icon: Calendar,
    title: "Local Events",
    description: "Discover and create events happening around you. From meetups to cleanups.",
    color: "#FB7185",
  },
  {
    icon: Heart,
    title: "Karma & Reputation",
    description: "Earn karma for contributing to your community. Level up from Newcomer to Legend.",
    color: "#A78BFA",
  },
  {
    icon: Wallet,
    title: "Tip & Support",
    description: "Tip great content creators and support community crowdfunds.",
    color: "#FB923C",
  },
  {
    icon: MessageCircle,
    title: "Tribe Chat",
    description: "Real-time conversations with your tribe members. Stay connected.",
    color: "#38BDF8",
  },
];

const cities = [
  { name: "Bangalore", emoji: "🇮🇳", color: "#6366F1", members: "15K+" },
  { name: "Mumbai", emoji: "🇮🇳", color: "#FB7185", members: "23K+" },
  { name: "Delhi", emoji: "🇮🇳", color: "#FB923C", members: "19K+" },
  { name: "San Francisco", emoji: "🇺🇸", color: "#14B8A6", members: "12K+" },
  { name: "London", emoji: "🇬🇧", color: "#38BDF8", members: "22K+" },
  { name: "New York", emoji: "🇺🇸", color: "#A78BFA", members: "29K+" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-teal-500/5" />
        <div className="relative mx-auto max-w-6xl px-4 pt-20 pb-24 sm:px-6 lg:px-8">
          <nav className="mb-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-lg font-bold text-white">
                T
              </div>
              <span className="text-xl font-bold">Tribe</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/onboarding"
                className="rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90"
              >
                Get Started
              </Link>
            </div>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm">
              <Sparkles className="h-4 w-4 text-indigo-500" />
              <span>Hyperlocal social networking</span>
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Your neighborhood,{" "}
              <span className="bg-gradient-to-r from-indigo-500 to-teal-500 bg-clip-text text-transparent">
                your tribe
              </span>
            </h1>
            <p className="mb-10 text-lg text-muted-foreground sm:text-xl">
              Connect with your local community. Discover events, join tribes,
              earn karma, and build meaningful connections in your city.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-2 rounded-full bg-indigo-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-500/30"
              >
                Join Your City
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/home"
                className="inline-flex items-center gap-2 rounded-full border px-8 py-3.5 text-base font-semibold transition-colors hover:bg-muted"
              >
                Explore Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/30 py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold">Everything your community needs</h2>
            <p className="text-lg text-muted-foreground">
              From local discovery to community building, Tribe has it all.
            </p>
          </div>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={item}
                className="rounded-2xl border bg-background p-6 shadow-tribe-subtle transition-shadow hover:shadow-tribe-small"
              >
                <div
                  className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${feature.color}15`, color: feature.color }}
                >
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Cities */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold">Live in 6 cities</h2>
            <p className="text-lg text-muted-foreground">
              Growing communities across the globe. Find yours.
            </p>
          </div>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {cities.map((city) => (
              <motion.div
                key={city.name}
                variants={item}
                className="flex items-center gap-4 rounded-2xl border p-5 transition-shadow hover:shadow-tribe-small"
              >
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-xl text-2xl"
                  style={{ backgroundColor: `${city.color}15` }}
                >
                  {city.emoji}
                </div>
                <div>
                  <h3 className="font-semibold">{city.name}</h3>
                  <p className="text-sm text-muted-foreground">{city.members} members</p>
                </div>
                <div
                  className="ml-auto h-3 w-3 rounded-full"
                  style={{ backgroundColor: city.color }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-muted/30 py-24">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="mb-4 text-3xl font-bold">Ready to find your tribe?</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join thousands of people connecting with their local communities.
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 rounded-full bg-indigo-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-600"
          >
            Get Started Free
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Tribe. Building hyperlocal communities.</p>
        </div>
      </footer>
    </div>
  );
}
