import { Plus } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const ChatHeader = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Чаты</Text>
      <TouchableOpacity style={styles.iconButton}>
        <Plus size={24} color="#1f2937" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#ffffff",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1f2937",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
});
