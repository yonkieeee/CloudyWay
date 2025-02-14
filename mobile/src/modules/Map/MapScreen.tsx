import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  Animated,
  Keyboard,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import MapView from "react-native-maps";

const AuthScreen: React.FC = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isPlusVisible, setIsPlusVisible] = useState(false);
  const searchWidth = useState(new Animated.Value(90))[0];
  const router = useRouter();

  const Bars = (): void => {
    setIsMenuVisible(true);
  };

  const openMenu = (): void => {
    setIsMenuVisible(true);
  };

  const closeMenu = (): void => {
    setIsMenuVisible(false);
  };

  const handleNearby = () => {
    Alert.alert("Places nearby", "Displaying nearby locations.");
    closeMenu();
  };

  const handleBuildRoute = () => {
    Alert.alert("Build Route", "Routing feature is under development.");
    closeMenu();
  };

  const handleFavorites = () => {
    Alert.alert("Favorites", "Here are your favorite locations.");
    closeMenu();
  };

  const handleHistory = () => {
    Alert.alert("Search History", "Here is your search history.");
    closeMenu();
  };

  const handleSetting = () => {
    Alert.alert("Setting");
    closeMenu();
  };

  const startSearch = (): void => {
    setIsSearching(true);
    Animated.timing(searchWidth, {
      toValue: 385,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const endSearch = (): void => {
    setIsSearching(false);
    setSearchText("");
    Animated.timing(searchWidth, {
      toValue: 90,
      duration: 300,
      useNativeDriver: false,
    }).start();
    Keyboard.dismiss();

    setTimeout(() => {
      searchWidth.setValue(90);
    }, 300); // Затримка до завершення анімації
  };

  const handleSearchSubmit = () => {
    Alert.alert("Searching", searchText);
    endSearch();
  };

  const Profile = (): void => {
    router.push("/profile");
  };

  const openPlus = (): void => {
    setIsPlusVisible(true);
  };

  const closePlus = (): void => {
    setIsPlusVisible(false);
  };

  return (
    <View
      style={{
        flex: 1,
        marginTop: 0,
        paddingTop: 0,
        backgroundColor: "transparent",
        borderWidth: 0,
        margin: 0, // прибирає відступи
        padding: 0, // прибирає відступи
      }}
    >
      <TouchableOpacity
        style={[
          styles.barsButton,
          { zIndex: 0, position: "absolute", top: 0, left: 0 },
        ]}
        onPress={Bars}
      >
        <Icon name="bars" size={40} color="black" style={styles.icon} />
      </TouchableOpacity>

      <Animated.View
        style={[
          styles.searchButton,
          {
            width: searchWidth,
            backgroundColor: isSearching ? "#ffffff" : "transparent",
            top: isSearching ? 15 : 17,
            zIndex: 1,
            position: "absolute",
            right: 3,
          },
        ]}
      >
        {isSearching ? (
          <>
            <Icon
              name="search"
              size={20}
              color="black"
              style={styles.iconInsideSearch}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              placeholderTextColor="#000"
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={handleSearchSubmit}
              autoFocus
            />
          </>
        ) : (
          <TouchableOpacity
            onPress={startSearch}
            style={styles.searchIconContainer}
          >
            <Icon name="search" size={35} color="black" style={styles.icon} />
          </TouchableOpacity>
        )}
      </Animated.View>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 48.3794, // Центр України (широта)
          longitude: 31.1656, // Центр України (довгота)
          latitudeDelta: 8.5, // Масштаб (покриває всю Україну)
          longitudeDelta: 8.5, // Масштаб (покриває всю Україну)
        }}
        scrollEnabled={false} // Заборона прокручування
        // zoomEnabled={false} // Заборона зміни масштабу
        rotateEnabled={false} // Заборона повороту
        pitchEnabled={false} // Заборона зміни кута нахилу
      />
      <TouchableOpacity style={styles.profileButton} onPress={Profile}>
        <Icon name="user" size={40} color="black" style={styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.commonButtonStyle, { position: "absolute" }]}
        onPress={openPlus}
      >
        <Icon name="plus" size={40} color="black" style={styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.barsButton} onPress={openMenu}>
        <Icon name="bars" size={40} color="black" style={styles.icon} />
      </TouchableOpacity>

      <Modal
        visible={isMenuVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeMenu}
      >
        <View style={styles.menuContainer}>
          <TouchableOpacity onPress={closeMenu} style={styles.closeButtonMenu}>
            <Icon name="times" size={25} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.menuTitle}>Menu</Text>

          <TouchableOpacity onPress={handleNearby} style={styles.menuItem}>
            <Text style={styles.menuText}>Places nearby</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleBuildRoute} style={styles.menuItem}>
            <Text style={styles.menuText}>Build a route</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleFavorites} style={styles.menuItem}>
            <Text style={styles.menuText}>Favorites</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleHistory} style={styles.menuItem}>
            <Text style={styles.menuText}>Search history</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSetting} style={styles.menuItem}>
            <Text style={styles.menuText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        visible={isPlusVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closePlus}
      >
        <View style={styles.plusContainer}>
          <TouchableOpacity onPress={closePlus} style={styles.closeButtonAdd}>
            <Icon name="times" size={25} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Add new picture</Text>
          <TouchableOpacity style={styles.photoBox}>
            <Icon name="plus" size={80} color="#aaa" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.placeButton} disabled={true}>
            {" "}
            {/* Створюємо кнопку "Place", але не клікабельну */}
            <Text style={styles.placeButtonText}>Place</Text>
          </TouchableOpacity>
          <TextInput
            style={[styles.input, styles.noteInput]}
            placeholder="Add a note..."
            placeholderTextColor="#ccc"
            multiline
          />
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Стилізація для флекс-контейнера, що займає весь екран
    backgroundColor: "#84B0E1", // Фон екрану
    justifyContent: "center", // Вертикальне вирівнювання по центру
    alignItems: "center", // Горизонтальне вирівнювання по центру
    paddingHorizontal: 20, // Відступи зліва та справа
  },
  title: {
    fontSize: 45, // Розмір шрифта для заголовку
    color: "#030E38", // Колір тексту заголовка
    fontWeight: "bold", // Жирний шрифт для заголовка
    textAlign: "center", // Текст по центру
    position: "absolute", // Абсолютне позиціювання
    top: 145, // Відступ від верхнього краю
    left: 37, // Відступ від лівого краю
    right: 37, // Відступ від правого краю
  },
  barsButton: {
    flexDirection: "row", // Напрямок елементів в ряду
    alignItems: "center", // Вирівнювання елементів по вертикалі по центру
    backgroundColor: "transparent", // Колір фону кнопки
    paddingVertical: 10, // Відступи по вертикалі
    paddingHorizontal: 20, // Відступи по горизонталі
    width: 70, // Ширина кнопки
    height: 70, // Висота кнопки
    borderRadius: 30, // Заокруглені кути
    position: "absolute", // Абсолютне позиціювання
    top: 10, // Відступ від верхнього краю
    left: 5, // Відступ від лівого краю
  },
  searchButton: {
    flexDirection: "row", // Напрямок елементів в ряду
    alignItems: "center", // Вирівнювання елементів по вертикалі по центру
    justifyContent: "center", // Вирівнювання елементів по горизонталі по центру
    backgroundColor: "transparent", // Колір фону кнопки пошуку
    paddingVertical: 5, // Відступи по вертикалі
    paddingHorizontal: 10, // Відступи по горизонталі
    width: 60, // Ширина кнопки пошуку
    height: 60, // Висота кнопки пошуку
    borderRadius: 30, // Заокруглені кути
    position: "absolute", // Абсолютне позиціювання
    top: 50, // Відступ від верхнього краю
    right: 2, // Відступ від правого краю
    zIndex: 1, // Підвищує пріоритет для кнопки пошуку
  },
  searchIconContainer: {
    alignItems: "center", // Вирівнювання іконки по вертикалі
    justifyContent: "center", // Вирівнювання іконки по горизонталі
  },
  iconInsideSearch: {
    marginLeft: 10, // Відступ зліва для іконки в середині пошуку
    marginRight: 10, // Відступ справа для іконки в середині пошуку
  },
  searchInput: {
    height: 30, // Висота поля вводу
    flex: 1, // Поле вводу займає весь простір в кнопці
    color: "#000", // Колір тексту в полі вводу
    backgroundColor: "transparent", // Прозорий фон для поля вводу
  },
  profileButton: {
    flexDirection: "row", // Напрямок елементів в ряду
    alignItems: "center", // Вирівнювання іконки по вертикалі по центру
    justifyContent: "center", // Вирівнювання іконки по горизонталі по центру
    backgroundColor: "#F6F3EB", // Колір фону для кнопки профілю
    width: 60, // Ширина кнопки
    height: 60, // Висота кнопки
    borderRadius: 30, // Заокруглені кути для кнопки
    position: "absolute", // Абсолютне позиціювання
    bottom: 70, // Відступ від нижнього краю
    left: "40%", // Відступ від лівого краю (50% по центру + додатковий зсув)
    transform: [{ translateX: -30 }], // Коригуємо відстань для розміщення по центру
  },
  plusButton: {
    flexDirection: "row", // Напрямок елементів в ряду
    alignItems: "center", // Вирівнювання іконки по вертикалі
    justifyContent: "center", // Вирівнювання іконки по горизонталі
    backgroundColor: "#F6F3EB", // Колір фону для кнопки додавання
    width: 60, // Ширина кнопки
    height: 60, // Висота кнопки
    borderRadius: 30, // Заокруглені кути для кнопки
    position: "absolute", // Абсолютне позиціювання
    bottom: 70, // Відступ від нижнього краю
    left: "40%", // Відступ від лівого краю
    transform: [{ translateX: 90 }], // Зсув вправо для кнопки
  },
  plusContainer: {
    flex: 0.5, // Флекс контейнер, що займає весь простір
    backgroundColor: "rgba(3, 14, 56, 0.98)", // Темний фон для меню
    justifyContent: "center", // Вертикальне вирівнювання по центру
    alignItems: "center", // Горизонтальне вирівнювання по центру
    marginHorizontal: 20, // Додано відступи по боках
    borderRadius: 10, // Заокруглені кути для елегантного вигляду
    top: 210, // Відступ від верхнього краю
  },
  modalTitle: {
    fontSize: 25, // Розмір шрифта
    color: "#fff", // Колір назви
    fontWeight: "bold", // Жирний шрифт
    top: 10,
    textAlign: "center",
  },
  photoBox: {
    width: 200, // Ширина кнопки
    height: 200, // Висота кнопки
    backgroundColor: "#fff", // Фон кнопки для додавання фото
    borderRadius: 0, // Заокруглені кути для кнопки
    justifyContent: "center", // Вертикальне вирівнювання по центру
    alignItems: "center", // Горизонтальне вирівнювання по центру
    marginBottom: 20,
    top: 17,
  },
  input: {
    width: "80%", // Ширина кнопки
    height: 20, // Висота кнопки
    backgroundColor: "#fff", // фон
    borderRadius: 9, // Заокруглені кути для кнопки
    paddingHorizontal: 14, // Відступи по горизонталі
    paddingVertical: 10, // Відступи по верикалі
    fontSize: 16,
    color: "#000",
    marginBottom: 20,
    top: 10,
  },
  noteInput: {
    height: 65, // Висота
    textAlignVertical: "top",
  },
  placeButton: {
    width: "80%", // Ширина кнопки
    height: 33, // Висота кнопки
    backgroundColor: "#fff", // Колір фону кнопки
    borderRadius: 6, // Заокруглені кути
    justifyContent: "center", // Вертикальне вирівнювання по центру
    alignItems: "center", // Горизонтальне вирівнювання по центру
    marginBottom: 1, // Відступ знизу
    top: 5,
  },

  placeButtonText: {
    fontSize: 18, // Розмір шрифта
    color: "#030E38", // Колір тексту
    fontWeight: "bold", // Жирний шрифт
  },
  saveButton: {
    width: "60%", // Ширина кнопки
    height: 50, // Висота кнопки
    backgroundColor: "#05092d",
    borderRadius: 10, // Заокруглені кути для кнопки
    justifyContent: "center", // Вертикальне вирівнювання по центру
    alignItems: "center", // Горизонтальне вирівнювання по центру
    marginTop: 5,
    bottom: 8,
  },
  saveButtonText: {
    color: "#fff", // Колір кнопки
    fontSize: 18, // Розмір шрифта для кнопки
    fontWeight: "bold", // Жирний шрифт
  },
  modalOverlay: {
    flex: 1, // Флекс контейнер, що займає весь простір
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Напівпрозорий фон
    justifyContent: "center", // Вертикальне вирівнювання по центру
    alignItems: "center", // Горизонтальне вирівнювання по центру
    position: "absolute", // Абсолютне позиціювання
  },
  menuContainer: {
    flex: 1, // Флекс контейнер, що займає весь простір
    backgroundColor: "rgba(3, 14, 56, 0.97)", // Темний фон для меню
    justifyContent: "center", // Вертикальне вирівнювання по центру
    alignItems: "center", // Горизонтальне вирівнювання по центру
    padding: 5, // Відступи для вмісту меню
  },
  menuItem: {
    paddingVertical: 15, // Відступи по вертикалі для елементів меню
    paddingHorizontal: 20, // Відступи по горизонталі для елементів меню
    backgroundColor: "#1D2A56", // Колір фону для елементів меню
    borderRadius: 10, // Заокруглені кути
    width: "80%", // Ширина елемента меню
    alignItems: "center", // Горизонтальне вирівнювання по центру
    marginBottom: 20, // Відступ між елементами меню
  },
  menuTitle: {
    fontSize: 30, // Розмір шрифта для заголовку меню
    color: "#fff", // Колір тексту заголовка
    fontWeight: "bold", // Жирний шрифт
    marginBottom: 40, // Відступ від нижнього краю заголовка
  },
  menuText: {
    fontSize: 20, // Розмір шрифта для тексту елементів меню
    color: "#fff", // Колір тексту елементів меню
  },
  closeButtonMenu: {
    position: "absolute", // Абсолютне позиціювання
    top: 50, // Відступ від верхнього краю
    right: 10, // Відступ від правого краю
    padding: 10, // Відступи для кнопки закриття
    color: "#84B0E1", // Колір для кнопки закриття
  },
  closeButtonAdd: {
    position: "absolute", // Абсолютне позиціювання
    top: 3, // Відступ від верхнього краю
    right: 5, // Відступ від правого краю
    padding: 10, // Відступи для кнопки закриття
    color: "#84B0E1", // Колір для кнопки закриття
  },
  icon: {
    marginRight: 0, // Відсутність відступу справа для іконки
    color: "#030E38",
  },
  commonButtonStyle: {
    flexDirection: "row", // Напрямок елементів в ряду
    alignItems: "center", // Вирівнювання іконки по вертикалі
    justifyContent: "center", // Вирівнювання іконки по горизонталі
    backgroundColor: "#F6F3EB", // Колір фону для кнопки додавання
    width: 60, // Ширина кнопки
    height: 60, // Висота кнопки
    borderRadius: 30, // Заокруглені кути для кнопки
    position: "absolute", // Абсолютне позиціювання
    bottom: 70, // Відступ від нижнього краю
    left: "40%", // Відступ від лівого краю
    transform: [{ translateX: 90 }], // Зсув вправо для кнопки
  },
});

export default AuthScreen;
