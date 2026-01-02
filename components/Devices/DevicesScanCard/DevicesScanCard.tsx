import { Bluetooth, RefreshCw } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useBLEDeviceDiscovery } from "@/shared/hooks/useBLEDeviceDiscovery";

export const DevicesScanCard = () => {
  const { scanning, startScan, stopScan } = useBLEDeviceDiscovery();

  const handleScan = () => {
    if (scanning) {
      stopScan();
    } else {
      startScan();
    }
  };

  return (
    <View style={styles.scanCard}>
      <View style={styles.scanIconContainer}>
        <Bluetooth size={32} color="#2563eb" />
      </View>
      <Text style={styles.scanTitle}>Bluetooth сканирование</Text>
      <Text style={styles.scanDescription}>
        Найдите устройства поблизости для отправки сообщений
      </Text>
      <TouchableOpacity
        style={[styles.scanButton, scanning && styles.scanButtonActive]}
        onPress={handleScan}
        disabled={scanning}
      >
        {scanning ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <>
            <RefreshCw size={20} color="#ffffff" style={styles.buttonIcon} />
            <Text style={styles.scanButtonText}>Сканировать</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  scanCard: {
    margin: 20,
    padding: 24,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  scanIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  scanTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 8,
  },
  scanDescription: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },
  scanButton: {
    flexDirection: "row",
    backgroundColor: "#2563eb",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    minWidth: 160,
    justifyContent: "center",
  },
  scanButtonActive: {
    backgroundColor: "#1e40af",
  },
  buttonIcon: {
    marginRight: 8,
  },
  scanButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
