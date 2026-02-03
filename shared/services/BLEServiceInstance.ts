import { Message } from "@/shared/types/Message";
import { getDeviceId } from "@/shared/utils/deviceId";
import { Alert } from "react-native";
import {
  BleManager,
  Device,
  State,
  Subscription,
} from "react-native-ble-plx";

// UUID для нашего сервиса и характеристик
const MESSAGE_SERVICE_UUID = "12345678-1234-1234-1234-123456789abc";
const MESSAGE_CHARACTERISTIC_UUID = "12345678-1234-1234-1234-123456789abd";
const DEVICE_ID_CHARACTERISTIC_UUID = "12345678-1234-1234-1234-123456789abe";

type MessageCallback = (message: Message) => void;
type DeviceCallback = (device: Device) => void;
type ConnectionCallback = (deviceId: string, connected: boolean) => void;

class BLEService {
  manager: BleManager;
  private deviceId: string;
  private isAdvertising: boolean = false;
  private isScanning: boolean = false;
  private connectedDevices: Map<string, Device> = new Map();
  private messageCallbacks: Set<MessageCallback> = new Set();
  private deviceCallbacks: Set<DeviceCallback> = new Set();
  private connectionCallbacks: Set<ConnectionCallback> = new Set();
  private scanSubscription: Subscription | null = null;
  private processedMessageIds: Set<string> = new Set();
  // Маппинг между BLE device ID и deviceId пользователя
  private bleDeviceIdToUserIdMap: Map<string, string> = new Map();

  constructor() {
    this.manager = new BleManager();
    this.deviceId = getDeviceId();
    this.initialize();
  }

  private async initialize() {
    // Ждем, пока Bluetooth включится
    const state = await this.manager.state();
    if (state === State.PoweredOn) {
      this.startAdvertising();
    } else {
      const subscription = this.manager.onStateChange((state) => {
        if (state === State.PoweredOn) {
          this.startAdvertising();
          subscription.remove();
        }
      }, true);
    }
  }

  /**
   * Начинает рекламировать устройство (peripheral mode)
   */
  async startAdvertising(): Promise<void> {
    if (this.isAdvertising) return;

    try {
      // В react-native-ble-plx нет прямого метода для advertising
      // Вместо этого мы создаем GATT сервер, который автоматически делает устройство видимым
      // Для этого нужно использовать native модули или работать только в central mode
      // Для упрощения, мы будем работать в основном в central mode
      // и использовать подключения для обмена сообщениями
      this.isAdvertising = true;
      console.log("BLE Service: Advertising started");
    } catch (error) {
      console.error("Error starting advertising:", error);
      this.isAdvertising = false;
    }
  }

  /**
   * Останавливает рекламу
   */
  async stopAdvertising(): Promise<void> {
    this.isAdvertising = false;
    console.log("BLE Service: Advertising stopped");
  }

  /**
   * Начинает сканирование устройств (central mode)
   */
  async startScanning(): Promise<void> {
    if (this.isScanning) return;

    try {
      const state = await this.manager.state();
      if (state !== State.PoweredOn) {
        Alert.alert(
          "Bluetooth выключен",
          "Включите Bluetooth на устройстве, чтобы начать сканирование.",
          [{ text: "OK" }]
        );
        console.warn("Bluetooth is not powered on");
        return;
      }

      this.isScanning = true;

      // Сканируем все устройства (null означает сканировать все)
      // В реальном приложении можно фильтровать по имени или другим параметрам
      this.manager.startDeviceScan(
        null, // Сканируем все устройства
        { allowDuplicates: false },
        (error, device) => {
          if (error) {
            console.error("Scan error:", error);
            this.isScanning = false;
            this.manager.stopDeviceScan();
            return;
          }

          if (device) {
            // Уведомляем о найденном устройстве
            this.notifyDeviceFound(device);
            
            // Автоматически подключаемся к найденному устройству
            // В реальном приложении можно добавить фильтрацию по имени или другим параметрам
            // this.connectToDevice(device);
          }
        }
      );

      console.log("BLE Service: Scanning started");
    } catch (error) {
      console.error("Error starting scan:", error);
      this.isScanning = false;
    }
  }

  /**
   * Останавливает сканирование
   */
  async stopScanning(): Promise<void> {
    this.manager.stopDeviceScan();
    this.isScanning = false;
    console.log("BLE Service: Scanning stopped");
  }

  /**
   * Подключается к устройству
   */
  async connectToDevice(device: Device): Promise<void> {
    const deviceId = device.id;

    // Проверяем, не подключены ли мы уже
    if (this.connectedDevices.has(deviceId)) {
      return;
    }

    try {
      const connectedDevice = await device.connect();
      await connectedDevice.discoverAllServicesAndCharacteristics();

      // Сохраняем подключенное устройство
      this.connectedDevices.set(deviceId, connectedDevice);
      this.notifyConnectionChange(deviceId, true);

      // Подписываемся на уведомления о сообщениях
      await this.subscribeToMessages(connectedDevice);

      // Отправляем свой deviceId новому устройству
      await this.sendDeviceId(connectedDevice);

      // Получаем deviceId пользователя от подключенного устройства
      await this.receiveDeviceId(connectedDevice, deviceId);

      console.log(`BLE Service: Connected to device ${deviceId}`);

      // Обрабатываем отключения
      connectedDevice.onDisconnected((error, device) => {
        this.connectedDevices.delete(deviceId);
        this.notifyConnectionChange(deviceId, false);
        console.log(`BLE Service: Disconnected from device ${deviceId}`);
      });
    } catch (error) {
      console.error(`Error connecting to device ${deviceId}:`, error);
      this.connectedDevices.delete(deviceId);
      this.notifyConnectionChange(deviceId, false);
    }
  }

  /**
   * Отключается от устройства
   */
  async disconnectFromDevice(deviceId: string): Promise<void> {
    const device = this.connectedDevices.get(deviceId);
    if (device) {
      try {
        await device.cancelConnection();
        this.connectedDevices.delete(deviceId);
        this.notifyConnectionChange(deviceId, false);
      } catch (error) {
        console.error(`Error disconnecting from device ${deviceId}:`, error);
      }
    }
  }

  /**
   * Подписывается на получение сообщений от устройства
   */
  private async subscribeToMessages(device: Device): Promise<void> {
    try {
      const services = await device.services();
      const service = services.find((s) => s.uuid === MESSAGE_SERVICE_UUID);
      
      if (!service) {
        console.warn("Service not found on device");
        return;
      }

      const characteristics = await service.characteristics();
      const characteristic = characteristics.find(
        (c) => c.uuid === MESSAGE_CHARACTERISTIC_UUID
      );
      
      if (!characteristic) {
        console.warn("Characteristic not found on device");
        return;
      }

      // Подписываемся на уведомления
      characteristic.monitor((error, characteristic) => {
        if (error) {
          console.error("Error monitoring characteristic:", error);
          return;
        }

        if (characteristic?.value) {
          try {
            const messageJson = this.base64ToString(characteristic.value);
            const message: Message = JSON.parse(messageJson);
            this.handleReceivedMessage(message, device.id);
          } catch (error) {
            console.error("Error parsing message:", error);
          }
        }
      });
    } catch (error) {
      console.error("Error subscribing to messages:", error);
    }
  }

  /**
   * Отправляет сообщение всем подключенным устройствам
   */
  async sendMessage(message: Message): Promise<void> {
    const messageJson = JSON.stringify(message);
    const messageBase64 = this.stringToBase64(messageJson);

    const promises: Promise<void>[] = [];

    for (const [deviceId, device] of this.connectedDevices.entries()) {
      promises.push(
        this.sendMessageToDevice(device, messageBase64).catch((error) => {
          console.error(`Error sending message to device ${deviceId}:`, error);
        })
      );
    }

    await Promise.all(promises);
  }

  /**
   * Отправляет сообщение конкретному устройству
   */
  private async sendMessageToDevice(
    device: Device,
    messageBase64: string
  ): Promise<void> {
    try {
      const services = await device.services();
      const service = services.find((s) => s.uuid === MESSAGE_SERVICE_UUID);
      
      if (!service) {
        throw new Error("Service not found");
      }

      const characteristics = await service.characteristics();
      const characteristic = characteristics.find(
        (c) => c.uuid === MESSAGE_CHARACTERISTIC_UUID
      );
      
      if (!characteristic) {
        throw new Error("Characteristic not found");
      }

      await characteristic.writeWithResponse(messageBase64);
    } catch (error) {
      console.error("Error sending message to device:", error);
      throw error;
    }
  }

  /**
   * Отправляет свой deviceId устройству
   */
  private async sendDeviceId(device: Device): Promise<void> {
    try {
      const services = await device.services();
      const service = services.find((s) => s.uuid === MESSAGE_SERVICE_UUID);
      
      if (!service) {
        return;
      }

      const characteristics = await service.characteristics();
      const characteristic = characteristics.find(
        (c) => c.uuid === DEVICE_ID_CHARACTERISTIC_UUID
      );
      
      if (!characteristic) {
        return;
      }

      const deviceIdBase64 = this.stringToBase64(this.deviceId);
      await characteristic.writeWithResponse(deviceIdBase64);
    } catch (error) {
      console.error("Error sending device ID:", error);
    }
  }

  /**
   * Получает deviceId пользователя от подключенного устройства
   * и сохраняет маппинг между BLE device ID и deviceId пользователя
   */
  private async receiveDeviceId(device: Device, bleDeviceId: string): Promise<void> {
    try {
      const services = await device.services();
      const service = services.find((s) => s.uuid === MESSAGE_SERVICE_UUID);
      
      if (!service) {
        return;
      }

      const characteristics = await service.characteristics();
      const characteristic = characteristics.find(
        (c) => c.uuid === DEVICE_ID_CHARACTERISTIC_UUID
      );
      
      if (!characteristic) {
        return;
      }

      // Читаем deviceId пользователя от устройства
      const characteristicValue = await characteristic.read();
      if (characteristicValue?.value) {
        const userDeviceId = this.base64ToString(characteristicValue.value);
        // Сохраняем маппинг: BLE device ID -> deviceId пользователя
        this.bleDeviceIdToUserIdMap.set(bleDeviceId, userDeviceId);
        console.log(`BLE Service: Mapped BLE device ${bleDeviceId} to user deviceId ${userDeviceId}`);
      }
    } catch (error) {
      console.error("Error receiving device ID:", error);
    }
  }

  /**
   * Обрабатывает полученное сообщение
   */
  private handleReceivedMessage(message: Message, senderDeviceId: string): void {
    // Проверяем, не обрабатывали ли мы уже это сообщение
    if (this.processedMessageIds.has(message.id)) {
      return;
    }

    // Помечаем сообщение как обработанное
    this.processedMessageIds.add(message.id);

    // Очищаем старые ID (оставляем последние 1000)
    if (this.processedMessageIds.size > 1000) {
      const firstId = this.processedMessageIds.values().next().value;
      this.processedMessageIds.delete(firstId);
    }

    // Проверяем, для нас ли сообщение:
    // 1. По deviceId пользователя (генерируется через getDeviceId)
    // 2. По BLE device ID (ID устройства в Bluetooth сети)
    // 3. Broadcast сообщения
    const isForThisDevice =
      message.receiverId === this.deviceId ||
      message.receiverId === "broadcast" ||
      this.isMessageForThisBLEDevice(message.receiverId);

    // Если сообщение не для нас — просто ретранслируем дальше по сети
    if (!isForThisDevice) {
      this.relayMessage(message, senderDeviceId);
      return;
    }

    // Сообщение адресовано нам (или это broadcast) — показываем в приложении
    this.notifyMessageReceived(message);

    // Если это broadcast, продолжим ретранслировать его дальше
    if (message.receiverId === "broadcast") {
      this.relayMessage(message, senderDeviceId);
    }
  }

  /**
   * Проверяет, является ли receiverId BLE device ID текущего устройства
   * В децентрализованной сети сообщения могут маршрутизироваться по BLE device ID
   */
  private isMessageForThisBLEDevice(receiverId: string): boolean {
    // Проверяем маппинг: если receiverId является BLE device ID,
    // и мы знаем, что этот BLE device ID соответствует нашему deviceId пользователя,
    // то сообщение для нас
    const mappedUserId = this.bleDeviceIdToUserIdMap.get(receiverId);
    if (mappedUserId && mappedUserId === this.deviceId) {
      return true;
    }

    // Также проверяем обратный маппинг: если receiverId является deviceId пользователя,
    // и мы знаем BLE device ID, который соответствует этому deviceId
    for (const [bleDeviceId, userId] of this.bleDeviceIdToUserIdMap.entries()) {
      if (userId === receiverId && this.isOurBLEDeviceId(bleDeviceId)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Проверяет, является ли указанный BLE device ID нашим собственным
   * В текущей реализации мы не можем напрямую определить наш BLE device ID,
   * но можем использовать эвристику: если это один из подключенных устройств,
   * и мы знаем, что он соответствует нашему deviceId
   */
  private isOurBLEDeviceId(bleDeviceId: string): boolean {
    // В идеале нужно получить наш собственный BLE device ID от системы
    // Пока что возвращаем false, так как мы не можем напрямую определить это
    // Система будет работать через ретрансляцию и проверку deviceId пользователя
    return false;
  }

  /**
   * Ретранслирует сообщение другим подключенным устройствам
   */
  private async relayMessage(
    message: Message,
    senderDeviceId: string
  ): Promise<void> {
    // Создаем ретранслированное сообщение
    const relayMessage: Message = {
      ...message,
      type: "relay",
    };

    // Отправляем всем подключенным устройствам, кроме отправителя
    const promises: Promise<void>[] = [];

    for (const [deviceId, device] of this.connectedDevices.entries()) {
      if (deviceId !== senderDeviceId) {
        const messageJson = JSON.stringify(relayMessage);
        const messageBase64 = this.stringToBase64(messageJson);
        promises.push(
          this.sendMessageToDevice(device, messageBase64).catch((error) => {
            console.error(`Error relaying message to device ${deviceId}:`, error);
          })
        );
      }
    }

    await Promise.all(promises);
  }

  /**
   * Подписывается на получение сообщений
   */
  onMessage(callback: MessageCallback): () => void {
    this.messageCallbacks.add(callback);
    return () => {
      this.messageCallbacks.delete(callback);
    };
  }

  /**
   * Подписывается на обнаружение устройств
   */
  onDeviceFound(callback: DeviceCallback): () => void {
    this.deviceCallbacks.add(callback);
    return () => {
      this.deviceCallbacks.delete(callback);
    };
  }

  /**
   * Подписывается на изменения подключений
   */
  onConnectionChange(callback: ConnectionCallback): () => void {
    this.connectionCallbacks.add(callback);
    return () => {
      this.connectionCallbacks.delete(callback);
    };
  }

  /**
   * Получает список подключенных устройств
   */
  getConnectedDevices(): Device[] {
    return Array.from(this.connectedDevices.values());
  }

  /**
   * Получает deviceId текущего устройства
   */
  getDeviceId(): string {
    return this.deviceId;
  }

  /**
   * Проверяет, идет ли сканирование
   */
  isScanningActive(): boolean {
    return this.isScanning;
  }

  /**
   * Проверяет, идет ли реклама
   */
  isAdvertisingActive(): boolean {
    return this.isAdvertising;
  }

  // Уведомления
  private notifyMessageReceived(message: Message): void {
    this.messageCallbacks.forEach((callback) => {
      try {
        callback(message);
      } catch (error) {
        console.error("Error in message callback:", error);
      }
    });
  }

  private notifyDeviceFound(device: Device): void {
    this.deviceCallbacks.forEach((callback) => {
      try {
        callback(device);
      } catch (error) {
        console.error("Error in device callback:", error);
      }
    });
  }

  private notifyConnectionChange(deviceId: string, connected: boolean): void {
    this.connectionCallbacks.forEach((callback) => {
      try {
        callback(deviceId, connected);
      } catch (error) {
        console.error("Error in connection callback:", error);
      }
    });
  }

  // Утилиты для работы с base64
  private stringToBase64(str: string): string {
    // Используем встроенные функции для base64
    // btoa работает с Latin1, поэтому сначала кодируем в UTF-8
    try {
      return btoa(
        encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
          return String.fromCharCode(parseInt(p1, 16));
        })
      );
    } catch (error) {
      // Fallback для простых ASCII строк
      return btoa(str);
    }
  }

  private base64ToString(base64: string): string {
    try {
      return decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
    } catch (error) {
      // Fallback для простых ASCII строк
      return atob(base64);
    }
  }

  /**
   * Очистка ресурсов
   */
  async cleanup(): Promise<void> {
    await this.stopScanning();
    await this.stopAdvertising();

    // Отключаемся от всех устройств
    const disconnectPromises = Array.from(this.connectedDevices.keys()).map(
      (deviceId) => this.disconnectFromDevice(deviceId)
    );
    await Promise.all(disconnectPromises);

    this.messageCallbacks.clear();
    this.deviceCallbacks.clear();
    this.connectionCallbacks.clear();
  }
}

export const BLEServiceInstance = new BLEService();
