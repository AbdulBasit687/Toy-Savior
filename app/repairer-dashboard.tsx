import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const categories = ["All", "Toys", "Drones", "Consoles", "Rides"];

const requests = [
  {
    id: "1",
    title: "SkyTracker Pro X5",
    description:
      "The drone’s propellers are not spinning correctly, causing it to lose balance mid-flight. Possible motor or gear damage.",
    user: "Hassam Saleh",
    time: "12 mins ago",
    distance: "2.8 km",
    location: "Downtown Tech Hub",
    image: require("../assets/toys/drone.png"),
  },
  {
    id: "2",
    title: "ROG ALLY AMD Rayzen Z1",
    description:
      "The HDMI port of this gaming console is loose and console is not displaying anything on the TV.",
    user: "Steve Harvey",
    time: "15 mins ago",
    distance: "4.0 km",
    location: "Maple Avenue",
    image: require("../assets/toys/newtoy.png"),
  },
  {
    id: "3",
    title: "360 Rolling Twister Car",
    description:
      "The remote control car is not responding to the controller. Likely issues include signal interference, damaged receiver module, or depleted batteries.",
    user: "Hassam Saleh",
    time: "20 mins ago",
    distance: "3.2 km",
    location: "Park Avenue",
    image: require("../assets/toys/car.png"),
  },
];

export default function RepairerDashboard() {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Repair Requests</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setActiveCategory(cat)}
            style={[
              styles.categoryBtn,
              activeCategory === cat && styles.categoryBtnActive,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                activeCategory === cat && styles.categoryTextActive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Requests */}
      <ScrollView contentContainerStyle={styles.cardList} style={{ flex: 1 }}>
        {requests.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardRow}>
              <Image source={item.image} style={styles.cardImage} />
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDesc} numberOfLines={2}>
                  {item.description}{" "}
                  <Text style={styles.seeMore}>See More</Text>
                </Text>
                <Text style={styles.uploadedBy}>
                  Uploaded By : <Text style={styles.boldText}>{item.user}</Text>
                </Text>
                <Text style={styles.metaText}>
                  🕒 {item.time}, 📍 {item.distance} – {item.location}
                </Text>
              </View>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.rejectBtn}>
                <Text style={styles.rejectText}>Reject</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.viewBtn}>
                <Text style={styles.viewText}>View</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity>
          <Ionicons name="home-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="bookmark" size={24} color="#F4B731" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="chatbox-ellipses-outline" size={24} color="#555" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="person-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backBtn: {
    backgroundColor: "#F4B731",
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "ABeeZee-Regular",
  },
  categoryScroll: {
    flexDirection: "row",
    marginBottom: 10,
  },
  categoryBtn: {
    paddingHorizontal: 15,
  paddingVertical: 15,
  backgroundColor: "#F5F5F5",
  borderRadius: 30,
  marginRight: 5,
  alignItems: "center",
  },
  categoryBtnActive: {
    backgroundColor: "#F4B731",
  },
  categoryText: {
    fontFamily: "ABeeZee-Regular",
  fontSize: 14,
  color: "#555",
  },
  categoryTextActive: {
  fontWeight: "bold",
  color: "#000",
  },
  cardList: {
    paddingBottom: 80,
  },
  card: {
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: "row",
  },
  cardImage: {
    width: 40,
    height: 40,
    marginRight: 12,
    resizeMode: "contain",
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 14,
    fontFamily: "BalooTammudu2-SemiBold",
  },
  cardDesc: {
    fontSize: 12,
    color: "#333",
    fontFamily: "ABeeZee-Regular",
  },
  seeMore: {
    color: "#007AFF",
  },
  uploadedBy: {
    fontSize: 12,
    marginTop: 4,
    fontFamily: "ABeeZee-Regular",
  },
  boldText: {
    fontWeight: "bold",
  },
  metaText: {
    fontSize: 10,
    color: "#666",
    marginTop: 2,
    fontFamily: "ABeeZee-Regular",
  },
  buttonRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 12,
  gap: 10,
  },
  rejectBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 20,
    paddingVertical: 8,
    marginRight: 8,
    alignItems: "center",
  },
  rejectText: {
    fontFamily: "ABeeZee-Regular",
  },
  viewBtn: {
    flex: 1,
    backgroundColor: "#F4B731",
    borderRadius: 20,
    paddingVertical: 8,
    alignItems: "center",
  },
  viewText: {
    fontFamily: "ABeeZee-Regular",
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
});
