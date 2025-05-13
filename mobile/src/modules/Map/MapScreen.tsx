import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  Animated,
  Keyboard,
  Modal,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useRouter } from "expo-router";

import MapView, { Marker, Polygon, Region } from "react-native-maps";
import * as Location from "expo-location";
import UkraineGeoJSON from "../../common/geo/Ukraine.json";
import areasOfUkraine from "../../common/geo/areasOfUkraine.json";
import { customMapStyle } from "../Map/customMapStyle";
import mapStyles from "../../common/styles/mapStyles";

interface Marker {
  id: number;
  placeName: string;
  city: string;
  county: string;
  street: string;
  houseNumber: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface DiscoveredPlace {
  placeName?: string;
  hereApiId?: string;
  city?: string;
  county?: string;
  street?: string;
  houseNumber?: string;
  coordinates?: {
    lat?: number;
    lng?: number;
  };
}


const AuthScreen: React.FC = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<any | null>(null);
  const [suggestions, setSuggestions] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isPlusVisible, setIsPlusVisible] = useState(false);
  const searchWidth = useState(new Animated.Value(90))[0];
  const router = useRouter();
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [discoveredPlaces, setDiscoveredPlaces] = useState<DiscoveredPlace[]>([]);
  const [isPlaceChoiceVisible, setIsPlaceChoiceVisible] = useState(false);
  const [newPlaceName, setNewPlaceName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [coordinates, setCoordinates] = useState<
      { latitude: number; longitude: number }[]
  >([]);
  const mapRef = useRef<any>(null);

  const fetchMarkers = async (): Promise<Marker[]> => {
    try {
      const dbUrl = `http://3.75.94.120:5001/places/getAllPlaces`;

      const dbResponse = await fetch(dbUrl);
      const dbData: Marker[] = await dbResponse.json();

      if (dbResponse.ok && dbData.length > 0) {
        console.log("Fetched markers from the database", dbData);
        return dbData;
      }

      console.log("No data in DB, fetching from API...");
      const apiResponse = await fetch(`https://your-api.com/get-markers`);
      const apiData: Marker[] = await apiResponse.json();

      if (!apiResponse.ok) {
        throw new Error("Error fetching data from API");
      }

      console.log("Fetched markers from API", apiData);

      // Save API data to the database
      await fetch("https://3.75.94.120:5001/places/addPlace", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      return apiData;
    } catch (error) {
      console.error("Error fetching markers:", error);
      return [];
    }
  };
  useEffect(() => {
    fetchMarkers().then((fetchedMarkers) => {
      console.log("Fetched markers:", fetchedMarkers);
      const formattedMarkers = fetchedMarkers.map((marker) => ({
        ...marker,
        coordinates: {
          lat: parseFloat(marker.coordinates.lat as any),
          lng: parseFloat(marker.coordinates.lng as any),
        },
      }));
      setMarkers(formattedMarkers); // Set markers data
    });
  }, []);

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

  // const handleNearby = () => {
  //   router.push("/postscreen");
  //   closeMenu();
  // };
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
    setSearchResults([]);
    Animated.timing(searchWidth, {
      toValue: 90,
      duration: 300,
      useNativeDriver: false,
    }).start();
    Keyboard.dismiss();

    setTimeout(() => {
      searchWidth.setValue(90);
    }, 300);
  };

  const fetchSearchResults = async (query: string) => {
    console.log("🔎 Пошук запиту:", query);

    try {
      const response = await fetch(`http://3.75.94.120:5001/places/fuzzySearch?query=${query}`);
      const data = await response.json();

      console.log("📥 Отримано дані:", data);

      if (response.ok && data.length > 0) {
        setSearchResults(data);
        console.log("✅ Результати пошуку встановлено:", data.length, "знайдено");
      } else {
        console.log("❗️Немає збігів або неуспішна відповідь");
      }
    } catch (error) {
      console.error("🚨 Помилка при пошуку:", error);
    }
  };


  const handleSearchChange = (text: string) => {
    setSearchText(text);
    if (text.trim().length > 2) {
      fetchSearchResults(text);
    } else {
      setSearchResults([]);
    }
  };

  const goToPlace = (place: any) => {
    console.log("goToPlace called with:", place);
    console.log(`📍 Спроба перейти до координат: lat=${place.coordinates.lat}, lng=${place.coordinates.lng}`);

    const existingMarker = markers.find(
        m =>
            m.placeName === place.placeName &&
            m.coordinates.lat === place.coordinates.lat &&
            m.coordinates.lng === place.coordinates.lng
    );

    if (existingMarker) {
      console.log("✅ Маркер вже існує, виділяємо його та переходимо");
      console.log(`🎯 Координати маркера: lat=${existingMarker.coordinates.lat}, lng=${existingMarker.coordinates.lng}`);

      setSelectedMarker(existingMarker);

      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: existingMarker.coordinates.lat,
          longitude: existingMarker.coordinates.lng,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        }, 1000);
      } else {
        console.log("❌ mapRef.current is null");
      }

    } else {
      console.log("➕ Маркер не знайдено, не переходимо");
    }
  };

  const handleSearchSubmit = () => {
    console.log("📤 Надіслано пошук:", searchText);

    if (searchText.trim()) {
      fetchMarkers().then((fetchedMarkers) => {
        console.log("📍 Отримано маркери:", fetchedMarkers.length);
        setMarkers(fetchedMarkers);
        Alert.alert("Searching", `Results for: ${searchText}`);
      });
    } else {
      console.log("❗️ Порожній пошуковий текст");
    }

    endSearch();
  };

  const handleAddNewPlace = async () => {
    if (!newPlaceName.trim()) {
      Alert.alert('Error', 'Please enter a place name');
      return;
    }

    try {
      const discoverUrl = `http://3.75.94.120:5000/locations/discover?query=${encodeURIComponent(newPlaceName)}`;
      const discoverResponse = await fetch(discoverUrl);

      // Розбираємо відповідь лише один раз
      const places = await discoverResponse.json();

      if (!discoverResponse.ok) {
        console.error('❗️ Error discovering place');
        Alert.alert('Error', 'Failed to discover place');
        return;
      }

      setDiscoveredPlaces(places); // Зберігаємо отримані місця

      console.log('📥 Отримано з discover:', places);

      if (!Array.isArray(places) || places.length === 0) {
        Alert.alert('No results', 'No place found with this name');
        return;
      }
    } catch (error) {
      console.error('🚨 Error:', error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const handleSelectDiscoveredPlace = async (place: any) => {
    const cleanedPlace = {
      placeName: place.placeName || '',
      here_api_id: place.hereApiId || '',
      city: place.city || '',
      county: place.county || '',
      street: place.street || '',
      houseNumber: place.houseNumber || '',
      coordinates: {
        lat: place.coordinates?.lat || 0,
        lng: place.coordinates?.lng || 0,
      },
    };

    try {
      const addResponse = await fetch('http://3.75.94.120:5001/places/addPlace', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedPlace),
      });

      const responseText = await addResponse.text();

      if (addResponse.ok) {
        Alert.alert('Success', 'Place added successfully');
        setIsAddModalVisible(false);
        setNewPlaceName('');
        await fetchMarkers().then(setMarkers);

        setTimeout(() => {
          console.log('Moving to coordinates:', cleanedPlace.coordinates);
          goToPlace({
            coordinates: {
              lat: cleanedPlace.coordinates.lat,
              lng: cleanedPlace.coordinates.lng,
            },
            placeName: cleanedPlace.placeName,
          });
        }, 500);
      } else {
        Alert.alert('Error', `Failed to add place:\n${responseText}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
      console.error('🚨 Error:', error);
    }
  };



  const Profile = (): void => {
    router.push("/profile");
  };

  // const openPlus = (): void => {
  //   setIsPlusVisible(true);
  // };
  //
  // const closePlus = (): void => {
  //   setIsPlusVisible(false);
  // };

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
            <View style={mapStyles.searchWrapper}>
              <View style={mapStyles.searchContainer}>
                <Icon name="search" size={20} color="black" style={mapStyles.iconInsideSearch} />

                <TextInput
                    style={mapStyles.searchInput}
                    placeholder="Search..."
                    placeholderTextColor="#000"
                    value={searchText}
                    onChangeText={handleSearchChange}
                    onSubmitEditing={handleSearchSubmit}
                    autoFocus
                />

                <TouchableOpacity onPress={() => setIsAddModalVisible(true)}>
                  <Icon name="plus" size={22} color="black" style={mapStyles.addIconInsideSearch} />
                </TouchableOpacity>
              </View>


              {searchResults.length > 0 && (
                  <ScrollView style={mapStyles.suggestionsContainer}>
                    {searchResults.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={mapStyles.suggestionItem}
                            onPress={() => {
                              goToPlace(item);
                              setSearchText(item.place_name);
                              setSearchResults([]);
                              endSearch();
                            }}
                        >
                          <Text style={mapStyles.suggestionText}>{item.placeName}</Text>


                        </TouchableOpacity>
                    ))}
                  </ScrollView>
              )}

            </View>
        ) : (
            <TouchableOpacity
                onPress={startSearch}
                style={mapStyles.searchIconContainer}
            >
              <Icon name="search" size={35} color="black" style={mapStyles.icon} />
            </TouchableOpacity>
        )}
        <Modal
            visible={isAddModalVisible}
            animationType="slide"
            transparent
            onRequestClose={() => setIsAddModalVisible(false)}
        >
          <View style={mapStyles.modalBackground}>
            <View style={mapStyles.modalContainer}>
              <Text style={mapStyles.modalTitle2}>Add New Place</Text>

              <TextInput
                  placeholder="Place Name"
                  value={newPlaceName}
                  onChangeText={setNewPlaceName}
                  style={mapStyles.modalInput}
              />

              {discoveredPlaces.length > 0 && (
                  <ScrollView style={{ maxHeight: 200, marginBottom: 10 }}>
                    {discoveredPlaces.map((place, index) => (
                        <TouchableOpacity
                            key={index}
                            style={mapStyles.suggestionItem}
                            onPress={() => handleSelectDiscoveredPlace(place)}
                        >
                          <Text style={mapStyles.suggestionText}>
                            {place.placeName}, {place.city}, {place.street}
                          </Text>
                        </TouchableOpacity>
                    ))}
                  </ScrollView>
              )}

              <View style={mapStyles.modalButtons}>
                <TouchableOpacity
                    onPress={handleAddNewPlace}
                    style={[mapStyles.modalButton, { backgroundColor: '#007AFF' }]}
                >
                  <Text style={mapStyles.modalButtonText}>Search</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setIsAddModalVisible(false)}
                    style={[mapStyles.modalButton, { backgroundColor: 'gray' }]}
                >
                  <Text style={mapStyles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </Modal>



      </Animated.View>
      <MapView
          ref={mapRef}
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

        {/* маркери */}
        {markers.map((marker, index) => {
          const lat = parseFloat(marker.coordinates.lat as any);
          const lng = parseFloat(marker.coordinates.lng as any);

          if (isNaN(lat) || isNaN(lng)) {
            console.warn("Неправильні координати маркера:", marker);
            return null;
          }

          return (
              <Marker
                  key={index}
                  coordinate={{
                    latitude: lat,
                    longitude: lng,
                  }}
                  pinColor={selectedMarker?.placeName === marker.placeName ? "blue" : "blue"}
                  title={marker.placeName}
                  description={`${marker.street} ${marker.houseNumber}, ${marker.city}, ${marker.county}`}
                  onPress={() => {
                    setSelectedMarker(marker);
                    router.push({
                      pathname: "/postscreen",
                      params: {
                        marker: JSON.stringify(marker), // передаємо дані як JSON строку
                      },
                    });
                  }}
              />
          );
        })}


      </MapView>

      <TouchableOpacity
        style={[mapStyles.profileButton, { position: "absolute" }]}
        onPress={Profile}
      >
        <Icon name="user" size={40} color="black" style={mapStyles.icon} />
      </TouchableOpacity>

      <TouchableOpacity
          style={[mapStyles.commonButtonStyle, { position: "absolute" }]}
          onPress={() => router.push("/allsearchprofile")}
      >
        <Icon name="user-plus" size={40} color="black" style={mapStyles.icon} />
      </TouchableOpacity>
      {/*<TouchableOpacity*/}
      {/*  style={[mapStyles.commonButtonStyle, { position: "absolute" }]}*/}
      {/*  onPress={openPlus}*/}
      {/*>*/}
      {/*  <Icon name="plus" size={40} color="black" style={mapStyles.icon} />*/}
      {/*</TouchableOpacity>*/}

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
          //onRequestClose={closePlus}
      >
        <View style={mapStyles.plusContainer}>
          <TouchableOpacity
              //onPress={closePlus}
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
