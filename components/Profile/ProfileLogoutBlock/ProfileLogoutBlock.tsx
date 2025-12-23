import { StyleSheet, Text, TouchableOpacity } from "react-native";

export const ProfileLogoutBlock = () => {
  return (
    <TouchableOpacity style={styles.logoutButton}>
      <Text style={styles.logoutButtonText}>Выйти</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  logoutButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ef4444",
    alignItems: "center",
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ef4444",
  },
});
