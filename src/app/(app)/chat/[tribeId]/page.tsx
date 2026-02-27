"use client";

import { use, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Send, ImagePlus, Smile } from "lucide-react";
import { useTribeStore } from "@/store/use-tribe-store";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender: string;
  avatar: string;
  content: string;
  isMe: boolean;
  time: string;
}

const chatTemplates: Record<string, Message[]> = {
  cycling: [
    { id: "m1", sender: "Arjun K", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop", content: "Who's up for the dawn ride tomorrow? Route: Cubbon Park to Ulsoor Lake and back.", isMe: false, time: "9:45 AM" },
    { id: "m2", sender: "Priya S", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", content: "I'm in! Should we take the new cycle track they built last month?", isMe: false, time: "9:48 AM" },
    { id: "m3", sender: "You", avatar: "", content: "Count me in! The new track is smooth, let's do it. 6 AM start?", isMe: true, time: "9:50 AM" },
    { id: "m4", sender: "Arjun K", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop", content: "6 AM works. Meet at the main entrance. Helmets mandatory!", isMe: false, time: "9:52 AM" },
    { id: "m5", sender: "Rahul M", avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop", content: "I'll bring the energy bars. Got some great protein ones from that new health store.", isMe: false, time: "10:00 AM" },
    { id: "m6", sender: "Priya S", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", content: "Perfect! Also, has anyone tried the new Bianchi bikes? Thinking of upgrading.", isMe: false, time: "10:05 AM" },
    { id: "m7", sender: "You", avatar: "", content: "Bianchi is great but check out Trek too. Better value for the price range.", isMe: true, time: "10:08 AM" },
  ],
  food: [
    { id: "m1", sender: "Meera J", avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop", content: "Just discovered the best biryani place near Indiranagar. You HAVE to try it!", isMe: false, time: "12:30 PM" },
    { id: "m2", sender: "You", avatar: "", content: "Drop the location! I've been searching for good biryani forever.", isMe: true, time: "12:32 PM" },
    { id: "m3", sender: "Meera J", avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop", content: "It's called Spice Garden, 2nd cross road near the metro station. The mutton biryani is chef's kiss.", isMe: false, time: "12:34 PM" },
    { id: "m4", sender: "Vikram P", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", content: "I've been there! Their kebabs are amazing too. Pro tip: go before 1 PM to avoid the rush.", isMe: false, time: "12:40 PM" },
    { id: "m5", sender: "You", avatar: "", content: "Going there for lunch today. Anyone want to join? My treat for the first person!", isMe: true, time: "12:45 PM" },
    { id: "m6", sender: "Meera J", avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop", content: "On my way! Also check out their mango lassi. Best in the city.", isMe: false, time: "12:48 PM" },
  ],
  default: [
    { id: "m1", sender: "Alex T", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop", content: "Welcome to the group! Great to have everyone here.", isMe: false, time: "10:00 AM" },
    { id: "m2", sender: "Sarah K", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", content: "Thanks for setting this up! Looking forward to connecting with everyone.", isMe: false, time: "10:05 AM" },
    { id: "m3", sender: "You", avatar: "", content: "Hey everyone! Excited to be part of this community.", isMe: true, time: "10:08 AM" },
    { id: "m4", sender: "Alex T", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop", content: "Let's plan something for this weekend. Any ideas?", isMe: false, time: "10:10 AM" },
    { id: "m5", sender: "Mike J", avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop", content: "How about a meetup at the park? Weather looks great!", isMe: false, time: "10:15 AM" },
    { id: "m6", sender: "Sarah K", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", content: "I love that idea! Saturday afternoon works for me.", isMe: false, time: "10:20 AM" },
    { id: "m7", sender: "You", avatar: "", content: "Saturday works! I can bring some snacks and drinks.", isMe: true, time: "10:22 AM" },
    { id: "m8", sender: "Alex T", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop", content: "Perfect! Let's meet at 3 PM. I'll share the exact spot tomorrow.", isMe: false, time: "10:25 AM" },
  ],
};

function getChatForTribe(category?: string): Message[] {
  if (category && chatTemplates[category]) return chatTemplates[category];
  return chatTemplates.default;
}

export default function TribeChatPage({ params }: { params: Promise<{ tribeId: string }> }) {
  const { tribeId } = use(params);
  const router = useRouter();
  const { tribes } = useTribeStore();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const tribe = tribes.find((t) => t.id === tribeId);
  const tribeName = tribe?.name || "Chat";
  const memberCount = tribe?.members || 0;
  const onlineCount = Math.max(3, Math.floor(memberCount * 0.005));

  useEffect(() => {
    setMessages(getChatForTribe(tribe?.category));
  }, [tribe?.category]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;
    const newMsg: Message = {
      id: `m-${Date.now()}`,
      sender: "You",
      avatar: "",
      content: message.trim(),
      isMe: true,
      time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setMessage("");
  };

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b bg-background px-4 py-3">
        <button onClick={() => router.back()} className="rounded-full p-1 hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-base font-bold">{tribeName}</h1>
          <p className="text-xs text-muted-foreground">{onlineCount} members online</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex justify-center mb-4">
          <span className="rounded-full bg-muted px-3 py-1 text-[10px] font-medium text-muted-foreground">Today</span>
        </div>
        {messages.map((msg) => (
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
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <ImagePlus className="h-5 w-5" />
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Smile className="h-5 w-5" />
          </button>
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 rounded-full border bg-muted/50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
