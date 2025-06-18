import { Ionicons } from '@expo/vector-icons';
import firestore from '@react-native-firebase/firestore';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function CategoryConsole() {
  const router = useRouter();
  const [toys, setToys] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('sellListings')
      .where('toyType', '==', 'Console')
      .onSnapshot(snapshot => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setToys(items);
      });

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
      <Text style={styles.cardTitle}>{item.toyName}</Text>
      <Text style={styles.cardPrice}>Rs. {item.price}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    <Text style={styles.title}>Console</Text>

      <FlatList
        data={toys}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backBtn: {
    backgroundColor: '#F4B731',
    borderRadius: 20,
    padding: 6,
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'BalooTammudu2-SemiBold',
  },
  grid: {
    paddingBottom: 100,
  },
  card: {
    width: 161,
    height: 281,
    backgroundColor: '#fff',
    margin: '1.5%',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginHorizontal: 9,
  },
  cardImage: {
    width: '100%',
    height: 220,
  },
  cardTitle: {
    paddingHorizontal: 10,
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'ABeeZee-Regular',
    marginTop: 8,
  },
  cardPrice: {
    paddingHorizontal: 10,
    fontSize: 13,
    fontFamily: 'ABeeZee-Regular',
    marginBottom: 10,
    color: '#555',
  },
});
