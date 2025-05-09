import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, BackHandler, Modal, PermissionsAndroid, Platform } from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import * as MediaLibrary from "expo-media-library";


type BookmarkedImage = {
  imageUrl: string;
  title: string;
};

export default function BookmarkedImagesPage() {
  const navigation = useNavigation();
  const router = useRouter();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  

  const [bookmarkedImages, setBookmarkedImages] = useState<BookmarkedImage[]>([]);
  const { index, title, imageUrl, originalName } = useLocalSearchParams<{
    index: string;
    title: string;
    imageUrl: string;
    originalName: string;
  }>();
  const imageSrc = imageUrl || '';

  // Set up the navigation header with back button
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: title || 'Bookmarked Styles',
      headerTitleAlign: 'center',
      headerTitleStyle: { fontWeight: 'bold' },
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
      
              navigation.goBack();
            
          }}
          style={{ paddingHorizontal: 10 }}
        >
          <FontAwesome name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
      ),
    });
  }, 
  [navigation, title]
);

  // Handle system back button
  useEffect(() => {
    const backAction = () => {
     
        navigation.goBack();
      
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [ navigation]);

  useEffect(() => {
    loadBookmarkedImages();
  }, []);

  const loadBookmarkedImages = async () => {
    try {
      const bookmarks = await AsyncStorage.getItem('bookmarks');
      setBookmarkedImages(bookmarks ? JSON.parse(bookmarks) : []);
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
    }
  };

  const removeBookmark = async (imageUrl: string) => {
    try {
      const bookmarks = await AsyncStorage.getItem('bookmarks');
      const parsedBookmarks = bookmarks ? JSON.parse(bookmarks) : [];
      const updatedBookmarks = parsedBookmarks.filter((item: BookmarkedImage) => item.imageUrl !== imageUrl);
      await AsyncStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
      setBookmarkedImages(updatedBookmarks);
      Toast.show({
        type: 'info',
        text1: 'Bookmark removed!',
        position: 'bottom',
      });
    } catch (error) {
      console.error('Failed to update bookmarks:', error);
    }
  };

    const requestPermission = async () => {
      if (Platform.OS === "android") {
        try {
          // Request WRITE_EXTERNAL_STORAGE permission for Android
          const storagePermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: "Storage Permission",
              message: "App needs access to your storage to download images.",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK",
            }
          );
  
          if (storagePermission !== PermissionsAndroid.RESULTS.GRANTED) {
            return false;
          }
        } catch (err) {
          console.warn(err);
          return false;
        }
      }
  
      // Request Media Library permission for all platforms
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      if (!mediaLibraryPermission.granted) {
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Media Library permission is required to download images.",
          visibilityTime: 2000,
        });
        return false;
      }
  
      return true;
    };

    const downloadImage = async (imageUrl: string) => {
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        return;
      }
    
      try {
        const uri = imageUrl; // <-- fix here
        const downloadDir = FileSystem.cacheDirectory + `${title || "image"}.jpg`;
    
        const downloadResult = await FileSystem.downloadAsync(uri, downloadDir);
    
        if (downloadResult.status === 200) {
          const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
          await MediaLibrary.createAlbumAsync("Download", asset, false);
    
          // Show congratulatory dialog
          setShowSuccessDialog(true);
        } else {
          throw new Error("Download failed.");
        }
      } catch (error) {
        console.error(error);
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "An error occurred during download.",
          visibilityTime: 2000,
        });
      }
    };
    
  const renderImageItem = ({ item }: { item: BookmarkedImage }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="stretch" />
      <View style={styles.iconContainerWrapper}>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => downloadImage(item.imageUrl)}
        >
          <FontAwesome name="download" size={24} color="tomato" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => removeBookmark(item.imageUrl)}
        >
          <FontAwesome name="bookmark" size={24} color="blue" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>


            <Modal visible={showSuccessDialog} transparent animationType="fade">
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0,0,0,0.6)",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#fff",
                    padding: 20,
                    borderRadius: 15,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <LottieView
                    source={require("../assets/json/upload.json")}
                    autoPlay
                    loop={false}
                    onAnimationFinish={() => setShowSuccessDialog(false)}
                    style={{ width: 150, height: 150 }}
                  />
                  <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 10 }}>
                    Image Downloaded!
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowSuccessDialog(false)}
                    style={{
                      marginTop: 15,
                      backgroundColor: "tomato",
                      paddingVertical: 8,
                      paddingHorizontal: 20,
                      borderRadius: 10,
                    }}
                  >
                    <Text style={{ color: "#fff", fontWeight: "600" }}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>


      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={"#fff"}/>
        </TouchableOpacity>
        <Text style={{ flex: 1, textAlign: "center", fontSize: 20, fontWeight: "bold", color: "#fff", marginBottom: 30, marginTop: 30}}>
          Bookmarked Styles
        </Text>
      </View>


      {/* Bookmarked Images List */}
      <FlatList
        data={bookmarkedImages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderImageItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No bookmarked images yet.</Text>}
      />
    </View>
  );
}

// Styles remain the same
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#121212',
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  iconContainerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 50,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#aaaaaa',
    marginTop: 20,
  },
});
