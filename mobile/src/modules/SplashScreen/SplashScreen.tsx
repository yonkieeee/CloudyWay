import { View, ActivityIndicator, StyleSheet, Image } from "react-native";
import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function SplashScreen() {
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const uid = await AsyncStorage.getItem("@uid");
        if (uid) {
          console.log("Знайдено UID:", uid);
          router.replace("/map");
        } else {
          console.log("UID не знайдено");
          router.replace("/auth");
        }
      } catch (error) {
        console.error("Помилка при перевірці UID:", error);
        router.replace("/auth");
      }
    };

    checkAuth();
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
