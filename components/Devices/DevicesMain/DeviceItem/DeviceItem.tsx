import { Device } from "@/shared/types/Device";
import { Smartphone } from "lucide-react-native";
import { FC } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type DeviceItemProps = {
  deviceItem: Device;
};

export const DeviceItem: FC<DeviceItemProps> = ({ deviceItem }) => {
  return (
    <>
      <View style={styles.deviceIconContainer}>
        <Smartphone size={24} color="#2563eb" />
      </View>
      <View style={styles.deviceContent}>
        <Text style={styles.deviceName}>{deviceItem.name}</Text>
        <Text style={styles.deviceDistance}>
          Расстояние: {deviceItem.distance}
        </Text>
      </View>
      {deviceItem.connected ? (
        <View style={styles.connectedBadge}>
          <Text style={styles.connectedText}>Подключено</Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.connectButton}>
          <Text style={styles.connectButtonText}>Подключить</Text>
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  deviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  deviceContent: {
    flex: 1,
  },
  deviceName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  deviceDistance: {
    fontSize: 14,
    color: "#6b7280",
  },
  connectedBadge: {
    backgroundColor: "#d1fae5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  connectedText: {
    color: "#059669",
    fontSize: 13,
    fontWeight: "600",
  },
  connectButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  connectButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});
