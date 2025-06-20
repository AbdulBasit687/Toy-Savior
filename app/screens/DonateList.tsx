import { Ionicons } from '@expo/vector-icons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import UploadOptionsSheet from '../../components/UploadOptionsSheet';


export default function DonateList() {
  const [donations, setDonations] = useState([]);
  const router = useRouter();
    const [sheetVisible, setSheetVisible] = useState(false);

  useEffect(() => {
    const currentUser = auth().currentUser;
    if (!currentUser) return;

    const unsubscribe = firestore()
      .collection('donatedToys')
      .where('userId', '==', currentUser.uid)
      .onSnapshot(snapshot => {
        if (!snapshot || !snapshot.docs) return;

        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setDonations(data);
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
const handleDelete = (id: string) => {
  Alert.alert(
    "Confirm Delete",
    "Are you sure you want to delete this donation request?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await firestore().collection('donatedToys').doc(id).delete();
          } catch (error) {
            console.error("Error deleting donation:", error);
          }
        }
      }
    ]
  );
};
  const renderItem = ({ item }) => (
  <View style={styles.card}>
    <TouchableOpacity
      style={{ flex: 1 }}
      onPress={() =>
        router.push({
          pathname: '/screens/DonateToyResultScreen',
          params: { data: JSON.stringify(item) },
        })
      }
    >
      <View style={{ flexDirection: 'row' }}>
        <Image source={{ uri: item.imageUrls?.[0] || '' }} style={styles.image} />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.category}</Text>
          <Text numberOfLines={2} style={styles.desc}>{item.description}</Text>
        </View>
      </View>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={() => handleDelete(item.id)}
      style={styles.deleteButton}
    >
      <Ionicons name="trash" size={20} color="#fff" />
    </TouchableOpacity>
  </View>
);


  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
     <View style={styles.header}>
  <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
    <Ionicons name="chevron-back" size={20} color="#000" />
  </TouchableOpacity>
  <Text style={styles.headerTitle}>Donate Requests</Text>
  <View style={{ width: 24 }} />
</View>

      <FlatList
        data={donations}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text>No donation requests found.</Text>}
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
  deleteButton: {
  position: 'absolute',
  top: 8,
  right: 8,
  backgroundColor: '#ff4d4d',
  padding: 6,
  borderRadius: 20,
  zIndex: 999,
},

});
