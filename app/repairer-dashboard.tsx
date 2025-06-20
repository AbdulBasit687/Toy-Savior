import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRouter } from 'expo-router';
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
dayjs.extend(relativeTime);

const categories = ["All", "Toys", "Drones", "Consoles", "Rides"];

export default function RepairerDashboard() {
    const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("All");
  const [requests, setRequests] = useState<any[]>([]);

 useEffect(() => {
  const currentUser = auth().currentUser;
  if (!currentUser) return;

  const unsubscribe = firestore()
    .collection("repairRequests")
    .orderBy("createdAt", "desc")
    .onSnapshot(async (snapshot) => {
      const fetchedRequests = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const data = doc.data();
          let userName = "Unknown";

          if (data.userId) {
            const userDoc = await firestore().collection("users").doc(data.userId).get();
            if (userDoc.exists) {
              const userData = userDoc.data();
              userName = `${userData?.firstName || ""} ${userData?.lastName || ""}`;
            }
          }

          return {
            id: doc.id,
            ...data,
            userName,
          };
        })
      );

      const visibleRequests = fetchedRequests.filter(
        req => !req.rejectedBy?.includes(currentUser.uid)
      );

      setRequests(visibleRequests);
    });

  return () => unsubscribe();
}, []);

const handleReject = async (requestId: string) => {
  const currentUser = auth().currentUser;
  if (!currentUser) return;

  await firestore()
    .collection("repairRequests")
    .doc(requestId)
    .update({
      rejectedBy: firestore.FieldValue.arrayUnion(currentUser.uid),
    });
};

  const filteredRequests = activeCategory === "All"
    ? requests
    : requests.filter(req => req.toyType === activeCategory.slice(0, -1));

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.pageTitle}>Repair Requests</Text>
      </View>

      <View style={styles.categoryRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              onPress={() => setActiveCategory(cat)}
              style={[styles.catBtn, activeCategory === cat && styles.catBtnActive]}
            >
              <Text style={[styles.catText, activeCategory === cat && styles.catTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.cardList}>
        {filteredRequests.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardRow}>
              <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{item.toyName}</Text>
                <Text style={styles.cardDesc} numberOfLines={2}>{item.description} <Text style={styles.seeMore}>See More</Text></Text>
                <Text style={styles.uploadedBy}>Uploaded By : <Text style={styles.cardDesc}>{item.userName || 'Unknown'}</Text></Text>
                <Text style={styles.metaText}>
  🕒 {dayjs(item.createdAt?.toDate?.()).fromNow()} – {item.area || 'Unknown Area'}
</Text>
              </View>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.rejectBtn} onPress={() => handleReject(item.id)}>
  <Text style={styles.rejectText}>Reject</Text>
</TouchableOpacity>

              <TouchableOpacity
  style={styles.acceptBtn}
  onPress={() =>
    router.push({
      pathname: '/screens/RepairRequestDetail',
      params: { data: JSON.stringify(item) }
    })
  }
>
  <Text style={styles.acceptText}>View</Text>
</TouchableOpacity>

            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.footer}>
  <TouchableOpacity style={styles.footerItem}>
    <Image source={require('../assets/icons/home.png')} style={styles.footerIcon} />
  </TouchableOpacity>
  <TouchableOpacity style={styles.footerItem} onPress={() => router.push('/screens/MessageListRepairer')}>
    <Image source={require('../assets/icons/message.png')} style={styles.footerIcon} />
  </TouchableOpacity>
  <TouchableOpacity style={styles.footerItem} onPress={() => router.push('../screens/RepairerProfile')}>
    <Image source={require('../assets/icons/profile.png')} style={styles.footerIconprofile} />
  </TouchableOpacity>
</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 50 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "BalooTammudu2-SemiBold",
    marginLeft: 95,
  },
  categoryRow: {
    paddingLeft: 16,
    marginBottom: 8,
  },
  catBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    marginRight: 8,
  },
  catBtnActive: {
    backgroundColor: "#F4B731",
  },
  catText: {
    color: "#555",
    fontSize: 13,
    fontFamily: "ABeeZee-Regular",
  },
  catTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  cardList: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: "#F2F2F2",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardRow: { 
    flexDirection: "row", 
    marginBottom: 8 
  },
  cardImage: { 
    width: 40, 
    height: 40, 
    marginRight: 10, 
    resizeMode: "cover", 
    borderRadius: 6 
  },
  cardInfo: { 
    flex: 1 
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
    color: "#555",
    fontWeight: "600",
  },
  uploadedBy: {
    fontSize: 12,
    marginTop: 4,
    fontFamily: "ABeeZee-Regular",
    fontWeight: "bold"
  },
  boldText: { 
    fontWeight: "bold" 
  },
  metaText: {
    fontSize: 11,
    color: "#888",
    fontFamily: "ABeeZee-Regular",
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  rejectBtn: {
    flex: 1,
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    marginRight: 8,
    alignItems: "center",
  },
  acceptBtn: {
    flex: 1,
    backgroundColor: "#F4B731",
    borderRadius: 20,
    paddingVertical: 8,
    alignItems: "center",
  },
  rejectText: {
    color: "#000",
    fontWeight: "bold",
    fontFamily: "ABeeZee-Regular",
  },
  acceptText: {
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "ABeeZee-Regular",
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingBottom: 40,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 999,
  },
  footerItem: {
    alignItems: 'center',
    justifyContent: 'center',
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