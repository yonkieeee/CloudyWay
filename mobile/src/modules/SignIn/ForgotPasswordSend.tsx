import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import authStyles from "@/src/common/styles/authStyles";
import { useRouter, useLocalSearchParams } from "expo-router";

const ForgotPasswordSend: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const inputs = useRef<TextInput[]>([]);
  const router = useRouter();
  const { identifier } = useLocalSearchParams(); // Get email or username
  const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleOtpSubmit = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      Alert.alert("Error", "Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      const response = await fetch(
        "http://13.60.155.25:8080/reset-password/validate-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier, otp: enteredOtp }),
        },
      );

      const textResponse = await response.text();
      console.log(textResponse);

      if (!response.ok) {
        throw new Error(textResponse || "Invalid OTP");
      }

      Alert.alert("Success", "OTP verified successfully.");
      router.push({ pathname: "/resetPassword", params: { identifier } });
    } catch (error) {
      console.log(error);
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={authStyles.container}>
        <Text style={authStyles.headerOne}>CloudyWay</Text>

        <Text style={authStyles.headerTwo}>
          We have sent password recovery instructions to your email
        </Text>
        <Text style={authStyles.instructionText}>
          Did not receive the email? Check your spam filter or{" "}
          <Text
            style={authStyles.signUpLink}
            onPress={() => alert("Resend email functionality here")}
          >
            resend
          </Text>
        </Text>

        {/* OTP input fields */}
        <View style={styles.inputContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(el) => (inputs.current[index] = el as TextInput)}
              style={styles.input}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              placeholderTextColor={"#FFFFFF"}
              onChangeText={(value) => handleOtpChange(value, index)}
            />
          ))}
        </View>

        {keyboardVisible && (
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <TouchableOpacity
              style={authStyles.signInButton}
              onPress={handleOtpSubmit}
            >
              <Text style={authStyles.buttonText}>Verify OTP</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        )}
        {!keyboardVisible && (
          <TouchableOpacity
            style={authStyles.signInButton}
            onPress={handleOtpSubmit}
          >
            <Text style={authStyles.buttonText}>Verify OTP</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  input: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
    textAlign: "center",
    fontSize: 18,
    backgroundColor: "#ffffff",
    color: "#000",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
});

export default ForgotPasswordSend;
