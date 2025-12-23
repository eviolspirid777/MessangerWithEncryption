import { MenuItem } from "@/shared/types/MenuItem";
import { Bell, Bluetooth, HelpCircle, Info, Lock } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ProfileSetting } from "../ProfileSetting/ProfileSetting";

const menuItems: MenuItem[] = [
  {
    icon: Bluetooth,
    title: "Bluetooth настройки",
    subtitle: "Видимость и подключения",
  },
  {
    icon: Bell,
    title: "Уведомления",
    subtitle: "Звуки и оповещения",
  },
  {
    icon: Lock,
    title: "Конфиденциальность",
    subtitle: "Безопасность данных",
  },
  {
    icon: HelpCircle,
    title: "Помощь и поддержка",
  },
  {
    icon: Info,
    title: "О приложении",
    subtitle: "Версия 1.0.0",
  },
];

export const ProfileSettingsBlock = () => {
  return (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Настройки</Text>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                index === menuItems.length - 1 && styles.menuItemLast,
              ]}
            >
              <ProfileSetting menuItem={item} />
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
  },
  menuContainer: {
    marginHorizontal: 20,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
});
