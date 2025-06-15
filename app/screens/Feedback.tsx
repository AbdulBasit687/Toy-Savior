import { Ionicons } from '@expo/vector-icons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function Feedback() {
    const router = useRouter();
  const currentUser = auth().currentUser;
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [type, setType] = useState('Suggestion');
  const [rating, setRating] = useState(0);

  const feedbackTypes = ['Suggestion', 'Bug Report', 'General Feedback', 'Help'];

  const handleSubmit = async () => {
    if (!subject || !message) {
      Alert.alert('Error', 'Please fill out all required fields.');
      return;
    }

    try {
      await firestore().collection('feedback').add({
        uid: currentUser?.uid || null,
        email,
        subject,
        message,
        type,
        rating,
        timestamp: firestore.FieldValue.serverTimestamp(),
      });
      Alert.alert('Thank You!', 'Your feedback has been submitted.');
      setSubject('');
      setMessage('');
      setRating(0);
    } catch (error) {
      Alert.alert('Error', 'Failed to send feedback.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.heading}>We’d love your feedback!</Text>

      {/* Feedback Type */}
      <Text style={styles.label}>Feedback Type</Text>
      <View style={styles.typeSelector}>
        {feedbackTypes.map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.typeButton, type === t && styles.selectedType]}
            onPress={() => setType(t)}
          >
            <Text style={styles.typeButtonText}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Subject */}
      <TextInput
        placeholder="Subject"
        style={styles.input}
        value={subject}
        onChangeText={setSubject}
      />

      {/* Message */}
      <TextInput
        placeholder="Message"
        style={[styles.input, styles.textarea]}
        value={message}
        onChangeText={setMessage}
        multiline
        numberOfLines={4}
      />

      {/* Email */}
      <TextInput
        placeholder="Email (optional)"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* Star Rating */}
      <Text style={styles.label}>Rate Us</Text>
      <View style={styles.ratingRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Ionicons
              name={rating >= star ? 'star' : 'star-outline'}
              size={28}
              color="#F4B731"
              style={{ marginHorizontal: 4 }}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Submit */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Feedback</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    paddingTop: 40,
    backgroundColor: '#fff', 
    flex: 1 
},
  content: { 
    padding: 24, 
    paddingTop: 70 
},
  backButton: {
    position: 'absolute',
    top: 24,
    left: 20,
    backgroundColor: '#F4B731',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'BalooTammudu2-SemiBold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    fontFamily: 'ABeeZee-Regular',
    color: '#444',
  },
  input: {
    backgroundColor: '#F5F5F5',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 14,
    fontFamily: 'ABeeZee-Regular',
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  typeButton: {
    backgroundColor: '#eee',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedType: {
    backgroundColor: '#F4B731',
  },
  typeButtonText: {
    fontSize: 13,
    fontFamily: 'ABeeZee-Regular',
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#F4B731',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'ABeeZee-Regular',
  },
});
