import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import InAppReview from "react-native-in-app-review";

export default function RateUsScreen() {
  const router = useRouter();

  const onContinue = async () => {
    if (InAppReview.isAvailable()) {
      InAppReview.RequestInAppReview();
    } else {
      console.log("In-app review not available");
    }

    await AsyncStorage.setItem("hasRated", "true");

    setTimeout(() => {
      router.replace("/home");
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Help Us Grow</Text>

        <View style={styles.card}>
          <View style={styles.userRow}>
            <Image
              source={require("../assets/images/a10.jpg")}
              style={styles.avatar}
            />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.username}>Wade Warren</Text>
              <View style={{ flexDirection: "row" }}>
                {[...Array(5)].map((_, i) => (
                  <Text key={i} style={styles.star}>
                    ★
                  </Text>
                ))}
              </View>
            </View>
          </View>

          <Text style={styles.reviewText}>
            I find this app highly motivating for improving my fashion skills, also helped me promote my own designs
            and its functionality is fantastic! I'm thrilled with my initial
            progress.
          </Text>

          <View style={styles.imageContainer}>
            <Image
              source={require("../assets/images/a12.jpg")}
              style={styles.reviewImage}
            />
          </View>
        </View>

        <Text style={styles.bottomText}>
          Help us improve the app by leaving us a review in the Google Play
          Store
        </Text>

        <TouchableOpacity style={styles.button} onPress={onContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginVertical: 20,
  },
  card: {
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    padding: 14,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  username: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#FFFFFF",
  },
  star: {
    color: "#FFD700",
    fontSize: 16,
    marginRight: 2,
  },
  reviewText: {
    fontSize: 13,
    color: "#CCCCCC",
    marginVertical: 12,
  },
  imageContainer: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
    height: 290,
  },
  reviewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  bottomText: {
    fontSize: 14,
    color: "#FFFFFF",
    textAlign: "center",
    marginVertical: 20,
  },
  button: {
    height: 50,
    backgroundColor: "#FFD700",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
});
