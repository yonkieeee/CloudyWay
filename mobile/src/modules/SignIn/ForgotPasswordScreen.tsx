import React, { useState } from "react";
import { Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import authStyles from "@/src/common/styles/authStyles";
import { getAuth, sendPasswordResetEmail } from "@firebase/auth";
import { firebaseSDK } from "@/FirebaseConfig";

const ForgotPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const router = useRouter();

  const handlePasswordReset = async () => {
    setEmailError("");

    if (email === "") {
      setEmailError("Please enter your email address.");
      return;
    }

    const auth = getAuth(firebaseSDK);

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Success", "Password reset link sent to your email.");
      router.push("/forgotPasswordSend");
    } catch (error) {
      console.error("Error resetting password:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <View style={authStyles.container}>
      <Text style={authStyles.headerOne}>CloudyWay</Text>
      <Text style={authStyles.headerTwo}>Forgot your password?</Text>

      <Text style={authStyles.instructionText}>
        Enter your registered email below to receive password reset
        instructions.
      </Text>

      <View style={authStyles.inputContainer}>
        <Text style={authStyles.label}>Email</Text>
        <TextInput
          style={authStyles.input}
          placeholder="Enter your email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {emailError ? (
          <Text style={authStyles.errorText}>{emailError}</Text>
        ) : null}
      </View>

      <TouchableOpacity
        style={authStyles.signInButton}
        onPress={handlePasswordReset}
      >
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
