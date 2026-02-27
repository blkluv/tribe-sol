"use client";

import Link from "next/link";
import { MessageCircle, Search, MoreHorizontal, MessageSquare } from "lucide-react";
import { useTribeStore } from "@/store/use-tribe-store";
import { AppHeader } from "@/components/layout/app-header";

const chatPreviews = [
  { tribeId: "cycling-tribe-blr", tribeName: "Cycling Tribe", lastMessage: "Perfect! 6 AM works. Let's meet at the main entrance.", sender: "John Doe", time: "2m", unread: 3, icon: "🚲" },
  { tribeId: "food-lovers-blr", tribeName: "Food Lovers", lastMessage: "Adding to my Mumbai food list! Thanks for the rec", sender: "You", time: "15m", unread: 0, icon: "🍜" },
  { tribeId: "tech-startups-sf", tribeName: "Tech & Startups", lastMessage: "Next month? That gives us time to promote and get sponsors", sender: "Emily Chen", time: "1h", unread: 2, icon: "🚀" },
  { tribeId: "ny-artists-ny", tribeName: "NYC Artists", lastMessage: "Next month! We're thinking indie/alternative this time", sender: "Maria Garcia", time: "3h", unread: 0, icon: "🎨" },
  { tribeId: "london-football-lon", tribeName: "Football Fans", lastMessage: "We're doing it monthly now! Join us next time", sender: "James Wilson", time: "5h", unread: 1, icon: "⚽" },
];

export default function ChatPage() {
  const { tribes } = useTribeStore();

  return (
    <div className="bg-[#fcfcfc] min-h-screen">
      <AppHeader title="Chat" />

      {/* Search Header */}
      <div className="sticky top-[73px] z-30 bg-white/80 backdrop-blur-md px-6 py-4 border-b border-[#f0f0f0]">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full rounded-2xl border border-[#f0f0f0] bg-[#f9f9f9] py-3.5 pl-12 pr-4 text-[15px] font-bold outline-none transition-all focus:bg-white focus:ring-4 focus:ring-primary/5"
          />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="flex flex-col gap-3">
          {chatPreviews.map((chat) => {
            const tribe = tribes.find((t) => t.id === chat.tribeId);
            return (
              <Link
                key={chat.tribeId}
                href={`/chat/${chat.tribeId}`}
                className={`group flex items-center gap-4 p-5 rounded-[28px] bg-white border border-[#f0f0f0] transition-all hover:shadow-xl hover:shadow-black/[0.03] active:scale-[0.98] ${chat.unread > 0 ? "border-primary/20 shadow-md shadow-primary/5" : ""
                  }`}
              >
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-[20px] text-2xl shadow-lg shadow-black/5 shrink-0"
                  style={{ backgroundColor: tribe ? `${tribe.color}20` : "#f5f5f5" }}
                >
                  {chat.icon || "💬"}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[16px] font-bold tracking-tight truncate">{chat.tribeName}</span>
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{chat.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="truncate text-[14px] font-medium text-[#666]">
                      <span className="text-black font-bold">{chat.sender}:</span> {chat.lastMessage}
                    </p>
                  </div>
                </div>

                {chat.unread > 0 && (
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-black text-white ring-4 ring-primary/10">
                    {chat.unread}
                  </div>
                )}

                <div className="hidden group-hover:block ml-1">
                  <MoreHorizontal className="h-5 w-5 text-[#ccc]" />
                </div>
              </Link>
            );
          })}
        </div>

        {chatPreviews.length === 0 && (
          <div className="flex h-[50vh] flex-col items-center justify-center space-y-4 text-center">
            <div className="rounded-[40px] bg-muted/30 p-10">
              <MessageSquare className="h-10 w-10 text-muted-foreground/30" />
            </div>
            <div>
              <p className="text-xl font-bold tracking-tight text-black">Quiet in here...</p>
              <p className="text-sm font-medium text-muted-foreground mt-1">Start a conversation in a Tribe</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
