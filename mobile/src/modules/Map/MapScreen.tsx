import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const AuthScreen: React.FC = () => {
  const Bars = (): void => {
    Alert.alert("Add information");
  };

  const Search = (): void => {
    Alert.alert(" Cities ");
  };

  const Profile = (): void => {
    Alert.alert("Profile account");
  };

  const Plus = (): void => {
    Alert.alert(" Add");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Map of Ukraine!</Text>

      <TouchableOpacity style={styles.barsButton} onPress={Bars}>
        <Icon name="bars" size={40} color="black" style={styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.searchButton} onPress={Search}>
        <Icon name="search" size={35} color="black" style={styles.icon} />
      </TouchableOpacity>

      <Image
        source={{ uri: "https://i.postimg.cc/T1vSm65G/2024-10-29-190624.png" }}
        style={{ width: 390, height: 300, marginTop: 20 }}
      />

      <TouchableOpacity style={styles.profileButton} onPress={Profile}>
        <Icon name="user" size={40} color="black" style={styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.plusButton} onPress={Plus}>
        <Icon name="plus" size={40} color="black" style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#84B0E1",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 45,
    color: "#030E38",
    fontWeight: "bold",
    textAlign: "center",
    position: "absolute", // Абсолютне позиціонування
    top: 140, // Збільште значення, щоб опустити текст нижче
    left: "50%", // Центрування по горизонталі
    transform: [{ translateX: -140 }], //
  },

  barsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#84B0E1",
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: 80, // Встановлюємо ширину
    height: 60, // Встановлюємо висоту
    borderRadius: 30, // Задаємо borderRadius, щоб зробити кнопку круглою
    position: "absolute", // Додаємо абсолютне позиціонування
    top: 0, // Встановлюємо відстань від верхньої границі
    left: 0,
  },
  searchButton: {
    flexDirection: "row", // Вирівнювання дочірніх елементів в ряд
    alignItems: "center", // Вертикальне вирівнювання елементів по центру
    justifyContent: "center", // Горизонтальне вирівнювання елементів по центру
    backgroundColor: "#84B0E1", // Колір фону кнопки
    paddingVertical: 10, // Вертикальні відступи
    paddingHorizontal: 20, // Горизонтальні відступи
    width: 80, // Ширина кнопки
    height: 60, // Висота кнопки
    borderRadius: 30, // Зробити кнопку круглою
    position: "absolute", // Абсолютне позиціонування
    top: 0, // Відстань від верхньої границі
    right: 2,
  },
  profileButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F6F3EB",
    width: 60,
    height: 60,
    borderRadius: 30,
    position: "absolute",
    bottom: 70, // Відстань від нижнього краю контейнера
    left: "40%", // Розміщення по центру по горизонталі
    transform: [{ translateX: -30 }],
  },
  plusButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F6F3EB",
    width: 60,
    height: 60,
    borderRadius: 30,
    position: "absolute",
    bottom: 70, // Відстань від нижнього краю контейнера
    left: "40%", // Розміщення по центру по горизонталі
    transform: [{ translateX: 90 }],
  },
  icon: {
    marginRight: 0,
    color: "#030E38",
  },
});

export default AuthScreen;
