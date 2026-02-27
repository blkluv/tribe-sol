"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Users, Heart, Sparkles, ArrowRight } from "lucide-react";

const slides = [
  {
    icon: MapPin,
    title: "Discover Your City",
    description: "Find local events, places, and hidden gems in your neighborhood.",
    gradient: "from-indigo-500 to-violet-500",
    color: "#6366F1",
  },
  {
    icon: Users,
    title: "Join Local Tribes",
    description: "Connect with people who share your interests and passions nearby.",
    gradient: "from-teal-500 to-cyan-500",
    color: "#14B8A6",
  },
  {
    icon: Heart,
    title: "Build Karma",
    description: "Earn reputation by helping your community. Level up from Newcomer to Legend.",
    gradient: "from-rose-400 to-pink-500",
    color: "#FB7185",
  },
  {
    icon: Sparkles,
    title: "Make an Impact",
    description: "Create events, start crowdfunds, and organize tasks that make a difference.",
    gradient: "from-amber-400 to-orange-500",
    color: "#FB923C",
  },
];

export default function OnboardingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      router.push("/onboarding/city");
    }
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center"
          >
            <div
              className={`mb-8 flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br ${slide.gradient} shadow-lg`}
            >
              <Icon className="h-14 w-14 text-white" />
            </div>
            <h2 className="mb-4 text-2xl font-bold">{slide.title}</h2>
            <p className="mb-8 text-muted-foreground">{slide.description}</p>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="mb-8 flex justify-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className="h-2 rounded-full transition-all"
              style={{
                width: idx === currentSlide ? 24 : 8,
                backgroundColor: idx === currentSlide ? slide.color : "#E5E7EB",
              }}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleNext}
            className="flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-base font-semibold text-background transition-opacity hover:opacity-90"
          >
            {currentSlide < slides.length - 1 ? "Next" : "Choose Your City"}
            <ArrowRight className="h-5 w-5" />
          </button>
          {currentSlide < slides.length - 1 && (
            <button
              onClick={() => router.push("/onboarding/city")}
              className="py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              Skip
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
