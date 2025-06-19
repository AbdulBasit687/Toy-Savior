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
  const [allToys, setAllToys] = useState([]);
  const [searchText, setSearchText] = useState('');
const [searchResults, setSearchResults] = useState([]);
const handleSearch = (text: string) => {
  setSearchText(text);

  if (text.trim() === '') {
    setSearchResults([]);
    return;
  }

  const allData = [...featured, ...newlyUploaded, ...donatedToys, ...allToys];
  const filtered = allData.filter(toy =>
    toy?.title?.toLowerCase().includes(text.toLowerCase())
  );

  setSearchResults(filtered);
};
useEffect(() => {
  const unsubscribeBestCondition = firestore()
    .collection('products')
    .onSnapshot(snapshot => {
      if (!snapshot || !snapshot.docs) return;

      const data = snapshot.docs
        .map(doc => {
          const raw = doc.data();
          const condition = parseInt(raw.condition);
          return { id: doc.id, ...raw, condition };
        })
        .filter(item => item.condition > 6);

      setFeatured(data);
    });

  const unsubscribeNew = firestore()
    .collection('products')
    .where('category', '==', 'Newly Uploaded')
    .orderBy('createdAt', 'desc')
    .onSnapshot(snapshot => {
      if (!snapshot || !snapshot.docs) return;

      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNewlyUploaded(data);
    });

  const unsubscribeDonated = firestore()
    .collection('donatedToys')
    .orderBy('createdAt', 'desc')
    .onSnapshot(snapshot => {
      if (!snapshot || !snapshot.docs) return;

      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDonatedToys(data);
    });
    const unsubscribeAll = firestore()
  .collection('products')
  .orderBy('createdAt', 'desc')
  .onSnapshot(snapshot => {
    if (!snapshot || !snapshot.docs) return;

    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setAllToys(data);
  });

  return () => {
    unsubscribeBestCondition();
    unsubscribeNew();
    unsubscribeDonated();
      unsubscribeAll();
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
  <TouchableOpacity
    key={item.id}
    onPress={() =>
      router.push({
        pathname: '/screens/SellToyResultScreen',
        params: { data: JSON.stringify({ ...item, fromCategory: true }) }
      })
    }
    style={styles.card}
  >
    <Image source={{ uri: item.image }} style={styles.cardImage} />
    <Text style={styles.cardTitle}>{item.title || 'No Title'}</Text>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 8 }}>
      <Text style={styles.cardPrice}>Rs. {item.price || 'N/A'}</Text>
      <Ionicons name="location-outline" size={12} color="#555" style={{ marginLeft: 6, marginRight: 2 }} />
      <Text style={{ fontSize: 12, color: '#555' }}>{item.area || 'Unknown'}</Text>
    </View>
  </TouchableOpacity>
);
  const renderDonatedCard = (item) => (
  <TouchableOpacity
    key={item.id}
    onPress={() =>
      router.push({
        pathname: '/screens/DonateToyResultScreen',
        params: { data: JSON.stringify({ ...item, fromCategory: true }),
      }
      })
    }
    style={styles.card}
  >
    <Image
      source={{ uri: item.imageUrls?.[0] || '' }}
      style={styles.cardImage}
    />
    <Text style={styles.cardTitle}>{item.title || 'No Title'}</Text>
  </TouchableOpacity>
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
            <Text style={styles.dropdownText}>ToySavior</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchBar}>
  <Ionicons name="search-outline" size={18} color="#555" style={{ marginHorizontal: 8 }} />
  <TextInput
    placeholder="Search"
    placeholderTextColor="#888"
    style={styles.searchInput}
    value={searchText}
    onChangeText={handleSearch}
  />
</View>
{searchText.trim() !== '' && (
  <View style={{ marginTop: 10 }}>
    <Text style={styles.sectionTitle}>Search Results</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardRow}>
      {searchResults.length > 0 ? (
        searchResults.slice(0, 6).map(renderProductCard)
      ) : (
        <Text style={{ color: '#999', marginLeft: 12 }}>No matches found</Text>
      )}
    </ScrollView>
  </View>
)}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRow}>
          {[{ label: '0-5\nyears', icon: require('../assets/icons/0-5.png'), route: '/screens/CategoryAge0to5' },
            { label: '6-10\nyears', icon: require('../assets/icons/6-10.png'), route: '/screens/CategoryAge6to10' },
            { label: '11-15\nyears', icon: require('../assets/icons/11-15.png'), route: '/screens/CategoryAge11to15' },
            { label: 'Drones', icon: require('../assets/icons/drone.png'), route: '/screens/CategoryDrones' },
            { label: 'Consoles', icon: require('../assets/icons/console.png'), route: '/screens/CategoryConsole' },
            { label: 'Rides\nMachines', icon: require('../assets/icons/rides.png'), },
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
<Text style={styles.sectionTitle}>Best Condition Toys</Text>
          <TouchableOpacity onPress={() => router.push('/screens/BestConditionList')}>
    <Text style={styles.seeAll}>See All</Text>
  </TouchableOpacity>
        </View>

       <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardRow}>
  {featured.slice(0, 4).map(renderProductCard)}

  {featured.length > 4 && (
    <TouchableOpacity
      onPress={() => router.push('/screens/BestConditionList')}
      style={[styles.card, styles.seeMoreCard]}
    >
      <Ionicons name="arrow-forward-circle" size={50} color="#F4B731" />
      <Text style={{ textAlign: 'center', fontWeight: 'bold', marginTop: 6 }}>
        See All
      </Text>
    </TouchableOpacity>
  )}
</ScrollView>

       <View style={styles.section}>
  <Text style={styles.sectionTitle}>Newly Uploaded</Text>
  <TouchableOpacity onPress={() => router.push('/screens/NewlyUploadedList')}>
    <Text style={styles.seeAll}>See All</Text>
  </TouchableOpacity>
</View>

<ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardRow}>
  {newlyUploaded.slice(0, 4).map(renderProductCard)}

  {newlyUploaded.length > 4 && (
    <TouchableOpacity
      onPress={() => router.push('/screens/NewlyUploadedList')}
      style={[styles.card, styles.seeMoreCard]}
    >
      <Ionicons name="arrow-forward-circle" size={50} color="#F4B731" />
      <Text style={{ textAlign: 'center', fontWeight: 'bold', marginTop: 6 }}>
        See All
      </Text>
    </TouchableOpacity>
  )}
</ScrollView>
<View style={styles.section}>
  <Text style={styles.sectionTitle}>All Toys</Text>
  <TouchableOpacity onPress={() => router.push('/screens/AllToysList')}>
    <Text style={styles.seeAll}>See All</Text>
  </TouchableOpacity>
</View>

<ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardRow}>
  {allToys.slice(0, 4).map(renderProductCard)}

  {allToys.length > 4 && (
    <TouchableOpacity
      onPress={() => router.push('/screens/AllToysList')}
      style={[styles.card, styles.seeMoreCard]}
    >
      <Ionicons name="arrow-forward-circle" size={50} color="#F4B731" />
      <Text style={{ textAlign: 'center', fontWeight: 'bold', marginTop: 6 }}>
        See All
      </Text>
    </TouchableOpacity>
  )}
</ScrollView>

        <View style={styles.section}>
  <Text style={styles.sectionTitle}>Donated Toys</Text>
  <TouchableOpacity onPress={() => router.push('/screens/DonateRequestsList')}>
    <Text style={styles.seeAll}>See All</Text>
  </TouchableOpacity>
</View>

<ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardRow}>
  {donatedToys.slice(0, 4).map(renderDonatedCard)}

  {donatedToys.length > 4 && (
    <TouchableOpacity
      onPress={() => router.push('/screens/DonateRequestsList')}
      style={[styles.card, styles.seeMoreCard]}
    >
      <Ionicons name="arrow-forward-circle" size={50} color="#F4B731" />
      <Text style={{ textAlign: 'center', fontWeight: 'bold', marginTop: 6 }}>
        See All
      </Text>
    </TouchableOpacity>
  )}
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
    fontSize: 18,
    fontFamily: 'BalooTammudu2-SemiBold',
  },
  seeAll: {
    color: '#555',
    fontSize: 16,
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
  width: 56,
  height: 56,
  marginBottom: 6,
  borderRadius: 28, // makes it perfectly circular
  resizeMode: 'cover',
  borderWidth: 1,
  borderColor: '#ddd', // optional: add border for consistency
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
    backgroundColor: '#F5F5F5',
    marginRight: 22,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    //borderWidth: 1, // ✅ add this
   // borderColor: '#ccc', // ✅ subtle grey border
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
  seeMoreCard: {
  justifyContent: 'center',
  alignItems: 'center',
},
});