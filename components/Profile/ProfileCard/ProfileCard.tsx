import { User } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const ProfileCard = () => {
  return (
    <View style={styles.profileCard}>
      <View style={styles.avatarLarge}>
        <User size={48} color="#ffffff" />
      </View>
      <Text style={styles.userName}>Вы</Text>
      <Text style={styles.userStatus}>В сети</Text>
      <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editButtonText}>Редактировать профиль</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  profileCard: {
    margin: 20,
    padding: 32,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarLarge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 4,
  },
  userStatus: {
    fontSize: 15,
    color: "#10b981",
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  editButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1f2937",
  },
});
