import { useChats } from "@/shared/hooks/useChats";
import { Chat } from "@/shared/types/Chat";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Avatar } from "../Avatar/Avatar";
import { ChatContent } from "../ChatContent/ChatContent";

export const ChatMainBlock = () => {
  const router = useRouter();
  const { chats, loading, markChatAsRead } = useChats();

  const handleChatPress = (chat: Chat) => {
    // Отмечаем чат как прочитанный при открытии
    markChatAsRead(chat.id);
    router.push(`/chat/${chat.id}`);
  };

  if (loading) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Загрузка чатов...</Text>
      </View>
    );
  }

  if (chats.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Нет чатов</Text>
        <Text style={styles.emptySubtext}>
          Нажмите на плюсик, чтобы создать новый чат
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.chatList} showsVerticalScrollIndicator={false}>
      {chats.map((chat) => (
        <TouchableOpacity
          key={chat.id}
          style={styles.chatItem}
          onPress={() => handleChatPress(chat)}
        >
          <Avatar chatLogoLetter={chat.name[0]} online={chat.online} />
          <ChatContent chat={chat} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  chatList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
