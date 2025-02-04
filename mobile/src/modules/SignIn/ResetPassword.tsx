import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import authStyles from "@/src/common/styles/authStyles";
import { useRouter, useLocalSearchParams } from "expo-router";

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const { identifier } = useLocalSearchParams(); // отримуємо email або username
  const router = useRouter();

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password should be at least 6 characters long.");
      return;
    }

    try {
      const response = await fetch("http://13.60.155.25:8080/reset-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const textResponse = await response.text();

      if (!response.ok) {
        throw new Error(textResponse || "Failed to reset password");
      }

      Alert.alert("Success", "Password changed successfully.");
      router.push("/signIn");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <View style={authStyles.container}>
      <Text style={authStyles.headerOne}>CloudyWay</Text>

      <Text style={authStyles.headerTwo}>Reset Your Password</Text>

      <TextInput
        style={authStyles.inputContainer}
        secureTextEntry
        placeholder="New Password"
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={authStyles.inputContainer}
        secureTextEntry
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={authStyles.signInButton} onPress={handleSubmit}>
        <Text style={authStyles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ResetPassword;
