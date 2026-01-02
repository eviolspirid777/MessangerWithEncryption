import { Device } from "@/shared/types/Device";
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import { DeviceItem } from "../DeviceItem/DeviceItem";
import { useBLEDeviceDiscovery } from "@/shared/hooks/useBLEDeviceDiscovery";
import { useBLEConnection } from "@/shared/hooks/useBLEConnection";

export const DevicesMain = () => {
  const { devices, getBLEDevice } = useBLEDeviceDiscovery();
  const { connect, disconnect, isConnected } = useBLEConnection();

  const handleDevicePress = async (device: Device) => {
    try {
      if (isConnected(device.id)) {
        await disconnect(device.id);
      } else {
        const bleDevice = getBLEDevice(device.id);
        if (bleDevice) {
          await connect(bleDevice);
        } else {
          console.warn("Device not found, please scan first");
        }
      }
    } catch (error) {
      console.error("Error toggling device connection:", error);
    }
  };

  return (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Доступные устройства</Text>
        <Text style={styles.sectionSubtitle}>
          {devices.length} {devices.length === 1 ? "устройство" : "устройства"}
          найдено
        </Text>
      </View>

      <ScrollView
        style={styles.deviceList}
        showsVerticalScrollIndicator={false}
      >
        {devices.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Устройства не найдены. Нажмите "Сканировать" для поиска.
            </Text>
          </View>
        ) : (
          devices.map((device) => (
            <TouchableOpacity
              key={device.id}
              style={styles.deviceItem}
              onPress={() => handleDevicePress(device)}
            >
              <DeviceItem deviceItem={device} />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  deviceList: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyStateText: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
  },
  deviceItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
});
