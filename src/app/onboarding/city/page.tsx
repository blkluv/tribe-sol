"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, MapPin, Check } from "lucide-react";
import { cities } from "@/data/cities";

export default function CitySelectionPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const filtered = cities.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.country.toLowerCase().includes(search.toLowerCase())
  );

  const handleContinue = () => {
    if (selected) {
      localStorage.setItem("tribe-selected-city", selected);
      router.push("/onboarding/signup");
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 text-center">
        <MapPin className="mx-auto mb-4 h-10 w-10 text-indigo-500" />
        <h1 className="mb-2 text-2xl font-bold">Choose Your City</h1>
        <p className="text-muted-foreground">
          Select the city where you want to start connecting with your community.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search cities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border bg-background py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      {/* City Grid */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {filtered.map((city) => {
          const isSelected = selected === city.id;
          return (
            <motion.button
              key={city.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelected(city.id)}
              className="relative overflow-hidden rounded-2xl border-2 transition-all"
              style={{
                borderColor: isSelected ? city.accentColor : "transparent",
              }}
            >
              <div className="relative aspect-square">
                <Image
                  src={city.imageUrl}
                  alt={city.name}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full text-white"
                    style={{ backgroundColor: city.accentColor }}
                  >
                    <Check className="h-4 w-4" />
                  </motion.div>
                )}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 text-left text-white">
                <div className="flex items-center gap-1">
                  <span className="text-xs">{city.emoji}</span>
                  <span className="text-sm font-semibold">{city.name}</span>
                </div>
                <p className="text-xs text-white/70">{city.memberCountDisplay} members</p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Continue */}
      <button
        onClick={handleContinue}
        disabled={!selected}
        className="w-full rounded-full bg-foreground py-3.5 text-base font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        Continue
      </button>
    </div>
  );
}
