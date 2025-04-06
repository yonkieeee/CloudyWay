import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
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
import mapStyles from "../../common/styles/mapStyles";

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
          mapStyles.barsButton,
          { zIndex: 0, position: "absolute", top: 0, left: 0 },
        ]}
        onPress={Bars}
      >
        <Icon name="bars" size={40} color="black" style={mapStyles.icon} />
      </TouchableOpacity>

      <Animated.View
        style={[
          mapStyles.searchButton,
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
              style={mapStyles.iconInsideSearch}
            />
            <TextInput
              style={mapStyles.searchInput}
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
            style={mapStyles.searchIconContainer}
          >
            <Icon
              name="search"
              size={35}
              color="black"
              style={mapStyles.icon}
            />
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
        style={[mapStyles.profileButton, { position: "absolute" }]}
        onPress={Profile}
      >
        <Icon name="user" size={40} color="black" style={mapStyles.icon} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[mapStyles.commonButtonStyle, { position: "absolute" }]}
        onPress={openPlus}
      >
        <Icon name="plus" size={40} color="black" style={mapStyles.icon} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[mapStyles.barsButton, { position: "absolute" }]}
        onPress={openMenu}
      >
        <Icon name="bars" size={40} color="black" style={mapStyles.icon} />
      </TouchableOpacity>

      <Modal
        visible={isMenuVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeMenu}
      >
        <View style={mapStyles.menuContainer}>
          <TouchableOpacity
            onPress={closeMenu}
            style={mapStyles.closeButtonMenu}
          >
            <Icon name="times" size={25} color="#fff" />
          </TouchableOpacity>
          <Text style={mapStyles.menuTitle}>Menu</Text>

          <TouchableOpacity onPress={handleNearby} style={mapStyles.menuItem}>
            <Text style={mapStyles.menuText}>Places nearby</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleBuildRoute}
            style={mapStyles.menuItem}
          >
            <Text style={mapStyles.menuText}>Build a route</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleFavorites}
            style={mapStyles.menuItem}
          >
            <Text style={mapStyles.menuText}>Favorites</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleHistory} style={mapStyles.menuItem}>
            <Text style={mapStyles.menuText}>Search history</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSetting} style={mapStyles.menuItem}>
            <Text style={mapStyles.menuText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        visible={isPlusVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closePlus}
      >
        <View style={mapStyles.plusContainer}>
          <TouchableOpacity
            onPress={closePlus}
            style={mapStyles.closeButtonAdd}
          >
            <Icon name="times" size={25} color="#fff" />
          </TouchableOpacity>
          <Text style={mapStyles.modalTitle}>Add new picture</Text>
          <TouchableOpacity style={mapStyles.photoBox}>
            <Icon name="plus" size={80} color="#aaa" />
          </TouchableOpacity>
          <TouchableOpacity style={mapStyles.placeButton} disabled={true}>
            {" "}
            {/* Створюємо кнопку "Place", але не клікабельну */}
            <Text style={mapStyles.placeButtonText}>Place</Text>
          </TouchableOpacity>
          <TextInput
            style={[mapStyles.input, mapStyles.noteInput]}
            placeholder="Add a note..."
            placeholderTextColor="#ccc"
            multiline
          />
          <TouchableOpacity style={mapStyles.saveButton}>
            <Text style={mapStyles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default AuthScreen;
