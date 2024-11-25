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
} from "react-native";
import authStyles from "@/src/common/styles/authStyles";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

const AddLocationScreen: React.FC = () => {
  const [location, setLocation] = useState<string>("");
  const router = useRouter();

  const handleNext = () => {
    if (location) {
      router.push("/details");
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
