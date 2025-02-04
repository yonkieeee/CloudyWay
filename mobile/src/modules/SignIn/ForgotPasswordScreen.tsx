import React, { useState } from "react";
import { Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import authStyles from "@/src/common/styles/authStyles";

const ForgotPasswordScreen: React.FC = () => {
  const [identifier, setIdentifier] = useState<string>(""); // Email або username
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleSendOtp = async () => {
    setError("");

    if (!identifier.trim()) {
      setError("Please enter your email or username.");
      return;
    }

    try {
      const response = await fetch(
        "http://13.60.155.25:8080/reset-password/send-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier }),
        },
      );

      const text = await response.text();
      if (!response.ok) throw new Error(text || "Something went wrong");

      Alert.alert("Success", "OTP sent successfully.");

      router.push({
        pathname: "/forgotPasswordSend",
        params: { identifier },
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      setError(errorMessage);
    }
  };

  return (
    <View style={authStyles.container}>
      <Text style={authStyles.headerOne}>CloudyWay</Text>
      <Text style={authStyles.headerTwo}>Forgot your password?</Text>

      <Text style={authStyles.instructionText}>
        Enter your email or username to receive a verification code.
      </Text>

      <View style={authStyles.inputContainer}>
        <Text style={authStyles.label}>Email or Username</Text>
        <TextInput
          style={authStyles.input}
          placeholder="Enter your email or username"
          placeholderTextColor="#aaa"
          value={identifier}
          onChangeText={setIdentifier}
          autoCapitalize="none"
        />
        {error ? <Text style={authStyles.errorText}>{error}</Text> : null}
      </View>

      <TouchableOpacity style={authStyles.signInButton} onPress={handleSendOtp}>
        <Text style={authStyles.buttonText}>Send</Text>
      </TouchableOpacity>

      <Text style={authStyles.footerText}>
        Remember your password?{" "}
        <Text
          style={authStyles.signUpLink}
          onPress={() => router.push("/signIn")}
        >
          Log in.
        </Text>
      </Text>
    </View>
  );
};

export default ForgotPasswordScreen;
