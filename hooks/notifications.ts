import messaging from '@react-native-firebase/messaging';

// Request permissions on iOS or Android 13+
export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

// Get FCM token
export async function getFcmToken() {
  const token = await messaging().getToken();
  console.log('FCM Token:', token);
  return token;
}

// Subscribe to a topic (like "allUsers")
export function subscribeToTopic(topic: string) {
  messaging().subscribeToTopic(topic)
    .then(() => console.log(`Subscribed to topic: ${topic}`));
}
