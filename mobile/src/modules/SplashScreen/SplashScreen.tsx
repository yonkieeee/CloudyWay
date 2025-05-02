import { View, ActivityIndicator, StyleSheet, Image } from "react-native";
import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function SplashScreen() {
  useEffect(() => {
    const checkUser = async () => {
      try {
        console.log("Перевіряю користувача в AsyncStorage...");
        const userData = await AsyncStorage.getItem("user");
        console.log("Знайдені дані:", userData);

        if (userData !== null) {
          router.replace("/map");
        } else {
          router.replace("/auth");
        }
      } catch (error) {
        console.error("Помилка при читанні з AsyncStorage:", error);
        router.replace("/auth");
      }
    };

    checkUser();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/images/splash.png")}
        style={styles.logo}
      />
      <ActivityIndicator size="large" color="#999" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    resizeMode: "contain",
  },
});
