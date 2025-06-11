// apps/(tabs)/SplashScreen.tsx
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const SplashScreen = () => {
  const router = useRouter();

useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('/login'); // navigate after 3 seconds
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>ToySavior</Text>
      <Text style={styles.tagline}>Where Toys Find New Life</Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4B731', // your yellow background
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 70,
    fontWeight: 'bold',
    color: 'black',
    fontFamily: 'BalooTammudu2-ExtraBold'
  },
  tagline: {
    fontSize: 20,
    marginTop: 10,
    color: 'black',
    fontFamily: 'BalooTammudu2-Regular'
  },
});