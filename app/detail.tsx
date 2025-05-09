import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import * as StoreReview from "expo-store-review";
import { Animated, Easing } from "react-native";

interface ImageData {
  id: number;
  originalName: string;
  fileName: string;
  url: string;
  uploadTime: string;
}

// Inside your component
const likeScale = new Animated.Value(1);

const handleLikePress = () => {
  Animated.sequence([
    Animated.timing(likeScale, {
      toValue: 1.4,
      duration: 150,
      easing: Easing.ease,
      useNativeDriver: true,
    }),
    Animated.timing(likeScale, {
      toValue: 1,
      duration: 150,
      easing: Easing.ease,
      useNativeDriver: true,
    }),
  ]).start();
};

export default function DetailPage() {
  const { title, tag } = useLocalSearchParams(); // Retrieving 'tag' passed from the previous page
  const navigation = useNavigation();
  const router = useRouter();
  const [adLoaded, setAdLoaded] = useState(false);
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Error state

  const [hasReviewed, setHasReviewed] = useState(false);

  const handleReview = async () => {
    if (!hasReviewed && (await StoreReview.isAvailableAsync())) {
      await StoreReview.requestReview();
      setHasReviewed(true); // Update state to prevent multiple prompts
    }
  };


  // Fetch images when the 'tag' parameter changes
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true); // Set loading state to true while fetching image
      try {
        const response = await fetch(
          `https://codmprosperyeye.com.ng/image/${tag}`
        );
        const data = await response.json();

        if (Array.isArray(data.images) && data.images.length > 0) {
          setImages(data.images);
          setError(null); // Reset error state on success
        } else {
          setImages([]);
          setError("No images found for this tag.");
        }
      } catch (error) {
        console.error("Error fetching images:", error);
        setError("Failed to fetch images. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [tag]); // Trigger this effect whenever 'tag' changes

  // Handle the back navigation and show the ad scoped to this page
  useEffect(() => {
    const backAction = () => {
      // Show the interstitial ad when back button is pressed

      navigation.goBack(); // Navigate back if ad is not loaded

      return true; // Prevent default back action
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []); // This effect runs once when the component is mounted

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
    );
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header with Back Button */}
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 30,}}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={"#fff"}/>
        </TouchableOpacity>
        <Text
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 20,
            fontWeight: "bold",
            color: "#fff",
          }}
        >
          {title}
        </Text>
      </View>

      {images.length > 0 ? (
        images.map((item) => (
          <View key={item.id} style={styles.card}>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/download",
                  params: {
                    index: item.id.toString(),
                    title: title || "Image",
                    style: "Style description", // You can customize this style
                    imageUrl: item.url, // Passing the image URL from API
                    originalName: item.originalName, // Passing the image name from API
                  },
                })
              }
            >
              <Image
                source={{ uri: item.url }}
                style={styles.image}
                resizeMode="stretch"
              />
            </TouchableOpacity>

            <View style={styles.textContainer}>
              <Text style={styles.imageTitle}>{title}</Text>
              <Text style={styles.imageStyle}>See more...</Text>
            </View>
            <View style={styles.likeContainer}>
              <TouchableOpacity onPress={handleLikePress}>
                <Animated.View style={{ transform: [{ scale: likeScale }] }}>
                  <FontAwesome name="heart" size={24} color="tomato" />
                </Animated.View>
              </TouchableOpacity>
              <Text style={styles.likeCountText}>1.2k</Text>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.noImagesText}>
          No images available under this tag.
        </Text> // Show this if no images are found
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
  },
  card: {
    backgroundColor: "#1e1e1e",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 25,
    overflow: "hidden",
    width: "100%",
    paddingBottom: 10,
  },
  image: {
    width: "100%",
    height: 380,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  textContainer: {
    padding: 15,
    backgroundColor: "#1e1e1e",
  },
  imageTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  imageStyle: {
    fontSize: 14,
    color: "#cccccc",
    marginTop: 6,
  },
  iconContainer: {
    position: "absolute",
    bottom: 15,
    right: 15,
    padding: 5,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  noImagesText: {
    textAlign: "center",
    fontSize: 16,
    color: "#aaaaaa",
    marginTop: 20,
  },
  errorText: {
    textAlign: "center",
    fontSize: 16,
    color: "#ff4c4c",
    marginTop: 20,
  },
  likeCountText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#dddddd",
  },
  likeContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#2a2a2a",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
});
