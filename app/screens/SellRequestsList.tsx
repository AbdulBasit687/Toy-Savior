import { Ionicons } from '@expo/vector-icons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import UploadOptionsSheet from '../../components/UploadOptionsSheet';

export default function SellRequestsList() {
  const [requests, setRequests] = useState([]);
    const [sheetVisible, setSheetVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const currentUser = auth().currentUser;
    if (!currentUser) return;

    const unsubscribe = firestore()
      .collection('products')
      .where('userEmail', '==', currentUser.email)
      .onSnapshot(snapshot => {
        if (!snapshot || !snapshot.docs) return;

        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setRequests(data);
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
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: '/screens/SellToyResultScreen',
          params: { data: JSON.stringify(item) }
        })
      }
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.toyType} | Rs. {item.price}</Text>
        <Text numberOfLines={2} style={styles.desc}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sell Requests</Text>
        <View style={{ width: 24 }} /> {/* spacing placeholder */}
      </View>

      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text>No sell requests found.</Text>}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    backgroundColor: '#F4B731',
    padding: 6,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'BalooTammudu2-SemiBold',
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 6,
    marginRight: 12,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'BalooTammudu2-SemiBold',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginVertical: 2,
    fontFamily: 'ABeeZee-Regular',
  },
  desc: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'ABeeZee-Regular',
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
