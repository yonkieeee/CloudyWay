import React, { useState } from "react";
import { Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import ModalDropdown from "react-native-modal-dropdown"; // Додано бібліотеку
import authStyles from "@/src/common/styles/authStyles";
import { useRouter } from "expo-router";

const EnterDetailsScreen: React.FC = () => {
  const [birthDate, setBirthDate] = useState<string>("");
  const [gender, setGender] = useState<string>(""); // Зберігаємо вибраний гендер
  const router = useRouter();

  const handleContinue = () => {
    if (birthDate && gender) {
      Alert.alert("Success", "Details saved successfully!");
      // router.push("/nextScreen");
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
          style={authStyles.dropdown} // Стиль кнопки
          textStyle={authStyles.dropdownText} // Стиль тексту
          dropdownStyle={authStyles.dropdownList} // Стиль випадаючого списку
          dropdownTextStyle={authStyles.dropdownItemText} // Стиль пунктів
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

export default EnterDetailsScreen;
