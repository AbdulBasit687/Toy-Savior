// File path: /app/splash.tsx
import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Splash() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 3000); // Navigate after 3 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ToySavior</Text>
      <Text style={styles.subtitle}>Where Toys Find New Life</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#F4B831',
    justifyContent: 'center', alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold', // Use fontFamily: 'Poppins-Bold' if using custom fonts
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 10,
    color: '#333',
  },
});
