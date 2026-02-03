import { Chat } from "@/shared/types/Chat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { useBLEDeviceDiscovery } from "./useBLEDeviceDiscovery";

const CHATS_STORAGE_KEY = "@chats_list";

export const useChats = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const { devices } = useBLEDeviceDiscovery();

  // Загружаем чаты из хранилища при монтировании
  useEffect(() => {
    loadChats();
  }, []);

  // Обновляем информацию о чатах на основе найденных устройств и сообщений
  useEffect(() => {
    updateChatsWithDeviceInfo();
  }, [devices]);

  const loadChats = async () => {
    try {
      const storedChats = await AsyncStorage.getItem(CHATS_STORAGE_KEY);
      if (storedChats) {
        const parsedChats = JSON.parse(storedChats);
        setChats(parsedChats);
      }
    } catch (error) {
      console.error("Error loading chats:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveChats = async (newChats: Chat[]) => {
    try {
      await AsyncStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(newChats));
      setChats(newChats);
    } catch (error) {
      console.error("Error saving chats:", error);
    }
  };

  const updateChatsWithDeviceInfo = useCallback(() => {
    setChats((prevChats) => {
      const updatedChats = prevChats.map((chat) => {
        // Ищем устройство по BLE device ID (id чата = BLE device ID)
        const device = devices.find((d) => d.deviceId === chat.id);
        if (device) {
          return {
            ...chat,
            name: device.name || chat.name,
            online: device.connected,
          };
        }
        return chat;
      });
      // Сохраняем обновленные чаты только если они изменились
      const hasChanges = updatedChats.some((chat, index) => {
        const prevChat = prevChats[index];
        return (
          !prevChat ||
          chat.name !== prevChat.name ||
          chat.online !== prevChat.online
        );
      });
      if (hasChanges) {
        AsyncStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(updatedChats));
      }
      return updatedChats;
    });
  }, [devices]);

  const addChat = useCallback(
    async (bleDeviceId: string) => {
      // Проверяем, нет ли уже такого чата
      const existingChat = chats.find((chat) => chat.id === bleDeviceId);
      if (existingChat) {
        return existingChat;
      }

      // Ищем устройство по BLE device ID
      const device = devices.find((d) => d.deviceId === bleDeviceId);

      // Создаем новый чат
      const newChat: Chat = {
        id: bleDeviceId,
        name: device?.name || `Device ${bleDeviceId.substring(0, 8)}`,
        lastMessage: "",
        time: new Date().toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        unread: 0,
        online: device?.connected || false,
      };

      const newChats = [newChat, ...chats];
      await saveChats(newChats);
      return newChat;
    },
    [chats, devices]
  );

  const updateChatLastMessage = useCallback(
    async (chatId: string, message: string) => {
      const updatedChats = chats.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            lastMessage: message,
            time: new Date().toLocaleTimeString("ru-RU", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            unread: chat.unread + 1,
          };
        }
        return chat;
      });
      await saveChats(updatedChats);
    },
    [chats]
  );

  const markChatAsRead = useCallback(
    async (chatId: string) => {
      const updatedChats = chats.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            unread: 0,
          };
        }
        return chat;
      });
      await saveChats(updatedChats);
    },
    [chats]
  );

  const removeChat = useCallback(
    async (chatId: string) => {
      const newChats = chats.filter((chat) => chat.id !== chatId);
      await saveChats(newChats);
    },
    [chats]
  );

  return {
    chats,
    loading,
    addChat,
    updateChatLastMessage,
    markChatAsRead,
    removeChat,
  };
};
