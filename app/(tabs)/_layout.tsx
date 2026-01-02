import { useRequestBluetoothPermissions } from "@/shared/hooks/useRequestBluetoothPermissions";
import { BLEServiceInstance } from "@/shared/services/BLEServiceInstance";
import { Tabs } from "expo-router";
import { Bluetooth, MessageCircle, User } from "lucide-react-native";
import { useEffect } from "react";
import { State } from "react-native-ble-plx";
import Toast from "react-native-toast-message";

export default function TabLayout() {
  useRequestBluetoothPermissions();

  useEffect(() => {
    const subscription = BLEServiceInstance.manager.onStateChange((state) => {
      console.log(state);
      if (state === State.PoweredOn) {
        console.log("POWERED ON!");
      }
    }, true);
    return () => subscription.remove();
  }, []);

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#2563eb",
          tabBarInactiveTintColor: "#9ca3af",
          tabBarStyle: {
            backgroundColor: "#ffffff",
            borderTopWidth: 1,
            borderTopColor: "#e5e7eb",
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Чаты",
            tabBarIcon: ({ size, color }) => (
              <MessageCircle size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="devices"
          options={{
            title: "Устройства",
            tabBarIcon: ({ size, color }) => (
              <Bluetooth size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Профиль",
            tabBarIcon: ({ size, color }) => <User size={size} color={color} />,
          }}
        />
      </Tabs>
      <Toast />
    </>
  );
}
