// app/ChatScreen.tsx
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Bubble,
  GiftedChat,
  IMessage,
  InputToolbar,
} from "react-native-gifted-chat";

interface OtherUser {
  firstName: string;
  lastName: string;
  photoURL?: string;
  role: string;
  uid: string;
}

const ChatScreen = () => {
  // Get route params using Expo Router
  const params = useLocalSearchParams();
  const chatId = params.chatId as string;

  // Use useMemo to avoid re-parsing on every render
  const otherUser = useMemo(() => {
    if (params.otherUser) {
      try {
        return JSON.parse(params.otherUser as string) as OtherUser;
      } catch (e) {
        console.error("Failed to parse otherUser param:", e);
        return {} as OtherUser;
      }
    }
    return {} as OtherUser;
  }, [params.otherUser]);

  const [messages, setMessages] = useState<IMessage[]>([]);
  const currentUser = auth().currentUser;

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = firestore()
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .orderBy("timestamp", "desc")
      .onSnapshot(
        (snapshot) => {
          const messageList = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              _id: doc.id,
              text: data.text,
              createdAt: data.timestamp?.toDate() || new Date(),
              user: {
                _id: data.senderId,
                name: data.senderName,
                avatar:
                  data.senderId !== currentUser.uid
                    ? otherUser.photoURL || undefined
                    : undefined,
              },
            } as IMessage;
          });
          setMessages(messageList);
        },
        (error) => {
          console.error("Error fetching messages:", error);
        }
      );

    return unsubscribe;
  }, [chatId, currentUser, otherUser]);

  const onSend = useCallback(
    async (newMessages: IMessage[] = []) => {
      const message = newMessages[0];
      if (!currentUser) return;

      try {
        // Add message to subcollection
        await firestore()
          .collection("chats")
          .doc(chatId)
          .collection("messages")
          .add({
            text: message.text,
            senderId: currentUser.uid,
            senderName: currentUser.displayName || "User", // Simplified name handling
            timestamp: firestore.FieldValue.serverTimestamp(),
            type: "text",
            readBy: [currentUser.uid],
          });

        // Update last message in chat document
        await firestore()
          .collection("chats")
          .doc(chatId)
          .update({
            lastMessage: {
              text: message.text,
              senderId: currentUser.uid,
              timestamp: firestore.FieldValue.serverTimestamp(),
              type: "text",
            },
            updatedAt: firestore.FieldValue.serverTimestamp(),
          });
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
    [chatId, currentUser]
  );

  const renderBubble = (props: any) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#007AFF",
          },
          left: {
            backgroundColor: "#E5E5EA",
          },
        }}
        textStyle={{
          right: {
            color: "#FFFFFF",
          },
          left: {
            color: "#000000",
          },
        }}
      />
    );
  };

  const renderInputToolbar = (props: any) => {
    return <InputToolbar {...props} containerStyle={styles.inputToolbar} />;
  };

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: currentUser?.uid || "unknown",
        }}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        placeholder="Type a message..."
        alwaysShowSend
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dummyButton: {
    backgroundColor: "#007AFF",
    marginHorizontal: 16,
    marginVertical: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  dummyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  chatItem: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
    backgroundColor: "#FFFFFF",
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  defaultAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    flex: 1,
  },
  userRole: {
    fontSize: 12,
    color: "#8E8E93",
    backgroundColor: "#F2F2F7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
  },
  timestamp: {
    fontSize: 12,
    color: "#8E8E93",
  },
  lastMessage: {
    fontSize: 14,
    color: "#8E8E93",
  },
  emptyContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#8E8E93",
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 20,
  },
  inputToolbar: {
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    backgroundColor: "#FFFFFF",
  },
});

export default ChatScreen;
