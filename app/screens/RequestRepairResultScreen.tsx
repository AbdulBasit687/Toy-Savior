// File: /app/screens/RequestRepairResultScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function RequestRepairResultScreen() {
  const { data } = useLocalSearchParams();

  if (!data) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No data available</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/dashboard')}>
          <Text style={styles.submitText}>Go to Dashboard</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const parsedData = typeof data === 'string' ? JSON.parse(data) : data;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => router.replace('/dashboard')} style={styles.backIcon}>
        <Ionicons name="chevron-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Request Summary</Text>

      <Text style={styles.label}>Toy Name / Title:</Text>
      <Text style={styles.textValue}>{parsedData.toyName}</Text>

      <Text style={styles.label}>Description / Issue:</Text>
      <Text style={styles.textValue}>{parsedData.description}</Text>

      <Text style={styles.label}>Urgency of Repair:</Text>
      <Text style={styles.textValue}>{parsedData.urgency}</Text>

      <Text style={styles.label}>Toy Type:</Text>
      <Text style={styles.textValue}>{parsedData.toyType}</Text>

      <Text style={styles.label}>Uploaded Image:</Text>
      {parsedData.imageUrl ? (
        <Image source={{ uri: parsedData.imageUrl }} style={styles.image} />
      ) : (
        <Text style={styles.textValue}>No Image</Text>
      )}

      <TouchableOpacity style={styles.submitButton} onPress={() => router.replace('/dashboard')}>
        <Text style={styles.submitText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flexGrow: 1 },
  backIcon: {
    backgroundColor: '#F4B731',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'BalooTammudu2-SemiBold',
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 4,
    fontSize: 15,
  },
  textValue: {
    fontSize: 16,
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
  submitButton: {
    backgroundColor: '#F4B731',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 30,
  },
  submitText: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: 16,
  },
});
