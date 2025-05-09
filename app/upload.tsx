import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, TextInput, Image,
  ScrollView, ActivityIndicator, Modal
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import Toast from "react-native-root-toast";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";

export default function UploadScreen() {
  const [images, setImages] = useState<string[]>([]);
  const [tag, setTag] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [showTagOptions, setShowTagOptions] = useState(false);  // 👈 added for tag dropdown modal

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Toast.show("Permission to access gallery is required.", { duration: Toast.durations.SHORT });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      selectionLimit: 5,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const uris = result.assets.map((asset) => asset.uri);
      setImages(uris);
    }
  };

  const handleUpload = async () => {
    if (images.length === 0 || !tag.trim()) {
      Toast.show("Please select images and pick a tag.", { duration: Toast.durations.SHORT });
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      images.forEach((uri, index) => {
        formData.append("images", {
          uri,
          type: "image/jpeg",
          name: `photo_${Date.now()}_${index}.jpg`,
        } as any);
      });

      const response = await fetch(`http://codmprosperyeye.com.ng/pending-upload/${tag}`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        Toast.show("Images uploaded successfully!", { duration: Toast.durations.SHORT });
        setImages([]);
        setTag("");
        setShowDialog(true);
      } else {
        console.log(result);
        Toast.show(result.message || "Upload failed.", { duration: Toast.durations.SHORT });
      }
    } catch (error) {
      console.error(error);
      Toast.show("An error occurred while uploading.", { duration: Toast.durations.SHORT });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 30, backgroundColor: "#121212" }}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={{ flex: 1, textAlign: "center", fontSize: 20, fontWeight: "bold", color: "#fff" }}>
          Upload Your Styles
        </Text>
      </View>

      {/* Image Picker */}
      <TouchableOpacity
        onPress={pickImages}
        style={{
          borderWidth: 2,
          borderColor: "#00c6ff",
          borderRadius: 12,
          padding: 30,
          alignItems: "center",
          marginBottom: 40,
          marginTop: 50,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16, marginBottom: 10 }}>Choose or Pick Your Styles</Text>
        <Text style={{ color: "#aaa", fontSize: 12 }}>Max 5 images</Text>
      </TouchableOpacity>

      {/* Selected Images */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
        {images.map((uri, index) => (
          <Image
            key={index}
            source={{ uri }}
            style={{ width: 80, height: 80, borderRadius: 8, marginRight: 10 }}
          />
        ))}
      </ScrollView>

      {/* Tag Picker */}
      <View style={{ marginBottom: 30 }}>
        <TouchableOpacity
          onPress={() => setShowTagOptions(true)}
          style={{
            borderWidth: 1,
            borderColor: "#333",
            borderRadius: 10,
            padding: 14,
            backgroundColor: "#1e1e1e",
          }}
        >
          <Text style={{ color: tag ? "#fff" : "#777" }}>
            {tag || "Pick Tag"}
          </Text>
        </TouchableOpacity>

        {/* Dropdown Modal */}
        <Modal
          visible={showTagOptions}
          transparent
          animationType="fade"
          onRequestClose={() => setShowTagOptions(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPressOut={() => setShowTagOptions(false)}
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.6)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View style={{
              backgroundColor: "#1e1e1e",
              borderRadius: 12,
              width: 250,
              paddingVertical: 10,
            }}>
              {Array.from({ length: 12 }, (_, i) => {
                const value = `bh${i + 1}`;
                return (
                  <TouchableOpacity
                    key={value}
                    onPress={() => {
                      setTag(value);
                      setShowTagOptions(false);
                    }}
                    style={{
                      paddingVertical: 12,
                      paddingHorizontal: 20,
                      borderBottomWidth: i !== 11 ? 1 : 0,
                      borderBottomColor: "#333",
                    }}
                  >
                    <Text style={{ color: "#fff", fontSize: 16 }}>{value}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </TouchableOpacity>
        </Modal>
      </View>

      {/* Upload Button */}
      <TouchableOpacity
        onPress={handleUpload}
        activeOpacity={0.8}
        disabled={loading || images.length === 0 || images.length > 5}
      >
        <LinearGradient
          colors={["#00c6ff", "#ff7300"]}
          style={{
            padding: 15,
            borderRadius: 10,
            alignItems: "center",
            opacity: loading || images.length === 0 || images.length > 5 ? 0.6 : 1,
            marginBottom: 150,
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>Upload</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>

      {/* 🎉 Lottie Congratulations Modal */}
      <Modal
        visible={showDialog}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDialog(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: 300, backgroundColor: '#1e1e1e', borderRadius: 20, padding: 20, alignItems: 'center' }}>
            <LottieView
              source={require("../assets/json/upload.json")}
              autoPlay
              loop={false}
              style={{ width: 200, height: 200 }}
              onAnimationFinish={() => setShowDialog(false)}
            />
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff', marginTop: 10 }}>Congratulations!</Text>
            <Text style={{ color: '#aaa', textAlign: 'center', marginVertical: 8 }}>
              Your styles have been uploaded successfully.
            </Text>
            <TouchableOpacity
              onPress={() => setShowDialog(false)}
              style={{ marginTop: 10, paddingVertical: 8, paddingHorizontal: 20, borderRadius: 10, backgroundColor: '#00c6ff' }}
            >
              <Text style={{ color: '#fff' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}




// Note: Make sure to replace the URL in the fetch call with your actual endpoint.