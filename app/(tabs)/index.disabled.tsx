import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome to ToySavior</Text>
      <Text style={styles.subtext}>You're logged in!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  heading: { fontSize: 24, fontFamily: 'Baloo', color: '#000' },
  subtext: { fontSize: 16, marginTop: 8, color: '#444' },
});
