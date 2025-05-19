import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from 'expo-image-manipulator';
import React, { useState,useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  Image,
} from "react-native";
import axios from "axios"; // Додано для роботи з бекендом
import { useRoute } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import * as Location from "expo-location";

interface Post {
  placeId: string;
}

const PostsScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isVisited, setIsVisited] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null); // Для збереження URI фото
  const [description, setDescription] = useState(""); // Для введення опису
  const [isImagePicked, setIsImagePicked] = useState(false); // Стейт для вибору фото
  //const [uid, setUid] = useState<string | null>(null); // Твій UID, може бути з контексту або іншим способом
  const route = useRoute();
  const params = useLocalSearchParams();
  const uid = typeof params.uid === "string" ? params.uid : null;
  const parsedMarker = params.marker ? JSON.parse(params.marker as string) : null;
  if (parsedMarker) {
    console.log("Parsed Marker:", parsedMarker);
  } else {
    console.log("Marker parameter is missing or malformed.");
  }

  useEffect(() => {
    console.log("Opened for marker:", parsedMarker);
  }, [parsedMarker]);

  useEffect(() => {
    const checkVisitedStatus = async () => {
      if (!uid || !parsedMarker?.id) return;

      try {
        const response = await axios.get(`http://51.20.126.241:8081/post?uid=${uid}`);
        const posts: Post[] = response.data;

        // console.log("Posts fetched for UID:", posts);
        // console.log("Parsed Marker ID:", parsedMarker.id);

        const hasVisited = posts.some((post: Post) => post.placeId === parsedMarker.id);
        setIsVisited(hasVisited);  // Update visited status

        console.log("Visited status checked: ", hasVisited);  // Log to ensure correct value
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    if (uid && parsedMarker?.id) {
      console.log("Checking visited status for marker ID:", parsedMarker.id);  // Log marker ID
      checkVisitedStatus();
    }
  }, [uid, parsedMarker.id]);

  function getDistanceFromLatLonInMeters(
      lat1: number,
      lon1: number,
      lat2: number,
      lon2: number
  ): number {
    const R = 6371000; // Радіус Землі в метрах
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  const checkProximityAndExecute = async (callback: () => void) => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const userLat = location.coords.latitude;
    const userLon = location.coords.longitude;

    const markerCoords = parsedMarker?.coordinates;

    if (!markerCoords || typeof markerCoords.lat !== 'number' || typeof markerCoords.lng !== 'number') {
      alert("Invalid marker coordinates");
      return;
    }

    const distance = getDistanceFromLatLonInMeters(
        userLat,
        userLon,
        markerCoords.lat, // широта
        markerCoords.lng  // довгота
    );
    if (distance > 50) {
      alert(`You are too far from the place to mark it visited.\nDistance: ${distance.toFixed(2)}m`);
      return;
    }

    callback();
  };


  // Відкриття камери
  const openCamera = async () => {
    checkProximityAndExecute(async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("Camera permission is required");
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled && result.assets.length > 0) {
        const manipResult = await ImageManipulator.manipulateAsync(
            result.assets[0].uri,
            [{ resize: { width: 800 } }],
            { compress: 0.4, format: ImageManipulator.SaveFormat.JPEG }
        );
        setImageUri(manipResult.uri);
        setIsImagePicked(true);
        setModalVisible(true);
      }
    });
  };

  // Вибір фото з галереї
  const pickFromGallery = async () => {
    checkProximityAndExecute(async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Gallery permission is required");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
        setIsImagePicked(true);
        setModalVisible(true);
      }
    });
  };

  // Функція для підтвердження і відправки даних на сервер
  const handleConfirm = async () => {
    // Перевірка, чи вибрано фото
    if (!imageUri) {
      alert("Please select an image!");
      return;
    }
    if (!uid) {
      alert("User is not authenticated. Please log in.");
      return;
    }

    const formData = new FormData();
    // Функція для отримання імені файлу з URI
    const getFileName = (uri: string): string => {
      return uri.split('/').pop() || 'photo.jpg'; // Якщо ім'я не знайдено — даємо дефолт
    };

// Функція для визначення типу файлу за розширенням
    const getFileType = (fileName: string): string => {
      const ext = fileName.split('.').pop()?.toLowerCase();

      switch (ext) {
        case 'jpg':
        case 'jpeg':
          return 'image/jpeg';
        case 'png':
          return 'image/png';
        case 'gif':
          return 'image/gif';
        default:
          return 'application/octet-stream'; // невідомий тип
      }
    };

// Використання:
    const fileName = getFileName(imageUri);
    const fileType = getFileType(fileName);

    const file = {
      uri: imageUri,
      name: fileName,
      type: fileType,
    };


    formData.append('file', file as any);
    formData.append('description', description);
    formData.append('coordinates', JSON.stringify(parsedMarker?.coordinates));
    formData.append('placeID', parsedMarker?.id || "unknown");
    console.log("UID:", uid);

    try {
      const response = await axios.post(
          `http://51.20.126.241:8081/post?UID=${uid}`, // UID передається як параметр запиту
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data', // Важливо для завантаження файлів
            },
          }
      );

      console.log('Response from server:', response.data);

      setIsVisited(true);
      setModalVisible(false);
      setDescription("");

    } catch (error) {
      console.error("Error uploading data:", error);
      alert("Error uploading photo. Please try again later.");
    }
  };

  // Кнопка "Just Mark Visited"
  // const justMarkAsVisited = async () => {
  //   try {
  //     setIsVisited(true);
  //
  //     if (!uid || !parsedMarker?.id) {
  //       console.error('UID or Marker ID not found');
  //       return;
  //     }
  //     const payload = {
  //       placeId: parsedMarker.id,
  //       description: '', // немає опису
  //       imageUrl: '',     // немає фото
  //     };
  //
  //     await axios.post(
  //         `http://51.20.126.241:8081/post/without-photo?UID=${uid}`,
  //         payload,
  //         {
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //         }
  //     );
  //
  //     setModalVisible(false);
  //     Alert.alert('Success', 'Place marked as visited!');
  //   } catch (error) {
  //     console.error('Error saving visited place:', error);
  //     Alert.alert('Error', 'Failed to mark as visited.');
  //   }
  // };

  return (
      <View style={styles.screen}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.nameLocation}>
              {parsedMarker?.placeName || "Unknown Location"} {isVisited ? "(Visited)" : ""}
            </Text>


            <FontAwesome
                name={isVisited ? "star" : "star-o"}
                size={24}
                color="#f5c518"
            />
          </View>


          {/* Кнопка для відображення модального вікна */}
          <TouchableOpacity
              style={[styles.markButton, { backgroundColor: isVisited ? "#ccc" : "#2A3B5D" }]}
              onPress={() => {
                checkProximityAndExecute(() => {
                  setModalVisible(true);
                });
              }}
              disabled={isVisited}
          >
            <Text style={styles.markButtonText}>{isVisited ? "Visited" : "Mark as Visited"}</Text>
          </TouchableOpacity>
        </View>

        {/* Модальне вікно для вибору фото та підтвердження */}
        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Mark as Visited</Text>

              {/* Кнопки для вибору фото */}
              {/*<TouchableOpacity style={styles.button} onPress={pickFromGallery}>*/}
              {/*  <Text style={styles.buttonText}>Pick from Gallery</Text>*/}
              {/*</TouchableOpacity>*/}
              <TouchableOpacity style={styles.button} onPress={openCamera}>
                <Text style={styles.buttonText}>Take a Photo</Text>
              </TouchableOpacity>

              {/* Відображення вибраного фото */}
              {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}

              {/* Поле для введення опису після вибору фото */}
              {isImagePicked && (
                  <>
                    <TextInput
                        style={styles.descriptionInput}
                        placeholder="Enter description"
                        value={description}
                        onChangeText={setDescription}
                    />
                    <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                      <Text style={styles.optionText}>Confirm</Text>
                    </TouchableOpacity>
                  </>
              )}

              {/* Кнопка для простої позначки */}
              {/*<TouchableOpacity style={styles.justMarkButton} onPress={justMarkAsVisited}>*/}
              {/*  <Text style={styles.justMarkText}>Just Mark Visited</Text>*/}
              {/*</TouchableOpacity>*/}

              {/* Кнопка для скасування */}
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#030E38",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    width: 300,
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  headerRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  nameLocation: {
    fontSize: 16,
    fontWeight: "bold",
  },
  imagePlaceholder: {
    width: 200,
    height: 100,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    borderRadius: 8,
  },
  locationText: {
    fontSize: 24,
    color: "#555",
  },
  markButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 10,
  },
  markButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContent: {
    backgroundColor: "#fff",
    paddingTop: 20,
    paddingBottom: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#2A3B5D",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginVertical: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  imagePreview: {
    width: 250,
    height: 150,
    marginBottom: 20,
    borderRadius: 8,
  },
  descriptionInput: {
    width: 250,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: "#2A3B5D",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  justMarkButton: {
    backgroundColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginTop: 10,
  },
  justMarkText: { color: "#000", fontSize: 16 },
  optionText: {
    color: "#fff",
    fontSize: 16,
  },
  cancelText: {
    fontSize: 16,
    color: "#007BFF",
    marginTop: 15,
    marginBottom: 10,
  },
});

export default PostsScreen;