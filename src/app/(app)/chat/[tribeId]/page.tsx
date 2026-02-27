"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Send } from "lucide-react";
import { useTribeStore } from "@/store/use-tribe-store";
import { cn } from "@/lib/utils";

const mockMessages = [
  { id: "m1", sender: "John Doe", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop", content: "Hey everyone! Anyone up for a cycling session tomorrow morning?", isMe: false, time: "10:00 AM" },
  { id: "m2", sender: "Sarah K", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", content: "I'm in! What time are we starting?", isMe: false, time: "10:05 AM" },
  { id: "m3", sender: "You", avatar: "", content: "Count me in too! How about 6 AM at Cubbon Park?", isMe: true, time: "10:08 AM" },
  { id: "m4", sender: "John Doe", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop", content: "Perfect! 6 AM works. Let's meet at the main entrance.", isMe: false, time: "10:10 AM" },
  { id: "m5", sender: "Mike J", avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop", content: "I might join if I wake up early enough 😅", isMe: false, time: "10:15 AM" },
  { id: "m6", sender: "Lisa Brown", avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop", content: "How long is the ride going to be?", isMe: false, time: "10:20 AM" },
  { id: "m7", sender: "You", avatar: "", content: "About 15km, nice and easy pace. All levels welcome!", isMe: true, time: "10:22 AM" },
  { id: "m8", sender: "Lisa Brown", avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop", content: "Great! I'll be there ✨", isMe: false, time: "10:25 AM" },
];

export default function TribeChatPage({ params }: { params: Promise<{ tribeId: string }> }) {
  const { tribeId } = use(params);
  const router = useRouter();
  const { tribes } = useTribeStore();
  const [message, setMessage] = useState("");

  const tribe = tribes.find((t) => t.id === tribeId);
  const tribeName = tribe?.name || "Chat";

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b bg-background px-4 py-3">
        <button onClick={() => router.back()} className="rounded-full p-1 hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-base font-bold">{tribeName}</h1>
          <p className="text-xs text-muted-foreground">8 members online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {mockMessages.map((msg) => (
          <div
            key={msg.id}
            className={cn("flex gap-2", msg.isMe && "flex-row-reverse")}
          >
            {!msg.isMe && (
              <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full">
                <Image src={msg.avatar} alt="" fill className="object-cover" sizes="32px" />
              </div>
            )}
            <div className={cn("max-w-[75%]", msg.isMe && "items-end")}>
              {!msg.isMe && (
                <p className="mb-0.5 text-xs font-medium text-muted-foreground">{msg.sender}</p>
              )}
              <div
                className={cn(
                  "rounded-2xl px-4 py-2.5 text-sm",
                  msg.isMe
                    ? "bg-indigo-500 text-white rounded-br-md"
                    : "bg-muted rounded-bl-md"
                )}
              >
                {msg.content}
              </div>
              <p className={cn("mt-0.5 text-xs text-muted-foreground", msg.isMe && "text-right")}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t bg-background p-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 rounded-full border bg-muted/50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 text-white transition-opacity hover:opacity-90"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
