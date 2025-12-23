import { Device } from "@/shared/types/Device";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { DeviceItem } from "../DeviceItem/DeviceItem";

const mockDevices: Device[] = [
  { id: "1", name: "iPhone Андрей", distance: "2m", connected: true },
  { id: "2", name: "Samsung Мария", distance: "5m", connected: false },
  { id: "3", name: "Pixel Дмитрий", distance: "10m", connected: false },
];

export const DevicesMain = () => {
  const [devices, setDevices] = useState<Device[]>(mockDevices);

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
        {devices.map((device) => (
          <TouchableOpacity key={device.id} style={styles.deviceItem}>
            <DeviceItem deviceItem={device} />
          </TouchableOpacity>
        ))}
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
