import { StyleSheet, Text, View } from "react-native";

export const ProfileHeader = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Профиль</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
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
});
