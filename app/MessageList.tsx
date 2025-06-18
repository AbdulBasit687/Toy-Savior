import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';

dayjs.extend(relativeTime);

export default function MessageList() {
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const currentUser = auth().currentUser;

  useEffect(() => {
  const uid = auth().currentUser?.uid;
  console.log("Current logged-in UID:", uid);
  if (!currentUser) return;

  try {
    const unsubscribe = firestore()
      .collection('chats')
      .where('participants', 'array-contains', currentUser.uid)
    //   .orderBy('updatedAt', 'desc')
      .onSnapshot(
        async (snapshot) => {
          if (!snapshot || !snapshot.docs) {
            console.log("Snapshot is null or malformed");
            setLoading(false);
            return;
          }

          console.log("Snapshot size:", snapshot.size);
          snapshot.forEach(doc => console.log("Chat ID:", doc.id, doc.data()));

          const chatList = await Promise.all(snapshot.docs.map(async (doc) => {
            const data = doc.data();
            const otherUserId = data.participants.find((id: string) => id !== currentUser.uid);

            let name = 'Unknown';
            let photoURL = '';

            try {
              const userDoc = await firestore().collection('users').doc(otherUserId).get();
              if (userDoc.exists) {
                const userData = userDoc.data();
                name = `${userData?.firstName ?? ''} ${userData?.lastName ?? ''}`;
                photoURL = userData?.photoURL ?? '';
              }
            } catch (err) {
              console.log('Error fetching user info:', err);
            }

            return {
              id: doc.id,
              name,
              photoURL,
              lastMessage: data.lastMessage ?? '',
              updatedAt: data.updatedAt?.toDate() ?? new Date(),
            };
          }));

          setChats(chatList);
          setLoading(false);
        },
        (error) => {
          console.error("❌ Firestore onSnapshot error:", error.message);
          setLoading(false);
        }
      );

    return () => unsubscribe();
  } catch (error) {
    console.error("🔥 Outer onSnapshot error:", error.message);
    setLoading(false);
  }
}, []);


  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#F4B731" />
      </View>
    );
  }

  return (
    <FlatList
      data={chats}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => router.push(({
    pathname: '/ChatScreen',
    params: {
      item: item,
    }
  }))}>
          <View style={{
            flexDirection: 'row',
            padding: 16,
            alignItems: 'center',
            borderBottomWidth: 1,
            borderColor: '#ddd'
          }}>
            <Image
              source={{ uri: item.photoURL || 'https://via.placeholder.com/50' }}
              style={{ width: 50, height: 50, borderRadius: 25, marginRight: 12 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.name}</Text>
              <Text numberOfLines={1} style={{ color: '#666' }}>{item.lastMessage}</Text>
              <Text style={{ fontSize: 10, color: 'gray' }}>
                {dayjs(item.updatedAt).fromNow()}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}
