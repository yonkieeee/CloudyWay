import React, { useState } from "react";
import { Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import authStyles from "@/src/common/styles/authStyles";
import { useRouter } from "expo-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseSDK } from "@/FirebaseConfig";

const SignInScreen: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();
  const auth = getAuth(firebaseSDK);

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/map");
    } catch (e) {
      console.log("@sign-in-error", e);
      Alert.alert("Error", "Incorrect email or password.");
    }
  };

  return (
    <View style={authStyles.container}>
      <Text style={authStyles.headerOne}>CloudyWay</Text>
      <Text style={authStyles.headerTwo}>Sign in to your account</Text>

      {}
      <View style={authStyles.inputContainer}>
        <Text style={authStyles.label}>Email</Text>
        <TextInput
          style={authStyles.input}
          placeholder="Enter your email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      {}
      <View style={authStyles.inputContainer}>
        <Text style={authStyles.label}>Password</Text>
        <TextInput
          style={authStyles.input}
          placeholder="Enter your password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {}
        <TouchableOpacity onPress={() => router.push("/forgotPassword")}>
          <Text style={authStyles.forgotPassword}>Forgot password?</Text>
        </TouchableOpacity>
      </View>

      {}
      <TouchableOpacity
        style={authStyles.signInButton}
        onPress={() => {
          handleSignIn();
        }}
      >
        <Text style={authStyles.buttonText}>Sign in</Text>
      </TouchableOpacity>

      {}
      <View style={authStyles.dividerContainer}>
        <View style={authStyles.divider} />
        <Text style={authStyles.dividerText}>or use social sign in</Text>
        <View style={authStyles.divider} />
      </View>

      {}
      <View style={authStyles.socialContainer}>
        <TouchableOpacity style={authStyles.socialButton}>
          <FontAwesome name="google" size={24} color="#EA4335" />
        </TouchableOpacity>
        <TouchableOpacity style={authStyles.socialButton}>
          <FontAwesome name="facebook" size={24} color="#3b5998" />
        </TouchableOpacity>
      </View>

      {}
      <TouchableOpacity onPress={() => router.push("/signUp")}>
        <Text style={authStyles.signUpText}>
          Don’t have an account?{" "}
          <Text style={authStyles.signUpLink}>Sign up.</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignInScreen;
