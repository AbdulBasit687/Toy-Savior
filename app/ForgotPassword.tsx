import { Ionicons } from '@expo/vector-icons';
import auth from '@react-native-firebase/auth';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Validation", "Please enter your email address.");
      return;
    }

    try {
      await auth().sendPasswordResetEmail(email);
      router.push('../(tabs)/EmailSent');
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.heading}>Forgot Password</Text>

      <TextInput
        placeholder="Enter Email address"
        placeholderTextColor="#888"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TouchableOpacity
        style={styles.continueButton}
        onPress={handleResetPassword}
      >
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 24,
    backgroundColor: '#F4B731',
    padding: 8,
    borderRadius: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    fontFamily: 'BalooTammudu2-SemiBold',
  },
  input: {
    backgroundColor: '#F4F4F4',
    padding: 14,
    borderRadius: 8,
    marginBottom: 24,
    fontFamily: 'ABeeZee-Regular',
  },
  continueButton: {
    backgroundColor: '#F4B731',
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  continueText: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 16,
    fontFamily: 'ABeeZee-Regular',
  },
});
