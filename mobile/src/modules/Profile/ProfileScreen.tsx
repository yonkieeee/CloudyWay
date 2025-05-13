import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
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
            <View style={styles.avatar} />
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
}

const getBlobFromUri = async (uri: string) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  return blob;
};

const handlePickAndUpload = async () => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // заміна на новий API
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
        [{ resize: { width: 800 } }], // Зменшення розміру
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

const Album = ({ album }: { album: any[] }) => (
  <View style={styles.tabContent}>
    <View style={styles.grid}>
      {Array(6)
        .fill(null)
        .map((_, index) => (
          <View key={index} style={styles.photoBox}></View>
        ))}
    </View>
  </View>
);

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
});

export default ProfileScreen;
