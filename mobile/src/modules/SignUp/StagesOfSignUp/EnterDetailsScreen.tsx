import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import ModalDropdown from "react-native-modal-dropdown";
import authStyles from "@/src/common/styles/authStyles";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EnterDetailsScreen: React.FC = () => {
  const [birthDate, setBirthDate] = useState<string>("");
  const [gender, setGender] = useState<string>("");
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

  const handleContinue = async () => {
    if (birthDate && gender) {
      try {
        const uid = await getUid(); // Отримуємо UID з AsyncStorage
        if (!uid) {
          Alert.alert("Error", "User UID not found");
          return;
        }

        const userData = {
          dateOfBirth: birthDate,
          gender: gender,
        };

        // Запит до сервера для оновлення інформації користувача
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

        // Логування для налагодження
        console.log("Response status:", response.status);
        console.log("Response body:", await response.text());

        // Перевірка на успішний запит
        if (response.ok) {
          Alert.alert("Success", "User updated");
          router.push("/addLocation");
        } else {
          const error = await response.json();
          Alert.alert("Error", error.message || "Failed to update account");
        }
      } catch (error) {
        Alert.alert("Error", "An unknown error occurred");
      }
    } else {
      Alert.alert("Error", "Please fill out all fields");
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
        <Text style={authStyles.headerTwo}>Enter your details</Text>

        <View style={authStyles.inputContainer}>
          <Text style={authStyles.label}>Date of birth</Text>
          <TextInput
            style={authStyles.input}
            placeholder="DD/MM/YYYY"
            placeholderTextColor="#aaa"
            value={birthDate}
            onChangeText={setBirthDate}
            keyboardType="numeric"
          />
        </View>

        <View style={authStyles.inputContainer}>
          <Text style={authStyles.label}>Gender</Text>
          <ModalDropdown
            options={["Male", "Female", "Prefer not to say"]}
            defaultValue="Select your gender"
            style={dropdownStyles.dropdown}
            textStyle={
              gender
                ? dropdownStyles.dropdownTextSelected
                : dropdownStyles.dropdownText
            }
            dropdownStyle={dropdownStyles.dropdownList}
            dropdownTextStyle={dropdownStyles.dropdownItemText}
            onSelect={(index, value) => setGender(value)}
          />
        </View>

        <TouchableOpacity
          onPress={handleContinue}
          style={authStyles.signInButton}
        >
          <Text style={authStyles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const dropdownStyles = StyleSheet.create({
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 9,
    padding: 10,
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
    position: "relative",
  },
  dropdownText: {
    color: "#aaa",
    fontSize: 16,
  },
  dropdownList: {
    position: "absolute",
    top: 5,
    marginLeft: -11,
    right: 36,
    maxHeight: 130,
    overflow: "scroll",
    backgroundColor: "white",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    zIndex: 1,
    paddingTop: 0,
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#000",
    padding: 10,
  },
  dropdownTextSelected: {
    color: "#000",
    fontSize: 16,
  },
});

export default EnterDetailsScreen;
