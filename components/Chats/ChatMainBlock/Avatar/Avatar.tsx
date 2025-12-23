import { FC } from "react";
import { StyleSheet, Text, View } from "react-native";

type AvatarProps = {
  chatLogoLetter: string;
  online: boolean;
};

export const Avatar: FC<AvatarProps> = ({ chatLogoLetter, online }) => {
  return (
    <View style={styles.avatarContainer}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{chatLogoLetter}</Text>
      </View>
      {online && <View style={styles.onlineIndicator} />}
    </View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ffffff",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#10b981",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
});
