import UploadOptionsSheet from '@/components/UploadOptionsSheet';
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

export default function DonateRequestsList() {
  const router = useRouter();
  const [donatedToys, setDonatedToys] = useState([]);
   const [sheetVisible, setSheetVisible] = useState(false);
  
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('donatedToys')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDonatedToys(items);
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
  pathname: '/screens/DonateToyResultScreen',
  params: {
    data: JSON.stringify({ ...item, docId: item.id }),
    from: 'view', // ✅ Now correct
  },
})
      }
      style={styles.card}
    >
      <Image
        source={{ uri: item.imageUrls?.[0] || '' }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <Text style={styles.cardTitle}>{item.title || 'Unnamed Toy'}</Text>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Donated Toys</Text>

      <FlatList
        data={donatedToys}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      />
      <View style={styles.footer}>
              <TouchableOpacity style={styles.footerItem} onPress={() => router.push('/dashboard')}>
                <Image source={require('../../assets/icons/home.png')} style={styles.footerIcon} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.footerItem} onPress={() => setSheetVisible(true)}>
                <Image source={require('../../assets/icons/upload.png')} style={styles.footerIconupload} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.footerItem}>
                <Image source={require('../../assets/icons/message.png')} style={styles.footerIcon} />
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginTop: 12,
    marginBottom: 20,
  },
  grid: {
    paddingBottom: 100,
  },
  card: {
    width: 161,
    height: 281,
    backgroundColor: '#fff',
    margin: '3%',
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
    padding: 10,
    fontSize: 14,
    fontFamily: 'ABeeZee-Regular',
    color: '#000',
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
