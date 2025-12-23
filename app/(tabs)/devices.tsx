import { DevicesHeader } from "@/components/Devices/DevicesHeader/DevicesHeader";
import { DevicesMain } from "@/components/Devices/DevicesMain/ui/DevicesMain";
import { DevicesScanCard } from "@/components/Devices/DevicesScanCard/DevicesScanCard";
import { StyleSheet, View } from "react-native";

export default function DevicesScreen() {
  return (
    <View style={styles.container}>
      <DevicesHeader />
      <DevicesScanCard />
      <DevicesMain />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
});
