import { Search } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

export const ChatSearchBlock = () => {
  return (
    <View style={styles.searchContainer}>
      <Search size={20} color="#9ca3af" style={styles.searchIcon} />
      <Text style={styles.searchPlaceholder}>Поиск чатов...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchPlaceholder: {
    fontSize: 16,
    color: "#9ca3af",
  },
});
