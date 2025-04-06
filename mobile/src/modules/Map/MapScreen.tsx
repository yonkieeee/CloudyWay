import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  Keyboard,
  Modal,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import MapView, { Marker, Polygon, Region } from "react-native-maps";
import * as Location from "expo-location";
import UkraineGeoJSON from "../../common/geo/Ukraine.json";
import areasOfUkraine from "../../common/geo/areasOfUkraine.json";
import { customMapStyle } from "../Map/customMapStyle";

interface MarkerData {
  houseNumber: string; // Номер будинку
  street: string; // Вулиця
  city: string; // Місто
  state: string; // Область
  postalCode: string; // Поштовий код
  country: string; // Країна
  latitude?: number; // Широта (не обов'язково)
  longitude?: number; // Довгота (не обов'язково)
  name?: string; // Назва місця (не обов'язково)
  address?: string; // Адреса місця (не обов'язково)
}

const AuthScreen: React.FC = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isPlusVisible, setIsPlusVisible] = useState(false);
  const searchWidth = useState(new Animated.Value(90))[0];
  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [coordinates, setCoordinates] = useState<
    { latitude: number; longitude: number }[]
  >([]);

  // Статичні маркери для демонстрації
  const staticMarkers: MarkerData[] = [
    {
      houseNumber: "1",
      street: "Sofiivska St.",
      city: "Kyiv",
      state: "Kyiv",
      postalCode: "01001",
      country: "Ukraine",
      latitude: 50.4501,
      longitude: 30.52,
      name: "Софійський собор",
      address: "Sofiivska St., Kyiv, Ukraine",
    },
    {
      houseNumber: "2",
      street: "Rynok Square",
      city: "Lviv",
      state: "Lviv",
      postalCode: "79000",
      country: "Ukraine",
      latitude: 49.8397,
      longitude: 24.0297,
      name: "Площа Ринок",
      address: "Rynok Square, Lviv, Ukraine",
    },
    {
      houseNumber: "3",
      street: "Potiomkin St.",
      city: "Odessa",
      state: "Odessa",
      postalCode: "65000",
      country: "Ukraine",
      latitude: 46.485,
      longitude: 30.735,
      name: "Потьомкінські сходи",
      address: "Potiomkin Stairs, Odessa, Ukraine",
    },
    {
      houseNumber: "4",
      street: "Svobody Square",
      city: "Kharkiv",
      state: "Kharkiv",
      postalCode: "61000",
      country: "Ukraine",
      latitude: 49.9935,
      longitude: 36.2304,
      name: "Площа Свободи",
      address: "Svobody Square, Kharkiv, Ukraine",
    },
    {
      houseNumber: "5",
      street: "Kyivska St.",
      city: "Chernihiv",
      state: "Chernihiv",
      postalCode: "14000",
      country: "Ukraine",
      latitude: 51.8051,
      longitude: 31.289,
      name: "Чернігівський історичний музей",
      address: "Kyivska St., Chernihiv, Ukraine",
    },
    {
      houseNumber: "6",
      street: "Khreshchatyk St.",
      city: "Kyiv",
      state: "Kyiv",
      postalCode: "01001",
      country: "Ukraine",
      latitude: 50.45,
      longitude: 30.52,
      name: "Хрещатик",
      address: "Khreshchatyk St., Kyiv, Ukraine",
    },
  ];

  const [markers, setMarkers] = useState<MarkerData[]>(staticMarkers); // Використовуємо статичні маркери

  const getUserLocation = async (): Promise<void> => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setErrorMsg("Permission to location was not granted");
        return;
      }

      let location = await Location.getCurrentPositionAsync();
      const { latitude, longitude } = location.coords;

      console.log("lat and log is", latitude, longitude);

      setLatitude(latitude);
      setLongitude(longitude);

      const response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      console.log(response);
    } catch (error) {
      console.error("Error fetching location:", error);
      setErrorMsg("Error fetching location");
    }
  };

  // Функція отримання координат України
  const loadUkraineBorders = () => {
    if (!UkraineGeoJSON?.features?.length) {
      console.warn("No features found in GeoJSON");
      return;
    }

    const geoData = UkraineGeoJSON.features[0].geometry;

    if (geoData.type !== "Polygon" && geoData.type !== "MultiPolygon") {
      console.error("Invalid GeoJSON format: expected Polygon or MultiPolygon");
      return;
    }

    let rawCoords: any =
      geoData.type === "MultiPolygon"
        ? geoData.coordinates[0][0] // MultiPolygon має ще один рівень вкладеності
        : geoData.coordinates[0];

    if (!Array.isArray(rawCoords)) {
      console.error("Invalid coordinates format in GeoJSON");
      return;
    }

    const formattedCoords = rawCoords.map((point: number[]) => ({
      latitude: point[1],
      longitude: point[0],
    }));

    setCoordinates(formattedCoords); // ✅ Тепер setCoordinates існує
  };

  useEffect(() => {
    getUserLocation();
    loadUkraineBorders();
  }, []);

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

  const opacityAnim = useRef(new Animated.Value(0.9)).current; // Початкова прозорість

  const [opacityValue, setOpacityValue] = useState(0.9); // Зберігаємо значення прозорості в state

  // Додаємо слухача для оновлення opacityValue
  useEffect(() => {
    const id = opacityAnim.addListener(({ value }) => {
      setOpacityValue(value); // Оновлюємо значення opacityValue
    });

    // Очистка слухача
    return () => opacityAnim.removeListener(id);
  }, []);

  const handleRegionChange = (region: Region) => {
    const zoomLevel = region.latitudeDelta; // Чим менше, тим більший зум
    const newOpacity = Math.max(0.3, Math.min(0.9, zoomLevel * 0.5));

    Animated.timing(opacityAnim, {
      toValue: newOpacity,
      duration: 300,
      useNativeDriver: false,
    }).start();
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
        customMapStyle={customMapStyle} // Застосовуємо стилі
        showsPointsOfInterest={false}
        region={
          latitude && longitude
            ? {
                latitude,
                longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }
            : {
                latitude: 48.3794, // Центр України за замовчуванням
                longitude: 31.1656,
                latitudeDelta: 8.5,
                longitudeDelta: 8.5,
              }
        }
        rotateEnabled={false} // Заборона повороту
        pitchEnabled={false} // Заборона зміни кута нахилу
        onRegionChangeComplete={handleRegionChange} // Відстеження зміни масштабу
      >
        {latitude && longitude && (
          <Marker coordinate={{ latitude, longitude }} title="Your location" />
        )}
        {/* Полігон для меж України */}
        {coordinates.length > 0 && (
          <Polygon
            coordinates={coordinates}
            strokeWidth={4}
            strokeColor="#073882"
          />
        )}
        {/* Полігони для областей України */}
        {areasOfUkraine.features.map((area, index) => {
          const areaCoords = area.geometry.coordinates[0].map(
            (point: number[]) => ({
              latitude: point[1],
              longitude: point[0],
            }),
          );

          return (
            <Polygon
              key={index}
              coordinates={areaCoords}
              strokeWidth={0.5}
              strokeColor="#073882"
              fillColor={`rgba(176, 190, 200, ${opacityValue})`} // Використовуємо значення прозорості з state
            />
          );
        })}

        {/* Статичні маркери */}
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: marker.latitude!,
              longitude: marker.longitude!,
            }}
            pinColor="blue" // Встановлюємо синій колір для маркерів
            title={marker.name}
            description={marker.address}
          />
        ))}
      </MapView>

      <TouchableOpacity
        style={[styles.profileButton, { position: "absolute" }]}
        onPress={Profile}
      >
        <Icon name="user" size={40} color="black" style={styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.commonButtonStyle, { position: "absolute" }]}
        onPress={openPlus}
      >
        <Icon name="plus" size={40} color="black" style={styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.barsButton, { position: "absolute" }]}
        onPress={openMenu}
      >
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
  marker: {
    width: 30, // Ширина маркера
    height: 40, // Висота маркера (більше для вигляду краплі)
    backgroundColor: "#007BFF", // Колір маркера (синій)
    borderRadius: 15, // Заокруглення для країв маркера
    transform: [{ rotate: "180deg" }], // Перевернути маркер (крапля)
    justifyContent: "center", // Центрування вмісту маркера
    alignItems: "center", // Центрування вмісту маркера
    position: "absolute", // Абсолютне позиціювання
    top: -20, // Відступ від верхнього краю
    left: -15, // Відступ від лівого краю
  },

  markerText: {
    fontSize: 14, // Розмір шрифта для тексту маркера
    color: "#fff", // Колір тексту маркера (білий)
    fontWeight: "bold", // Жирний шрифт
    textAlign: "center", // Центрування тексту по горизонталі
    textAlignVertical: "center", // Центрування тексту по вертикалі
  },
});

export default AuthScreen;
