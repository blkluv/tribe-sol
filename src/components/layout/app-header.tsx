"use client";

import { useTribeStore } from "@/store/use-tribe-store";
import { useAuth } from "@/hooks/use-auth";
import { WalletButton } from "@/components/tribe/wallet-button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface AppHeaderProps {
    title?: string;
    showBackButton?: boolean;
}

export function AppHeader({ title, showBackButton }: AppHeaderProps) {
    const { currentCity } = useTribeStore();
    const { profile } = useAuth();
    const router = useRouter();

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
                    {!title && (
                        <button
                            onClick={() => {/* Trigger city switcher modal */ }}
                            className="text-[11px] font-bold uppercase tracking-widest text-primary hover:opacity-70 transition-opacity text-left mt-1.5"
                        >
                            Switch City
                        </button>
                    )}
                    {title && (
                        <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mt-1.5">
                            {currentCity?.name || "Local"} Pulse
                        </p>
                    )}
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
        </div>
    );
}
