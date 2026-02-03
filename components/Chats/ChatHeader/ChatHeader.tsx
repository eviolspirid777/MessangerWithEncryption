import { useChats } from "@/shared/hooks/useChats";
import { useRouter } from "expo-router";
import { Plus } from "lucide-react-native";
import { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export const ChatHeader = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [deviceIdInput, setDeviceIdInput] = useState("");
  const router = useRouter();
  const { addChat } = useChats();

  const handleCreateChat = async () => {
    const trimmedId = deviceIdInput.trim();
    
    if (!trimmedId) {
      Alert.alert("Ошибка", "Введите BLE device ID");
      return;
    }

    // Валидация формата BLE device ID (обычно это UUID или MAC адрес)
    // BLE device ID может быть в формате UUID или MAC адреса
    const isValidFormat = 
      /^[0-9A-Fa-f]{2}(:[0-9A-Fa-f]{2}){5}$/.test(trimmedId) || // MAC формат
      /^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$/i.test(trimmedId) || // UUID формат
      trimmedId.length >= 8; // Минимальная длина для других форматов

    if (!isValidFormat) {
      Alert.alert(
        "Ошибка",
        "Неверный формат BLE device ID. Используйте UUID или MAC адрес."
      );
      return;
    }

    try {
      // Добавляем чат в список
      await addChat(trimmedId);
      
      // Закрываем модальное окно и переходим к чату
      setModalVisible(false);
      setDeviceIdInput("");
      router.push(`/chat/${trimmedId}`);
    } catch (error) {
      console.error("Error creating chat:", error);
      Alert.alert("Ошибка", "Не удалось создать чат");
    }
  };

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Чаты</Text>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setModalVisible(true)}
        >
          <Plus size={24} color="#1f2937" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        transparent={false}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Создать новый чат</Text>
            <Text style={styles.modalSubtitle}>
              Введите BLE device ID пользователя
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="BLE device ID (UUID или MAC)"
              placeholderTextColor="#9ca3af"
              value={deviceIdInput}
              onChangeText={setDeviceIdInput}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setDeviceIdInput("");
                }}
              >
                <Text style={styles.cancelButtonText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.createButton]}
                onPress={handleCreateChat}
              >
                <Text style={styles.createButtonText}>Создать чат</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
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
  modalOverlay: {
    width: "100%",
    minHeight: 90,
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    width: "85%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1f2937",
    backgroundColor: "#f9fafb",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f3f4f6",
  },
  createButton: {
    backgroundColor: "#2563eb",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
});
