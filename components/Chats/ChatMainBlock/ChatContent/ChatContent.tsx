import { Chat } from "@/shared/types/Chat";
import { FC } from "react";
import { StyleSheet, Text, View } from "react-native";

type ChatContentProps = {
  chat: Chat;
};

export const ChatContent: FC<ChatContentProps> = ({ chat }) => {
  return (
    <View style={styles.chatContent}>
      <View style={styles.chatHeader}>
        <Text style={styles.chatName}>{chat.name}</Text>
        <Text style={styles.chatTime}>{chat.time}</Text>
      </View>
      <View style={styles.chatFooter}>
        <Text
          style={[styles.lastMessage, chat.unread > 0 && styles.unreadMessage]}
          numberOfLines={1}
        >
          {chat.lastMessage}
        </Text>
        {chat.unread > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{chat.unread}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chatContent: {
    flex: 1,
    justifyContent: "center",
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  chatName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1f2937",
  },
  chatTime: {
    fontSize: 13,
    color: "#9ca3af",
  },
  chatFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastMessage: {
    flex: 1,
    fontSize: 15,
    color: "#6b7280",
    marginRight: 8,
  },
  unreadMessage: {
    fontWeight: "600",
    color: "#1f2937",
  },
  unreadBadge: {
    backgroundColor: "#2563eb",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  unreadText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
});
