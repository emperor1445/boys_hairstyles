import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      manageSplashScreen();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const manageSplashScreen = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem("hasLaunched"); {
        if(hasLaunched === "true") {
        // First launch
        await AsyncStorage.setItem("hasLaunched", "true");
        router.replace("/onboarding");
      } 
      else {
        router.replace("/onboarding");
      }
    }  
    } catch (error) {
      console.error("Error checking launch status:", error);
      router.replace("/home"); // fallback
    }
  };



  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/a1.jpg")}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
