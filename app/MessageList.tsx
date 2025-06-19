import auth from "@react-native-firebase/auth";
import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { createDummyChat } from "../utils/chatUtils";

interface Chat {
  id: string;
  participants: string[];
  participantDetails: Record<string, ParticipantDetail>;
  lastMessage?: {
    text: string;
    timestamp: FirebaseFirestoreTypes.Timestamp;
    senderId: string;
  };
  updatedAt: FirebaseFirestoreTypes.Timestamp;
}

interface ParticipantDetail {
  firstName: string;
  lastName: string;
  photoURL?: string;
  role: string;
}

const ChatListScreen = () => {
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUser = auth().currentUser;

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = firestore()
      .collection("chats")
      .where("participants", "array-contains", currentUser.uid)
      .orderBy("updatedAt", "desc")
      .onSnapshot(
        (snapshot) => {
          const chatList = snapshot.docs.map((doc) => {
            const data = doc.data();
            if (!data || !data.participantDetails || !Array.isArray(data.participants)) {
              return null;
            }

            return {
              id: doc.id,
              ...data,
            } as Chat;
          }).filter(Boolean);

          setChats(chatList);
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching chats:", error);
          setLoading(false);
        }
      );

    return unsubscribe;
  }, [currentUser]);

  const getOtherParticipant = (
    participantDetails: Record<string, ParticipantDetail> | undefined
  ): ParticipantDetail => {
    if (!currentUser || !participantDetails) return {
      firstName: "Unknown",
      lastName: "",
      role: "User"
    };

    const otherUid = Object.keys(participantDetails).find(
      (uid) => uid !== currentUser.uid
    );

    return otherUid && participantDetails[otherUid]
      ? participantDetails[otherUid]
      : {
          firstName: "Unknown",
          lastName: "",
          role: "User",
        };
  };

  const formatTime = (
    timestamp: FirebaseFirestoreTypes.Timestamp | undefined
  ): string => {
    if (!timestamp) return "";

    const messageTime = timestamp.toDate();
    const now = new Date();
    const diffInHours =
      (now.getTime() - messageTime.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return messageTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return messageTime.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const renderChatItem = ({ item }: { item: Chat }) => {
    if (!item || !item.participantDetails) return null;

    const otherParticipant = getOtherParticipant(item.participantDetails);

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() =>
          router.push({
            pathname: "/ChatScreen",
            params: {
              chatId: item.id,
              chatName: `${otherParticipant.firstName} ${otherParticipant.lastName}`,
              otherUser: JSON.stringify(otherParticipant),
            },
          })
        }
      >
        <View style={styles.avatarContainer}>
          {otherParticipant.photoURL ? (
            <Image
              source={{ uri: otherParticipant.photoURL }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.defaultAvatar}>
              <Text style={styles.avatarText}>
                {otherParticipant.firstName?.charAt(0) ?? "?"}
                {otherParticipant.lastName?.charAt(0) ?? ""}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={styles.userName}>
              {otherParticipant.firstName} {otherParticipant.lastName}
            </Text>
            <Text style={styles.userRole}>{otherParticipant.role}</Text>
            <Text style={styles.timestamp}>
              {formatTime(item.lastMessage?.timestamp)}
            </Text>
          </View>

          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage?.text || "No messages yet"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const handleCreateDummyChat = async () => {
    try {
      setLoading(true);
      await createDummyChat();
      Alert.alert(
        "Success",
        "Dummy chat created successfully! Messages will appear over the next 20 seconds.",
        [{ text: "OK" }]
      );
    } catch (error: any) {
      Alert.alert("Error", "Failed to create dummy chat: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dummyButton}
        onPress={handleCreateDummyChat}
        disabled={loading}
      >
        <Text style={styles.dummyButtonText}>
          {loading ? "Creating..." : "Create Dummy Chat (Khalid ↔ Sarim)"}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          chats.length === 0 ? styles.emptyContainer : undefined
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No chats yet</Text>
            <Text style={styles.emptySubText}>
              Use the button above to create a dummy chat for testing
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default ChatListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  dummyButton: {
    backgroundColor: "#007AFF",
    marginHorizontal: 16,
    marginVertical: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  dummyButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
  chatItem: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
    backgroundColor: "#FFFFFF",
  },
  avatarContainer: { marginRight: 12 },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  defaultAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "#FFFFFF", fontSize: 18, fontWeight: "bold" },
  chatContent: { flex: 1 },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  userName: { flex: 1, fontSize: 16, fontWeight: "600", color: "#000000" },
  userRole: {
    fontSize: 12,
    color: "#8E8E93",
    backgroundColor: "#F2F2F7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
  },
  timestamp: { fontSize: 12, color: "#8E8E93" },
  lastMessage: { fontSize: 14, color: "#8E8E93" },
  emptyContainer: { flex: 1 },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: { fontSize: 16, color: "#8E8E93", marginBottom: 8 },
  emptySubText: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 20,
  },
});
