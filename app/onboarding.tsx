import React, { useRef } from "react";
import { View, StyleSheet, Dimensions, FlatList } from "react-native";
import { useOnboarding } from "../hooks/useOnboarding";
import { Colors } from "../utils/colors";
import AppButton from "../components/AppButton";
import AppImage from "../components/AppImage";
import AppText from "../components/AppText";

export const screenOptions = {
  headerShown: false,
};

const { width, height } = Dimensions.get("window");

const onboardingData = [
  {
    image: require("../assets/images/a2.jpg"),
    title: "Welcome to Boys Hairstyles",
    description:
      "Discover the latest and trending hairstyles and haircut fashions — from fades to locks, right at your fingertips.",
  },
  {
    image: require("../assets/images/a3.jpg"),
    title: "Inspire Your Next Look",
    description:
      "Browse and save thousands of fresh fashion inspirations for every occasion. Stay sharp, stay trendy, stay original.",
  },
  {
    image: require("../assets/images/a9.jpg"),
    title: "Feature Your Style",
    description:
      "Showcase, promote, and advertise your own designs to thousands of fashion-forward users. Join the movement, stand out, and grow your brand with us.",
  },
];

export default function OnboardingScreen() {
  const flatListRef = useRef<FlatList>(null);
  const { currentPage, setCurrentPage, handleNext, resetAutoSlide } = useOnboarding(flatListRef, onboardingData.length);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentPage(index);
          resetAutoSlide();
        }}
        renderItem={({ item }) => (
          <View style={styles.page}>
            <AppImage source={item.image} style={styles.image} />
            <View style={styles.textContainer}>
              <AppText style={styles.title}>{item.title}</AppText>
              <AppText style={styles.description}>{item.description}</AppText>
            </View>
          </View>
        )}
      />

      {/* Page Indicators */}
      <View style={styles.indicatorContainer}>
        {onboardingData.map((_, i) => (
          <View
            key={i}
            style={[
              styles.indicator,
              {
                backgroundColor: currentPage === i
                  ? Colors.electricOrange
                  : Colors.appGrey,
              },
            ]}
          />
        ))}
      </View>

      {/* Next / Get Started Button */}
      <AppButton
        title={currentPage === onboardingData.length - 1 ? "Let's Get Started" : "Next"}
        onPress={handleNext}
        style={styles.button}
        textStyle={styles.buttonText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.appBackground, // themed background
  },
  page: {
    width,
    alignItems: "center",
  },
  image: {
    width,
    height: height * 0.6,
  },
  textContainer: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: Colors.white,
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: Colors.appGrey,
    lineHeight: 22,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  indicator: {
    height: 12,
    width: 12,
    borderRadius: 6,
    marginHorizontal: 6,
  },
  button: {
    marginVertical: 20,
    backgroundColor: Colors.electricOrange,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});
