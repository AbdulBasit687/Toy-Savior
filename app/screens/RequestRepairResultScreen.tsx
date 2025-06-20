// Import necessary libraries
import { Ionicons } from '@expo/vector-icons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function RepairRequestDetail() {
  const { data } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSendRequest = async () => {
    if (!data) return;

    setLoading(true);

    try {
      const currentUser = auth().currentUser;
      if (!currentUser) return;

      // Create a new message document in Firestore
      const chatRef = firestore().collection("chats").doc();  // Create a new chat document
      const message = {
        senderId: currentUser.uid,
        text: `Repair request for ${data.toyName}: ${data.description}`,
        timestamp: firestore.FieldValue.serverTimestamp(),
      };

      // Add the message to the chat document
      await chatRef.set({
        participants: [currentUser.uid, data.userId],
        participantDetails: {
          [currentUser.uid]: {
            firstName: currentUser.displayName,
            role: 'Repairer',
          },
          [data.userId]: {
            firstName: data.userName,
            role: 'User',
          },
        },
        lastMessage: message,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

      // Optionally navigate to the message list screen
      router.push('/message-list');

    } catch (error) {
      console.error("Error sending request:", error);
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

  const parsedData = typeof data === 'string' ? JSON.parse(data) : data;

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 50 }}>
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

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Description</Text>
          <Text style={styles.sectionText}>{parsedData.description}</Text>
        </View>

        {/* Send Request Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSendRequest}
          disabled={loading}
        >
          <Text style={styles.submitText}>
            {loading ? "Sending..." : "Send Request"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => router.push('/repairer-dashboard')}
        >
          <Image
            source={require('../../assets/icons/home.png')}
            style={styles.footerIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem}>
          <Image
            source={require('../../assets/icons/message.png')}
            style={styles.footerIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => router.push('../screens/RepairerProfile')}
        >
          <Image
            source={require('../../assets/icons/profile.png')}
            style={styles.footerIconprofile}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  scrollContainer: { paddingHorizontal: 24, paddingBottom: 100 },
  backIcon: { backgroundColor: '#F4B731', borderRadius: 20, padding: 6, alignSelf: 'flex-start', marginBottom: 16 },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  image: { width: '100%', height: 180, borderRadius: 10, resizeMode: 'cover', marginBottom: 12 },
  toyName: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  section: { marginBottom: 16 },
  sectionLabel: { fontWeight: 'bold', marginBottom: 6, fontSize: 16 },
  sectionText: { fontSize: 14, color: '#333' },
  submitButton: { backgroundColor: '#F4B731', padding: 16, borderRadius: 30, alignItems: 'center', marginTop: 20 },
  submitText: { fontWeight: 'bold', color: '#000', fontSize: 16 },
  footer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 10, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee', position: 'absolute', bottom: 0, left: 0, right: 0, height: 100 },
  footerItem: { alignItems: 'center', justifyContent: 'center' },
  footerIcon: { width: 24, height: 24 },
  footerIconprofile: { width: 16, height: 23 },
});
