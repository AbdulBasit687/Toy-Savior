// File: /app/dashboard.tsx (UPDATED VERSION)
import { Ionicons } from '@expo/vector-icons';
import firestore from '@react-native-firebase/firestore';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import UploadOptionsSheet from '../components/UploadOptionsSheet';

export default function HomeExplore() {
  const router = useRouter();
  const [featured, setFeatured] = useState([]);
  const [newlyUploaded, setNewlyUploaded] = useState([]);
  const [donatedToys, setDonatedToys] = useState([]);
  const [sheetVisible, setSheetVisible] = useState(false);

  useEffect(() => {
    const unsubscribeFeatured = firestore()
      .collection('products')
      .where('category', '==', 'Featured')
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFeatured(data);
      });

    const unsubscribeNew = firestore()
      .collection('products')
      .where('category', '==', 'Newly Uploaded')
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNewlyUploaded(data);
      });

    const unsubscribeDonated = firestore()
  .collection('donatedToys')
  .orderBy('createdAt', 'desc')
  .limit(2)
  .onSnapshot(snapshot => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setDonatedToys(data);
  });

    return () => {
      unsubscribeFeatured();
      unsubscribeNew();
      unsubscribeDonated();
    };
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

  const renderProductCard = (item) => (
    <View key={item.id} style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <Text style={styles.cardTitle}>{item.title || 'No Title'}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 8 }}>
        <Text style={styles.cardPrice}>Rs. {item.price || 'N/A'}</Text>
        <Ionicons name="location-outline" size={12} color="#555" style={{ marginLeft: 6, marginRight: 2 }} />
        <Text style={{ fontSize: 12, color: '#555' }}>{item.area || 'Unknown'}</Text>
      </View>
    </View>
  );
  const renderDonatedCard = (item) => (
  <View key={item.id} style={styles.card}>
    <Image
      source={{ uri: item.imageUrls?.[0] || '' }}
      style={styles.cardImage}
    />
    <Text style={styles.cardTitle}>{item.title || 'No Title'}</Text>
  </View>
);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.dropdown}>
            <Text style={styles.dropdownText}>Repair Request</Text>
            <Image source={require('../assets/icons/down.png')} style={styles.dropdownIcon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require('../assets/icons/heart.png')} style={styles.heartIcon} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#555" style={{ marginHorizontal: 8 }} />
          <TextInput placeholder="Search" placeholderTextColor="#888" style={styles.searchInput} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRow}>
          {[{ label: '0-5\nyears', icon: require('../assets/icons/0-5.png'), route: '/screens/CategoryAge0to5' },
            { label: '6-10\nyears', icon: require('../assets/icons/6-10.png'), route: '/screens/CategoryAge6to10' },
            { label: '11-15\nyears', icon: require('../assets/icons/11-15.png'), route: '/screens/CategoryAge11to15' },
            { label: 'Drones', icon: require('../assets/icons/drone.png'), route: '/screens/Drones' },
            { label: 'Consoles', icon: require('../assets/icons/console.png'), route: '/screens/Console' }
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.categoryItem}
              onPress={() => router.push(item.route)}
            >
              <Image source={item.icon} style={styles.categoryIcon} />
              <Text style={styles.categoryLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured</Text>
          <Text style={styles.seeAll}>See All</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardRow}>
          {featured.map(renderProductCard)}
        </ScrollView>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Newly Uploaded</Text>
          <Text style={styles.seeAll}>See All</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardRow}>
          {newlyUploaded.map(renderProductCard)}
        </ScrollView>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Donated Toys</Text>
         <TouchableOpacity onPress={() => router.push('/screens/DonateRequestsList')}>
  <Text style={styles.seeAll}>See All</Text>
</TouchableOpacity>

        </View>

<ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardRow}>
  {donatedToys.map(renderDonatedCard)}
</ScrollView>
</ScrollView>


      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerItem}>
          <Image source={require('../assets/icons/home.png')} style={styles.footerIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={() => setSheetVisible(true)}>
          <Image source={require('../assets/icons/upload.png')} style={styles.footerIconupload} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/MessageList')}>
          <Ionicons name="chatbubble-ellipses-outline" size={28} color="#333" 
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.push('/screens/ProfileScreen')}>
          <Image source={require('../assets/icons/profile.png')} style={styles.footerIconprofile} />
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
    paddingTop: 40,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 140,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4B731',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dropdownText: {
    marginRight: 6,
    fontWeight: 'bold',
  },
  dropdownIcon: {
    width: 10.58,
    height: 4.73,
    marginLeft: 4,
  },
  heartIcon: {
    width: 17,
    height: 16,
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#F4F4F4',
    padding: 2,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    alignItems: 'center',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: 'BalooTammudu2-SemiBold',
  },
  seeAll: {
    color: '#555',
    fontSize: 12,
  },
  categoryRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    marginBottom: 6,
  },
  categoryLabel: {
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'ABeeZee-Regular',
  },
  cardRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  card: {
    width: 162,
    height: 280,
    backgroundColor: '#fff',
    marginRight: 22,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 220,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardTitle: {
    fontSize: 12,
    marginHorizontal: 8,
    marginTop: 6,
    fontFamily: 'ABeeZee-Regular',
    color: '#000',
  },
  cardPrice: {
    fontSize: 12,
    fontWeight: 'bold',
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