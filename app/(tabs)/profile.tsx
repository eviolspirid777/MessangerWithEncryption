import { ProfileCard } from "@/components/Profile/ProfileCard/ProfileCard";
import { ProfileHeader } from "@/components/Profile/ProfileHeader/ProfileHeader";
import { ProfileLogoutBlock } from "@/components/Profile/ProfileLogoutBlock/ProfileLogoutBlock";
import { ProfileLogoutFooter } from "@/components/Profile/ProfileLogoutFooter/ProfileLogoutFooter";
import { ProfileSettingsBlock } from "@/components/Profile/ProfileSettingsBlock/ui/ProfileSettingsBlock";
import { ProfileStatsCard } from "@/components/Profile/ProfileStatsCard/ProfileStatsCard";
import { ScrollView, StyleSheet, View } from "react-native";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <ProfileHeader />
      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileCard />
        <ProfileStatsCard />
        <ProfileSettingsBlock />
        <ProfileLogoutBlock />
        <ProfileLogoutFooter />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
});
