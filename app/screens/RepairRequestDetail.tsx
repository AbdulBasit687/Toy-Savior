import { Ionicons } from "@expo/vector-icons";
import auth from "@react-native-firebase/auth";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { createOrGetChat } from "../../utils/chatUtils";

export default function RepairRequestDetail() {
  const { data } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const currentUser = auth().currentUser;

  useEffect(() => {
    console.log("RepairRequestDetail data:", data);
  }, [data]);
  const handleChatPress = async () => {
    if (!parsedData || !currentUser) {
      Alert.alert("Error", "Cannot start chat at this time");
      return;
    }

    try {
      setLoading(true);

      // Create or get existing chat with the user
      const otherUserData = {
        uid: parsedData.userId,
        firstName: parsedData.userName?.split(" ")[0] || "User",
        lastName: parsedData.userName?.split(" ")[1] || "",
        role: "user",
      };

      // Create or get a chat between the current user and the toy owner
      const chatId = await createOrGetChat(parsedData.userId, otherUserData);

      // Navigate to the chat screen
      router.push({
        pathname: "/ChatScreen",
        params: {
          chatId,
          chatName: parsedData.userName || "User",
          otherUser: JSON.stringify(otherUserData),
        },
      });
    } catch (error) {
      console.error("Error creating or getting chat: ", error);
      Alert.alert("Error", "Unable to start chat. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (!data) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No data available</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
      </View>
    );
  }

  const parsedData = typeof data === "string" ? JSON.parse(data) : data;

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: 50 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.title}>Request Service</Text>

        {/* Image */}
        {parsedData.imageUrl && (
          <Image source={{ uri: parsedData.imageUrl }} style={styles.image} />
        )}

        {/* Toy Name */}
        <Text style={styles.toyName}>{parsedData.toyName}</Text>
        {/* Proposed Price */}
        {parsedData.priceRange && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Proposed Price</Text>
            <Text style={styles.sectionText}>Rs. {parsedData.priceRange}</Text>
          </View>
        )}

        {/* Category */}
        <View style={styles.infoBoxGray}>
          <Text style={styles.infoLabel}>Category</Text>
          <Text style={styles.infoValue}>{parsedData.toyType}</Text>
        </View>

        {/* Urgency */}
        <View style={styles.infoBoxYellow}>
          <Text style={styles.infoLabelBlack}>Urgency Of Repair</Text>
          <Text style={styles.infoValueBold}>{parsedData.urgency}</Text>
        </View>
        {/* Area */}
        {parsedData.area && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Area</Text>
            <Text style={styles.sectionText}>{parsedData.area}</Text>
          </View>
        )}
        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Location</Text>
          <Text style={styles.sectionText}>{parsedData.location || "N/A"}</Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Description</Text>
          <Text style={styles.sectionText}>{parsedData.description}</Text>
        </View>

        {/* Send Request Button (optional action) */}
        <TouchableOpacity style={styles.submitButton} onPress={handleChatPress}>
          <Text style={styles.submitText}>Send Request</Text>
        </TouchableOpacity>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => router.push("/repairer-dashboard")}
        >
          <Image
            source={require("../../assets/icons/home.png")}
            style={styles.footerIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem}>
          <Image
            source={require("../../assets/icons/message.png")}
            style={styles.footerIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => router.push("../screens/RepairerProfile")}
        >
          <Image
            source={require("../../assets/icons/profile.png")}
            style={styles.footerIconprofile}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  backIcon: {
    backgroundColor: "#F4B731",
    borderRadius: 20,
    padding: 6,
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "BalooTammudu2-SemiBold",
    textAlign: "center",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    resizeMode: "cover",
    marginBottom: 12,
  },
  toyName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "BalooTammudu2-SemiBold",
  },
  infoBoxGray: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 30,
    marginBottom: 12,
    backgroundColor: "#F5F5F5",
  },
  infoBoxYellow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 30,
    marginBottom: 20,
    backgroundColor: "#F4B731",
  },
  infoLabel: {
    fontSize: 16,
    fontFamily: "ABeeZee-Regular",
  },
  infoLabelBlack: {
    fontSize: 16,
    color: "#000",
    fontFamily: "ABeeZee-Regular",
  },
  infoValue: {
    fontSize: 14,
    fontFamily: "ABeeZee-Regular",
  },
  infoValueBold: {
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "ABeeZee-Regular",
  },
  section: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontWeight: "bold",
    marginBottom: 6,
    fontSize: 16,
    fontFamily: "BalooTammudu2-SemiBold",
  },
  sectionText: {
    fontSize: 14,
    fontFamily: "ABeeZee-Regular",
    color: "#333",
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: "#F4B731",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
  },
  submitText: {
    fontWeight: "bold",
    color: "#000",
    fontSize: 16,
    fontFamily: "ABeeZee-Regular",
  },
  chatButton: {
    backgroundColor: "#F4B731",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },
  chatButtonText: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: 16,
    fontFamily: "ABeeZee-Regular",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    paddingBottom: 40,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 999,
  },
  footerItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  footerIcon: {
    width: 24,
    height: 24,
  },
  footerIconupload: {
    width: 20,
    height: 23,
  },
  footerIconprofile: {
    width: 16,
    height: 23,
  },
});
