import { MenuItem } from "@/shared/types/MenuItem";
import { ChevronRight } from "lucide-react-native";
import { FC } from "react";
import { StyleSheet, Text, View } from "react-native";

type ProfileSettingProps = {
  menuItem: MenuItem;
};

export const ProfileSetting: FC<ProfileSettingProps> = ({ menuItem }) => {
  const Icon = menuItem.icon;

  return (
    <>
      <View style={styles.menuIconContainer}>
        <Icon size={22} color="#2563eb" />
      </View>
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{menuItem.title}</Text>
        {menuItem.subtitle && (
          <Text style={styles.menuSubtitle}>{menuItem.subtitle}</Text>
        )}
      </View>
      <ChevronRight size={20} color="#9ca3af" />
    </>
  );
};

const styles = StyleSheet.create({
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 13,
    color: "#6b7280",
  },
});
