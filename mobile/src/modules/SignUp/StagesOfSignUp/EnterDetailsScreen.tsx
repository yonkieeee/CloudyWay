import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import ModalDropdown from "react-native-modal-dropdown"; // Додано бібліотеку
import authStyles from "@/src/common/styles/authStyles";
import { useRouter } from "expo-router";

const EnterDetailsScreen: React.FC = () => {
  const [birthDate, setBirthDate] = useState<string>("");
  const [gender, setGender] = useState<string>(""); // Зберігаємо вибраний гендер
  const router = useRouter();

  const handleContinue = () => {
    if (birthDate && gender) {
      Alert.alert("Success", "Account created successfully!");
      router.push("/map");
    } else {
      alert("Please fill out all fields");
    }
  };

  return (
    <View style={authStyles.container}>
      <Text style={authStyles.headerOne}>CloudyWay</Text>
      <Text style={authStyles.headerTwo}>Enter your details</Text>

      <View style={authStyles.inputContainer}>
        <Text style={authStyles.label}>Data of birth</Text>
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
          options={["Male", "Female", "Prefer not to say"]} // Варіанти вибору
          defaultValue="Select your gender" // Текст за замовчуванням
          style={dropdownStyles.dropdown} // Стиль кнопки
          textStyle={
            gender
              ? dropdownStyles.dropdownTextSelected
              : dropdownStyles.dropdownText
          } // Стиль тексту
          dropdownStyle={dropdownStyles.dropdownList} // Стиль випадаючого списку
          dropdownTextStyle={dropdownStyles.dropdownItemText} // Стиль пунктів
          onSelect={(index, value) => setGender(value)} // Зберігаємо вибір
        />
      </View>

      <TouchableOpacity
        style={authStyles.signInButton}
        onPress={handleContinue}
      >
        <Text style={authStyles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const dropdownStyles = StyleSheet.create({
  dropdown: {
    // Контейнер для кнопки з випадаючим списком
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
    // Текст кнопки
    color: "#aaa", // Сірий текст для "placeholder"
    fontSize: 16,
  },
  dropdownList: {
    position: "absolute",
    top: 5,
    marginLeft: -11,
    right: 36,
    maxHeight: 130,
    overflow: "scroll", // прокрутка, якщо список великий
    backgroundColor: "white",
    borderTopLeftRadius: 0, // Без заокруглення верхнього лівого кута
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 8, // Заокруглення нижнього лівого кута
    borderBottomRightRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    zIndex: 1,
    paddingTop: 0, // додатковий відступ для початку списку
  },
  dropdownItemText: {
    // Текст кожного пункту списку
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
