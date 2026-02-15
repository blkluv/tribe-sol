"use client";

import Link from "next/link";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { useTribeStore } from "@/store/use-tribe-store";

const chatPreviews = [
  { tribeId: "cycling-tribe-blr", tribeName: "Cycling Tribe", lastMessage: "Perfect! 6 AM works. Let's meet at the main entrance.", sender: "John Doe", time: "2m", unread: 3 },
  { tribeId: "food-lovers-blr", tribeName: "Food Lovers", lastMessage: "Adding to my Mumbai food list! Thanks for the rec", sender: "You", time: "15m", unread: 0 },
  { tribeId: "tech-startups-sf", tribeName: "Tech & Startups", lastMessage: "Next month? That gives us time to promote and get sponsors", sender: "Emily Chen", time: "1h", unread: 2 },
  { tribeId: "ny-artists-ny", tribeName: "NYC Artists", lastMessage: "Next month! We're thinking indie/alternative this time", sender: "Maria Garcia", time: "3h", unread: 0 },
  { tribeId: "london-football-lon", tribeName: "Football Fans", lastMessage: "We're doing it monthly now! Join us next time", sender: "James Wilson", time: "5h", unread: 1 },
];

export default function ChatPage() {
  const { tribes } = useTribeStore();

  return (
    <div>
      <div className="sticky top-0 z-40 border-b bg-background/80 px-4 py-3 backdrop-blur-lg">
        <h1 className="text-lg font-bold">Chat</h1>
      </div>

      <div>
        {chatPreviews.map((chat) => {
          const tribe = tribes.find((t) => t.id === chat.tribeId);
          return (
            <Link
              key={chat.tribeId}
              href={`/chat/${chat.tribeId}`}
              className="flex items-center gap-3 border-b px-4 py-3 hover:bg-muted/50"
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: tribe ? `#${tribe.color}` : "#6366F1" }}
              >
                <MessageCircle className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{chat.tribeName}</span>
                  <span className="text-xs text-muted-foreground">{chat.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="truncate text-sm text-muted-foreground">
                    {chat.sender}: {chat.lastMessage}
                  </p>
                  {chat.unread > 0 && (
                    <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-xs text-white">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
