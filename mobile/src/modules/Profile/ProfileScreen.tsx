import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth } from "firebase/auth";
import axios from "axios";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";

const ProfileHeader = ({ userData }: { userData: UserProfile | null }) => {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("../../../assets/images/background.png")}
      style={styles.header}
    >
      <TouchableOpacity
        style={styles.backButton}
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
              <View style={styles.avatar} /> // Порожнє коло як заглушка
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

interface UserProfile {
  name: string | null;
  friends: number | null;
  visitedPlaces: number | null;
  mapProgress: string | null;
  album: any[];
  achievements: string;
  statistics: {
    progress: string | null;
  };
  avatarUrl?: string | null;
}

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
          //, {headers: { Authorization: `Bearer ${token}` },}
        );

        // Отримуємо кількість друзів через getFollowing
        const friendsResponse = await axios.get(
          `http://18.156.173.171:5002/users/getFollowing/${uid}`,
          //, {headers: { Authorization: `Bearer ${token}` },}
        );

        setUserData({
          name: response.data.username || user.displayName,
          friends: friendsResponse.data.length ?? 0, // Кількість друзів
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
      // Викликаємо API для створення слідкування
      await axios.post(
        `http://18.156.173.171:5002/users/createFollow/${followerId}/${followedId}`,
      );
      // Після цього повторно отримуємо список друзів
      getProfileData();
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  const handleRemoveFriend = async (followerId: string, followedId: string) => {
    try {
      // Викликаємо API для видалення слідкування
      await axios.delete(
        `http://18.156.173.171:5002/users/deleteFollow/${followerId}/${followedId}`,
      );
      // Після цього повторно отримуємо список друзів
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

const Album = ({ album }: { album: any[] }) => {
  const router = useRouter();

  const handlePress = (city) => {
    switch (city) {
      case "Lviv":
        router.push("/albumlvivscreen");
        break;
      case "Kyiv":
        router.push("/albumkyivscreen");
        break;
      case "Uzhhorod":
        router.push("/albumuzhhorodscreen");
        break;
      case "Cherkasy":
        router.push("/albumcherkasyscreen");
        break;
      case "Odesa":
        router.push("/albumodesascreen");
        break;
      case "Kharkiv":
        router.push("/albumkharkivscreen");
        break;
      default:
        break;
    }
  };

  const cities = [
    {  name: "Lviv", url:"data:image/jpeg;base64,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"},
    { name: "Kyiv", url: "data:image/jpeg;base64,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" },
    { name: "Uzhhorod", url: "data:image/jpeg;base64,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" },
    { name: "Cherkasy", url: "data:image/jpeg;base64,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" },
    { name: "Odesa", url: "data:image/jpeg;base64,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" },
    { name: "Kharkiv", url: "data:image/jpeg;base64,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" }
  ];

  return (
    <View style={styles.grid}>
      {cities.map((city, index) => (
        <TouchableOpacity key={index} onPress={() => handlePress(city.name)}>
          <ImageBackground
            source={{ uri: city.url }}
            style={styles.photoBox}
            imageStyle={{ borderRadius: 10 }}
          >
            <Text style={styles.photoText}>{city.name}</Text>
          </ImageBackground>
        </TouchableOpacity>
      ))}
    </View>
  );
};
const Achievements = ({ achievements }: { achievements: string }) => {
  console.log("Achievements prop:", achievements);
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
  header: {
    flex: 1,
    padding: 5,
    paddingBottom: 10,
    alignItems: "center",
    bottom: 55,
  },
  profileName: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    top: 70,
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: 63,
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    margin: 20,
  },
  photoBox: {
    width: 100,
    height: 100,
    backgroundColor: "#ccc",
    borderRadius: 10,
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    margin: 20,
  },
  photoBox: {
    width: 100,
    height: 100,
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  photoText: {
    color: "#fff",
    fontWeight: "bold",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
    textAlign: "center",
  },
});

export default ProfileScreen;
