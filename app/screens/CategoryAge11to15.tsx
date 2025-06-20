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
import UploadOptionsSheet from '../../components/UploadOptionsSheet';

export default function CategoryAge11to15() {
  const router = useRouter();
  const [toys, setToys] = useState([]);
  const [sheetVisible, setSheetVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('products')
      .where('toyType', '==', '11-15 years')
      .onSnapshot(snapshot => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setToys(items);
      });

    return () => unsubscribe();
  }, []);
  const handleOptionSelect = (option: string) => {
    setSheetVisible(false);
    switch (option) {
      case 'repair':
        router.push('/screens/RequestRepair');
        break;
      case 'sell':
        router.push('/screens/SellToy');
        break;
      case 'donate':
        router.push('/screens/DonateToy');
        break;
    }
  };

 const renderItem = ({ item }) => (
  <TouchableOpacity
    onPress={() =>
      router.push({
        pathname: '/screens/SellToyResultScreen',
        params: {
          data: JSON.stringify({ ...item, fromCategory: true }) // ✅ add flag
        }
      })
    }
  >
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardPrice}>Rs. {item.price}</Text>
    </View>
  </TouchableOpacity>
);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>11 - 15 Years</Text>

      <FlatList
        data={toys}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      />
      <View style={styles.footer}>
              <TouchableOpacity style={styles.footerItem}>
                <Image source={require('../../assets/icons/home.png')} style={styles.footerIcon} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.footerItem} onPress={() => setSheetVisible(true)}>
                <Image source={require('../../assets/icons/upload.png')} style={styles.footerIconupload} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/MessageList')}>
                <Ionicons name="chatbubble-ellipses-outline" size={28} color="#333" 
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.footerItem} onPress={() => router.push('/screens/ProfileScreen')}>
                <Image source={require('../../assets/icons/profile.png')} style={styles.footerIconprofile} />
              </TouchableOpacity>
            </View>
            <UploadOptionsSheet
                    visible={sheetVisible}
                    onClose={() => setSheetVisible(false)}
                    onSelect={handleOptionSelect}
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
    backgroundColor: '#F5F5F5',
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
   footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingBottom: 40,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 999,
  },
  footerItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerIcon: {
    width: 24,
    height: 24,
  },
  footerIconupload: {
    width: 20,
    height: 23,
  },
  footerIconprofile: {
    width: 16,
    height: 23,
  },
});
