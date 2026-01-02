export type MessageType = "direct" | "relay";

export type Message = {
  id: string;
  senderId: string;
  receiverId: string; // "broadcast" для широковещательных сообщений
  text: string;
  timestamp: number;
  type: MessageType;
};

