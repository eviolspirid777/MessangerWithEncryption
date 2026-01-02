import { useState, useEffect, useCallback } from "react";
import { Device } from "react-native-ble-plx";
import { BLEServiceInstance } from "@/shared/services/BLEServiceInstance";

export const useBLEConnection = () => {
  const [connectedDevices, setConnectedDevices] = useState<Device[]>([]);

  // Обновляет список подключенных устройств
  const updateConnectedDevices = useCallback(() => {
    const devices = BLEServiceInstance.getConnectedDevices();
    setConnectedDevices(devices);
  }, []);

  // Обработчик изменений подключений
  useEffect(() => {
    // Инициализируем список подключенных устройств
    updateConnectedDevices();

    const unsubscribe = BLEServiceInstance.onConnectionChange(
      (deviceId, connected) => {
        updateConnectedDevices();
      }
    );

    return unsubscribe;
  }, [updateConnectedDevices]);

  // Подключиться к устройству
  const connect = useCallback(
    async (device: Device) => {
      try {
        await BLEServiceInstance.connectToDevice(device);
        updateConnectedDevices();
      } catch (error) {
        console.error("Error connecting to device:", error);
        throw error;
      }
    },
    [updateConnectedDevices]
  );

  // Отключиться от устройства
  const disconnect = useCallback(
    async (deviceId: string) => {
      try {
        await BLEServiceInstance.disconnectFromDevice(deviceId);
        updateConnectedDevices();
      } catch (error) {
        console.error("Error disconnecting from device:", error);
        throw error;
      }
    },
    [updateConnectedDevices]
  );

  // Проверить, подключено ли устройство
  const isConnected = useCallback(
    (deviceId: string): boolean => {
      return connectedDevices.some((d) => d.id === deviceId);
    },
    [connectedDevices]
  );

  return {
    connectedDevices,
    connect,
    disconnect,
    isConnected,
  };
};

