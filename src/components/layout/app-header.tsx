"use client";

import { useState } from "react";
import { useTribeStore } from "@/store/use-tribe-store";
import { useAuth } from "@/hooks/use-auth";
import { WalletButton } from "@/components/tribe/wallet-button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { CitySwitcher } from "./city-switcher";

interface AppHeaderProps {
    title?: string;
    showBackButton?: boolean;
}

export function AppHeader({ title, showBackButton }: AppHeaderProps) {
    const { currentCity } = useTribeStore();
    const { profile } = useAuth();
    const router = useRouter();
    const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

    return (
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-[#f0f0f0]">
            <div className="flex items-center gap-3">
                {showBackButton ? (
                    <button
                        onClick={() => router.back()}
                        className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#f5f5f5] hover:bg-[#eeeeee] transition-colors"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                ) : (
                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-black text-white text-lg font-black tracking-tighter shadow-xl shadow-black/10">
                        {title ? title.charAt(0) : (currentCity?.name.charAt(0) || "T")}
                    </div>
                )}
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold tracking-tight leading-none">
                        {title || currentCity?.name || "Tribe"}
                    </h1>
                    <div className="flex items-center gap-1.5 mt-1.5 text-left">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                            {currentCity?.name || "Local"}
                        </span>
                        <button
                            onClick={() => setIsSwitcherOpen(true)}
                            className="text-[11px] font-bold uppercase tracking-widest text-primary hover:opacity-70 transition-opacity whitespace-nowrap"
                        >
                            (Change City)
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-end gap-1.5">
                <WalletButton className="h-10 rounded-xl px-4 text-xs font-bold" />
                {profile && (
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                        @{profile.username}
                    </span>
                )}
            </div>

            <CitySwitcher
                isOpen={isSwitcherOpen}
                onOpenChange={setIsSwitcherOpen}
            />
        </div>
    );
}
