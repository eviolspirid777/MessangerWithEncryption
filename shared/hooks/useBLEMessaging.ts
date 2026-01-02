import { useState, useEffect, useCallback } from "react";
import { Message } from "@/shared/types/Message";
import { BLEServiceInstance } from "@/shared/services/BLEServiceInstance";
import { getDeviceId } from "@/shared/utils/deviceId";

export const useBLEMessaging = (targetDeviceId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sending, setSending] = useState(false);

  // Обработчик полученных сообщений
  useEffect(() => {
    const currentDeviceId = getDeviceId();
    const unsubscribe = BLEServiceInstance.onMessage((message) => {
      // Игнорируем собственные сообщения (они уже добавлены при отправке)
      if (message.senderId === currentDeviceId) {
        return;
      }

      // Если указан targetDeviceId, фильтруем сообщения
      if (targetDeviceId) {
        // Принимаем сообщения от целевого устройства или broadcast сообщения
        if (
          message.senderId === targetDeviceId ||
          message.receiverId === "broadcast"
        ) {
          setMessages((prev) => {
            // Проверяем, нет ли уже такого сообщения
            if (prev.some((m) => m.id === message.id)) {
              return prev;
            }
            return [...prev, message];
          });
        }
      } else {
        // Принимаем все сообщения (broadcast режим)
        setMessages((prev) => {
          // Проверяем, нет ли уже такого сообщения
          if (prev.some((m) => m.id === message.id)) {
            return prev;
          }
          return [...prev, message];
        });
      }
    });

    return unsubscribe;
  }, [targetDeviceId]);

  // Отправить сообщение
  const sendMessage = useCallback(
    async (text: string, receiverId: string = "broadcast") => {
      if (!text.trim()) {
        return;
      }

      setSending(true);

      try {
        const message: Message = {
          id: `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
          senderId: getDeviceId(),
          receiverId: receiverId,
          text: text.trim(),
          timestamp: Date.now(),
          type: "direct",
        };

        // Добавляем сообщение в локальный список сразу
        setMessages((prev) => [...prev, message]);

        // Отправляем через BLE
        await BLEServiceInstance.sendMessage(message);
      } catch (error) {
        console.error("Error sending message:", error);
        // Можно добавить обработку ошибок, например, удалить сообщение из списка
      } finally {
        setSending(false);
      }
    },
    []
  );

  // Очистить сообщения
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    sendMessage,
    sending,
    clearMessages,
  };
};

