import { useState, useEffect, useCallback } from "react";
import { Device } from "react-native-ble-plx";
import { BLEServiceInstance } from "@/shared/services/BLEServiceInstance";
import { Device as AppDevice } from "@/shared/types/Device";

export const useBLEDeviceDiscovery = () => {
  const [devices, setDevices] = useState<AppDevice[]>([]);
  const [scanning, setScanning] = useState(false);
  // Храним маппинг между deviceId и BLEDevice
  const [bleDeviceMap, setBleDeviceMap] = useState<Map<string, Device>>(
    new Map()
  );

  // Преобразует BLE Device в AppDevice
  const convertToAppDevice = useCallback((bleDevice: Device): AppDevice => {
    return {
      id: bleDevice.id,
      deviceId: bleDevice.id, // Используем BLE ID как deviceId
      name: bleDevice.name || `Device ${bleDevice.id.substring(0, 8)}`,
      distance: bleDevice.rssi
        ? `${Math.abs(bleDevice.rssi)} dBm`
        : "Unknown",
      connected: BLEServiceInstance
        .getConnectedDevices()
        .some((d) => d.id === bleDevice.id),
      macAddress: bleDevice.id,
      rssi: bleDevice.rssi || undefined,
    };
  }, []);

  // Обработчик найденных устройств
  useEffect(() => {
    const unsubscribe = BLEServiceInstance.onDeviceFound((bleDevice) => {
      // Сохраняем BLEDevice в маппинг
      setBleDeviceMap((prev) => {
        const newMap = new Map(prev);
        newMap.set(bleDevice.id, bleDevice);
        return newMap;
      });

      setDevices((prevDevices) => {
        // Проверяем, нет ли уже такого устройства
        const existingIndex = prevDevices.findIndex(
          (d) => d.id === bleDevice.id
        );

        const appDevice = convertToAppDevice(bleDevice);

        if (existingIndex >= 0) {
          // Обновляем существующее устройство
          const updated = [...prevDevices];
          updated[existingIndex] = appDevice;
          return updated;
        } else {
          // Добавляем новое устройство
          return [...prevDevices, appDevice];
        }
      });
    });

    return unsubscribe;
  }, [convertToAppDevice]);

  // Обработчик изменений подключений
  useEffect(() => {
    const unsubscribe = BLEServiceInstance.onConnectionChange(
      (deviceId, connected) => {
        setDevices((prevDevices) =>
          prevDevices.map((device) =>
            device.id === deviceId ? { ...device, connected } : device
          )
        );
      }
    );

    return unsubscribe;
  }, []);

  // Начать сканирование
  const startScan = useCallback(async () => {
    try {
      setScanning(true);
      await BLEServiceInstance.startScanning();
    } catch (error) {
      console.error("Error starting scan:", error);
      setScanning(false);
    }
  }, []);

  // Остановить сканирование
  const stopScan = useCallback(async () => {
    try {
      await BLEServiceInstance.stopScanning();
      setScanning(false);
    } catch (error) {
      console.error("Error stopping scan:", error);
    }
  }, []);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      stopScan();
    };
  }, [stopScan]);

  // Получить BLEDevice по deviceId
  const getBLEDevice = useCallback(
    (deviceId: string): Device | undefined => {
      return bleDeviceMap.get(deviceId);
    },
    [bleDeviceMap]
  );

  return {
    devices,
    scanning,
    startScan,
    stopScan,
    getBLEDevice,
  };
};

