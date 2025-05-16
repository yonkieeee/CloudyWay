import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const mockData = [
  { title: "Theatre", image: null },
  { title: "Opera", image: null },
  { title: "Museum", image: null },
  { title: "Park", image: null },
  { title: "Castle", image: null },
  { title: "Gallery", image: null },
];

const Citylviv3 = () => {
  const { city } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>{city || "Lviv"}</Text>

      <ScrollView contentContainerStyle={styles.grid}>
        {mockData.map((item, idx) => (
          <TouchableOpacity key={idx} style={styles.card}>
            <View style={styles.imagePlaceholder} />
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSubtitle}>..................</Text>
            <Text style={styles.cardSubtitle}>..................</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F1B41",
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 16,
    zIndex: 1,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "47%",
    backgroundColor: "#aaa",
    borderRadius: 10,
    marginBottom: 15,
    padding: 8,
    alignItems: "center",
  },
  imagePlaceholder: {
    width: "100%",
    height: 80,
    backgroundColor: "#ddd",
    borderRadius: 8,
    marginBottom: 8,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#fff",
  },
  cardSubtitle: {
    color: "#fff",
    fontSize: 12,
    lineHeight: 14,
  },
});


export default Lviv2025;
