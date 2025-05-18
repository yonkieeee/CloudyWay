import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  Image,Modal, TextInput, Dimensions, ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlatList } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { getAuth } from "firebase/auth";


interface Photo {
  url: string;
  name: string;
  likes?: number;
}
interface UserProfile {
  name: string | null;
  friends: number | null;
  visitedPlaces: number | null;
  mapProgress: string | null;
  album: Photo[];
  achievements: string;
  statistics: {
    progress: string | null;
  };
  avatarUrl?: string | null;
}

const ProfileHeader = ({ userData }: { userData: UserProfile | null }) => {
  const router = useRouter();

  const handlePickAndUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        const image = result.assets[0];
        console.log("Selected image:", image);

        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          console.error("No user is signed in.");
          return;
        }

        const originalFileUri = image.uri;
        const fileInfo = await FileSystem.getInfoAsync(originalFileUri);
        if (!fileInfo.exists) {
          console.error("File does not exist at URI:", originalFileUri);
          return;
        }
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          image.uri,
          [{ resize: { width: 800 } }],
          { compress: 0.4, format: ImageManipulator.SaveFormat.JPEG },
        );

        const fileUri = manipulatedImage.uri;

        const formData = new FormData();
        formData.append("file", {
          uri: fileUri,
          name: image.fileName || "photo.jpg",
          type: "image/jpeg",
        } as any);

        const url = `http://51.20.126.241:8080/profile/photo?uid=${user.uid}`;
        console.log("Uploading to:", url);

        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        alert("Фото успішно завантажено!");
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      alert("Помилка: " + err.message);
    }
  };

  return (
    <ImageBackground
      source={require("../../../assets/images/background.png")}
      style={styles.header}
    >
      <TouchableOpacity
        onPress={() => router.push("/map")}
      >
        <Icon name="arrow-left" size={20} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.profileName}>{userData?.name ?? "User Name"}</Text>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => console.log("Menu button pressed")}
      >
        <Icon name="ellipsis-h" size={20} color="#fff" />
      </TouchableOpacity>

      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={handlePickAndUpload}>
          <View>
            {userData?.avatarUrl ? (
              <Image
                source={{ uri: userData.avatarUrl }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatar} />
            )}
            <View style={styles.cameraIconContainer}>
              <Icon name="camera" size={20} color="#fff" />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <TouchableOpacity
          style={styles.infoBox}
          onPress={() => router.push("/friendsearch")}
        >
          <Text style={styles.infoTitle}>Friends</Text>
          <Text style={styles.infoContent}>{userData?.friends ?? 0}</Text>
        </TouchableOpacity>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Visited Places</Text>
          <Text style={styles.infoContent}>{userData?.visitedPlaces ?? 0}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Map Progress</Text>
          <Text style={styles.infoContent}>
            {userData?.mapProgress ?? "0%"}
          </Text>
        </View>
      </View>
      <View style={styles.separator}></View>
    </ImageBackground>
  );
};

const ProfileScreen = () => {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("Album");

  const getProfileData = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const token = await user.getIdToken();
        if (!token) return;

        const uid = user.uid;
        const response = await axios.get(
          `http://51.20.126.241:8080/profile?uid=${uid}`,
        );

        const friendsResponse = await axios.get(
          `http://18.156.173.171:5002/users/getFollowing/${uid}`,
        );

        setUserData({
          name: response.data.username || user.displayName,
          friends: friendsResponse.data.length ?? 0,
          visitedPlaces: response.data.visitedPlaces ?? 0,
          mapProgress: response.data.mapProgress ?? "0%",
          album: response.data.album ?? [],
          achievements:
            response.data.achievements ??
            "Achievements section is empty for now.",
          statistics: response.data.statistics ?? { progress: "0%" },
          avatarUrl: response.data.profileImageUrl ?? null,
        });
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile data:", error);
      setLoading(false);
    }
  };

  const handleAddFriend = async (followerId: string, followedId: string) => {
    try {
      await axios.post(
        `http://18.156.173.171:5002/users/createFollow/${followerId}/${followedId}`,
      );
      getProfileData();
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  const handleRemoveFriend = async (followerId: string, followedId: string) => {
    try {
      await axios.delete(
        `http://18.156.173.171:5002/users/deleteFollow/${followerId}/${followedId}`,
      );
      getProfileData();
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  useEffect(() => {
    getProfileData();
  }, []);
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#273466" />
      </View>
    );
  }
  const renderContent = () => {
    switch (activeTab) {
      case "Album":
        return <Album album={userData?.album || []} />;
      case "Achievements":
        return (
          <Achievements
            achievements={
              userData?.achievements || "Achievements section is empty for now."
            }
          />
        );
      case "Statistics":
        return (
          <Statistics statistics={userData?.statistics || { progress: null }} />
        );
      default:
        return <Album album={userData?.album || []} />;
    }
  };

  return (
    <View style={styles.container}>
      {userData && <ProfileHeader userData={userData} />}
      <View style={styles.separator} />
      <View style={styles.tabButtons}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "Album" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("Album")}
        >
          <Icon
            name="book"
            size={24}
            color={activeTab === "Album" ? "#030E38" : "#aaa"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "Achievements" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("Achievements")}
        >
          <Icon
            name="trophy"
            size={24}
            color={activeTab === "Achievements" ? "#030E38" : "#aaa"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "Statistics" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("Statistics")}
        >
          <Icon
            name="bar-chart"
            size={24}
            color={activeTab === "Statistics" ? "#030E38" : "#aaa"}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.tabContainer}>{renderContent()}</View>
    </View>
  );
};

interface Post {
  postID: string;
  placeId: string;
  imageUrl: string;
  region?: string | null;
  date?: string | null;
  description: string;
  likes: number;
  comments: number;
  uid: string;
}

interface AlbumProps {
  uid: string;
}

interface Post {
  postID: string;
  placeId: string;
  imageUrl: string;
  region?: string | null;
  date?: string | null;
  description: string;
  likes: number;
  comments: number;
  uid: string;
}

interface AlbumProps {
  uid: string;
}

const Album: React.FC<AlbumProps> = ({ uid }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);

  useEffect(() => {
    fetch(`http://51.20.126.241:8081/post?uid=QsU3AzpnJadLo6LGfvB9o2b5yh92`)
      .then(response => response.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setLoading(false);
      });
  }, [uid]);

  if (loading) return <Text>Завантаження...</Text>;

  const uniqueRegions = Array.from(new Set(posts.map(post => post.region).filter(Boolean))) as string[];

  const regionImages: Record<string, string> = {};
  for (const post of posts) {
    if (post.region && !regionImages[post.region]) {
      regionImages[post.region] = post.imageUrl;
    }
  }

  const postsInRegion = selectedRegion ? posts.filter(p => p.region === selectedRegion) : [];

  const uniquePlacesInRegion = Array.from(new Set(postsInRegion.map(p => p.placeId).filter(Boolean))) as string[];

  const placeImages: Record<string, string> = {};
  const placeDescriptions: Record<string, string> = {};
  for (const post of postsInRegion) {
    if (post.placeId) {
      if (!placeImages[post.placeId]) {
        placeImages[post.placeId] = post.imageUrl;
      }
      if (!placeDescriptions[post.placeId]) {
        placeDescriptions[post.placeId] = post.description || post.placeId;
      }
    }
  }

  const postsForPlace = selectedPlace ? postsInRegion.filter(p => p.placeId === selectedPlace) : [];

  const boxSize = Dimensions.get('window').width / 2 - 20;

  return (
    <View style={styles.container}>

      {/* 1. Список областей */}
      {!selectedRegion && !selectedPlace && (
        <FlatList
          data={uniqueRegions}
          keyExtractor={(region) => region}
          numColumns={2}
          contentContainerStyle={{ padding: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.regionBox, { width: boxSize, height: boxSize }]}
              onPress={() => setSelectedRegion(item)}
            >
              <Image source={{ uri: regionImages[item] }} style={styles.regionImage} />
              <View>
                <Text style={styles.regionText}>{item}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {selectedRegion && !selectedPlace && (
        <View style={{ flex: 1, position: 'relative' }}>
          <TouchableOpacity
            onPress={() => setSelectedRegion(null)}
            style={styles.backButton1}
          >
            <Text style={styles.backText}>← Назад до областей</Text>
          </TouchableOpacity>

          <FlatList
            data={uniquePlacesInRegion}
            keyExtractor={(placeId) => placeId}
            numColumns={2}
            contentContainerStyle={{ padding: 10, paddingTop: 60 }} // Щоб не перекривати кнопку
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.regionBox, { width: boxSize, height: boxSize }]}
                onPress={() => setSelectedPlace(item)}
              >
                <Image source={{ uri: placeImages[item] }} style={styles.regionImage} />
                <View>
                  <Text style={styles.regionText}>{placeDescriptions[item]}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}


      {/* 3. Пости вибраної точки */}
      {selectedPlace && (
        <View style={{ flex: 1, position: 'relative' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
            <TouchableOpacity onPress={() => setSelectedPlace(null)} style={styles.backButton2}>
              <Text style={styles.backText}>← Назад до точок</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={postsForPlace}
            keyExtractor={item => item.postID}
            contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
            renderItem={({ item }) => (
              <View style={styles.postContainer}>
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
                <Text style={styles.description}>{item.description}</Text>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};


const Achievements = ({ achievements }: { achievements: string }) => {
  return (
    <View style={styles.tabContent}>
      <Text style={styles.mapText}>
        {achievements || "Achievements section is empty for now."}
      </Text>
    </View>
  );
};

const Statistics = ({
                      statistics,
                    }: {
  statistics: { progress: string | null };
}) => (
  <View style={styles.tabContent}>
    <ImageBackground
      source={require("../../../assets/images/map_statistic.png")}
      style={styles.statisticsBackground}
    >
      <View style={styles.statisticsContent}>
        <Text style={styles.statisticsText}>
          Progress: {statistics.progress || "0%"}
        </Text>
      </View>
    </ImageBackground>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  backButton1: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    elevation: 5,
    color: "#030E38",
  },
  backButton2: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    elevation: 5,
    fontWeight: 'bold',
    color: "#030E38",
  },
  header: {
    flex: 1,
    padding: 5,
    paddingBottom: 10,
    alignItems: "center",
    bottom: 55,
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    top: 70,
  },

  menuButton: {
    position: "absolute",
    right: 20,
    top: 65,
  },
  avatarContainer: {
    marginTop: 20,
    marginBottom: 10,
    top: 85,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 100,
    backgroundColor: "#ccc",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 83,
  },
  infoBox: {
    padding: 15,
    borderRadius: 8,
    width: "30%",
    alignItems: "center",
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#030E38",
  },
  infoContent: {
    fontSize: 16,
    color: "#030E38",
    marginTop: 5,
  },
  separator: {
    height: 1,
    backgroundColor: "#fff",
    width: "90%",
    alignSelf: "center",
    marginVertical: 10,
  },
  tabButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f5f5f5",
    paddingVertical: 10,
  },
  tabButton: {
    padding: 10,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: "#030E38",
  },
  tabContainer: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mapText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  statisticsText: {
    fontSize: 16,
    marginVertical: 5,
  },
  statisticsBackground: {
    width: 235,
    height: 160,
    resizeMode: "cover",
    marginBottom: 20,
    bottom: 20,
  },
  statisticsContent: {
    padding: 10,
    borderRadius: 10,
    position: "absolute",
    top: 180,
    left: 55,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#273466",
    borderRadius: 15,
    padding: 5,
  },
  albumContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  photoCard: {
    width: "45%",
    margin: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  photo: {
    width: "100%",
    height: 200,
  },
  photoInfo: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  photoText: {
    fontSize: 16,
    fontWeight: "bold",
  },

  labelText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },

  labelContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 14,
    marginBottom: 10,
  },
  commentsSection: {
    maxHeight: 100,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      padding: 1,
    },

    modalImage: {
      width: "100%",
      height: 300,
      borderRadius: 8,
      marginBottom: 12,
    },

  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageWrapper: {
    width: 5,
    height: 4,
    marginBottom: 4,
  },

  commentsContainer: {
    maxHeight: 100,
    width: '100%',
    marginBottom: 12,
  },
  postContainer: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
  },
  image: {
    width: '100%',
    height: 200,
  },
  description: {
    marginTop: 8,
    fontSize: 16,
    color: '#333',
  },

  regionBox: {
    width: 6,
    height: 6,
    margin: 5,
    backgroundColor: '#eee',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
  },
  regionImage: {
    width: '100%',
    height: '75%',
  },
  regionText: {
    paddingTop: 5,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backText: {
    fontWeight: 'bold',
    color: "#030E38",
    marginBottom: 10,
  },

});

export default ProfileScreen;