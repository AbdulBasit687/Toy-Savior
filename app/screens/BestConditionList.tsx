import { Ionicons } from '@expo/vector-icons';
import firestore from '@react-native-firebase/firestore';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default function BestConditionList() {
  const router = useRouter();
  const [toys, setToys] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('products')
      .onSnapshot(snapshot => {
        const items = snapshot.docs
          .map(doc => {
            const data = doc.data();
            const condition = parseInt(data.condition);
            return { id: doc.id, ...data, condition };
          })
          .filter(item => item.condition > 6);
        setToys(items);
      });

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: '/screens/SellToyResultScreen',
          params: {
            data: JSON.stringify({ ...item, fromCategory: true }),
          },
        })
      }
      style={styles.card}
    >
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardPrice}>Rs. {item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Best Condition Toys</Text>

      {/* Grid */}
      <FlatList
        data={toys}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No toys found with condition above 6.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
    paddingBottom: 140,
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
    fontSize: 14,
    fontWeight: 'bold',
    marginHorizontal: 10,
    marginTop: 8,
    fontFamily: 'ABeeZee-Regular',
  },
  cardPrice: {
    fontSize: 13,
    color: '#555',
    marginHorizontal: 10,
    marginBottom: 10,
    fontFamily: 'ABeeZee-Regular',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 100,
    fontSize: 16,
    color: '#888',
  },
});
