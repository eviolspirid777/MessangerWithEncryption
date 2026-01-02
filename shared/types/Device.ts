export type Device = {
  id: string;
  deviceId: string; // Уникальный ID устройства для BLE
  name: string;
  distance: string;
  connected: boolean;
  macAddress?: string; // MAC адрес устройства
  rssi?: number; // Сила сигнала
};
