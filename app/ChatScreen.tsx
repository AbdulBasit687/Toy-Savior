// File: /app/ChatScreen/[chatId].tsx
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const currentUser = auth().currentUser;
  const flatListRef = useRef(null);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .doc(id as string)
      .collection('messages')
      .orderBy('timestamp', 'asc')
      .onSnapshot(snapshot => {
        const msgs = snapshot.docs.map(doc => doc.data());
        console.log(msgs)
        setMessages(msgs);
      });

    return () => unsubscribe();
  }, [id]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const receiverId = id?.split('_').find(id => id !== currentUser.uid);
    const newMessage = {
      senderId: currentUser.uid,
      receiverId,
      text: input,
      timestamp: firestore.FieldValue.serverTimestamp(),
      messageType: 'text'
    };

    const chatRef = firestore().collection('chats').doc(id);
    await chatRef.collection('messages').add(newMessage);
    await chatRef.update({
      lastMessage: input,
      updatedAt: firestore.FieldValue.serverTimestamp()
    });

    setInput('');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <View style={{
            alignSelf: item.senderId === currentUser.uid ? 'flex-end' : 'flex-start',
            backgroundColor: item.senderId === currentUser.uid ? '#DCF8C5' : '#E8E8E8',
            marginVertical: 4,
            marginHorizontal: 10,
            padding: 10,
            borderRadius: 10,
            maxWidth: '70%'
          }}>
            <Text>{item.text}</Text>
            <Text style={{ fontSize: 10, color: 'gray', marginTop: 4 }}>
              {item.timestamp?.toDate()?.toLocaleTimeString()}
            </Text>
          </View>
        )}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <View style={{ flexDirection: 'row', padding: 10 }}>
        <TextInput
          value={input}
          onChangeText={setInput}
          style={{
            flex: 1,
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 20,
            paddingHorizontal: 12
          }}
          placeholder="Type a message"
        />
        <TouchableOpacity onPress={sendMessage} style={{ paddingHorizontal: 12, justifyContent: 'center' }}>
          <Text style={{ color: '#007AFF', fontWeight: 'bold' }}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
