import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function EmailSent() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Email Sent Icon */}
    <Image
  //source={require('../../assets/images/email.png')}
  style={styles.image}
  resizeMode="contain"
/>


      {/* Confirmation Message */}
      <Text style={styles.text}>
        We've sent you an email to reset your password.
        Please check your inbox and follow the instructions.
      </Text>

      {/* Return to Login */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace('/login')} // Updated path to match your actual login route
      >
        <Text style={styles.buttonText}>Return to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#000',
    fontWeight: '500',
    fontFamily: 'BalooTammudu2-SemiBold',
  },
  button: {
    backgroundColor: '#F4B731',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 24,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: 'ABeeZee-Regular',
  },
});
