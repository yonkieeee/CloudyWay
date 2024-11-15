import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useRouter } from "expo-router";

const AuthScreen: React.FC = () => {
  const router = useRouter();

  const GoogleLogin = (): void => {
    alert("Google login button pressed");
  };

  const FacebookLogin = (): void => {
    alert("Facebook login button pressed");
  };

  return (
      <View style={styles.container}>
        <Text style={styles.title}>CloudyWay</Text>

        <TouchableOpacity
            style={styles.signinButton}
            onPress={() => router.push("/signIn")}
        >
          <Text style={styles.textButton}>Sign in</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={styles.signupButton}
            onPress={() => router.push("/signUp")}
        >
          <Text style={styles.textButton}>Sign up</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.orText}>or use social sign up</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity style={styles.googleButton} onPress={GoogleLogin}>
          <Icon name="google" size={24} color="#DB4437" style={styles.icon} />
          <Text style={styles.socialButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.facebookButton} onPress={FacebookLogin}>
          <Icon name="facebook" size={24} color="#4267B2" style={styles.icon} />
          <Text style={styles.socialButtonText}>Continue with Facebook</Text>
        </TouchableOpacity>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030E38",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 55,
    color: "#FFFFFF",
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },
  signinButton: {
    backgroundColor: "#1E6AFF",
    paddingVertical: 10,
    paddingHorizontal: 130,
    borderRadius: 9,
    marginBottom: 20,
  },
  signupButton: {
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 128,
    borderRadius: 9,
    marginBottom: 20,
  },
  textButton: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  line: {
    width: 50,
    height: 1,
    backgroundColor: "#E2E2E2",
  },
  orText: {
    color: "#E2E2E2",
    fontSize: 11,
    marginHorizontal: 10,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginBottom: 10,
    width: 290,
  },
  facebookButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    width: 290,
  },
  socialButtonText: {
    color: "#000",
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 30,
  },
  icon: {
    marginRight: 10,
  },
});
export default AuthScreen;
