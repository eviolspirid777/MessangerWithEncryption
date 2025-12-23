import { Chat } from "@/shared/types/Chat";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Avatar } from "../Avatar/Avatar";
import { ChatContent } from "../ChatContent/ChatContent";

const mockChats: Chat[] = [
  {
    id: "1",
    name: "Андрей",
    lastMessage: "Привет! Как дела?",
    time: "14:32",
    unread: 2,
    online: true,
  },
  {
    id: "2",
    name: "Мария",
    lastMessage: "Увидимся завтра",
    time: "13:15",
    unread: 0,
    online: true,
  },
  {
    id: "3",
    name: "Дмитрий",
    lastMessage: "Отправил тебе файлы",
    time: "Вчера",
    unread: 0,
    online: false,
  },
  {
    id: "4",
    name: "Елена",
    lastMessage: "Спасибо за помощь!",
    time: "Вчера",
    unread: 5,
    online: false,
  },
];

export const ChatMainBlock = () => {
  const router = useRouter();

  return (
    <ScrollView style={styles.chatList} showsVerticalScrollIndicator={false}>
      {mockChats.map((chat) => (
        <TouchableOpacity
          key={chat.id}
          style={styles.chatItem}
          onPress={() => router.push(`/chat/${chat.id}`)}
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
});
