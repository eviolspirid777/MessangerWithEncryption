import { StyleSheet, Text, View } from "react-native";

export const ProfileLogoutFooter = () => {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>Bluetooth Messenger © 2025</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 13,
    color: "#9ca3af",
  },
});
