import { Stack } from "expo-router";
import { useEffect } from "react";
import { requestUserPermission, getFcmToken, subscribeToTopic } from "../hooks/notifications";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  useEffect(() => {
    AsyncStorage.clear(); // Remove this before production

    // Request permission for notifications
    requestUserPermission();

    // Get the device's FCM token
    getFcmToken();

    // Subscribe the user to the 'allUsers' topic
    subscribeToTopic("allUsers");
  }, []);

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Men", headerShown: false }}
      />
    </Stack>
  );
}
