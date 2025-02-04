import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import authStyles from "@/src/common/styles/authStyles";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";

const AddLocationScreen: React.FC = () => {
  const [location, setLocation] = useState<string>("");
  const router = useRouter();

  // Отримання UID з AsyncStorage
  const getUid = async (): Promise<string | null> => {
    try {
      const uid = await AsyncStorage.getItem("@uid");
      console.log("Fetched UID:", uid); // Для перевірки
      return uid;
    } catch (e) {
      console.error("Failed to fetch UID:", e);
      return null;
    }
  };

  // Обробка натискання кнопки Next
  const handleNext = async () => {
    if (location) {
      try {
        const uid = await getUid(); // Отримуємо UID з AsyncStorage
        if (!uid) {
          alert("User UID not found");
          return;
        }

        const userData = {
          location: location,
        };

        // Запит до сервера для оновлення локації користувача
        const response = await fetch(
          `http://13.60.155.25:8080/auth/change-user?uid=${uid}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          },
        );

        console.log("Response status:", response.status);
        console.log("Response body:", await response.text());

        if (response.ok) {
          Alert.alert("Success", "Location updated successfully");
          router.push("/map");
        } else {
          const error = await response.json();
          alert(
            "Error updating location: " + error.message ||
              "Failed to update location",
          );
        }
      } catch (error) {
        alert("An unknown error occurred");
      }
    } else {
      alert("Please add a location");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={authStyles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={authStyles.headerOne}>CloudyWay</Text>
        <Text style={authStyles.headerTwo}>What`s your Location?</Text>
        <FontAwesome name="home" size={50} color="#fff" />

        <View style={authStyles.inputContainer}>
          <Text style={authStyles.label}>Location</Text>
          <TextInput
            style={authStyles.input}
            placeholder="Add your location"
            placeholderTextColor="#aaa"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        <TouchableOpacity style={authStyles.signInButton} onPress={handleNext}>
          <Text style={authStyles.buttonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddLocationScreen;
