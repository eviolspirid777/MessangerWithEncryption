import { ChatHeader } from "@/components/Chats/ChatHeader/ChatHeader";
import { ChatMainBlock } from "@/components/Chats/ChatMainBlock/ui/ChatMainBlock";
import { ChatSearchBlock } from "@/components/Chats/ChatSearchBlock/ChatSearchBlock";
import { StyleSheet, View } from "react-native";

export default function ChatsScreen() {
  return (
    <View style={styles.container}>
      <ChatHeader />
      <ChatSearchBlock />
      <ChatMainBlock />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
});
