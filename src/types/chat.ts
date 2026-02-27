import type { UserKarma } from "./user";

export type MessageType = "text" | "image" | "event" | "poll" | "levelUp";

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  isFromCurrentUser: boolean;
  type: MessageType;
  senderKarma?: UserKarma;
}
