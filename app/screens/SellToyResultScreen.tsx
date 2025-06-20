// File: /app/screens/SellToyResultScreen.tsx

import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Linking } from 'react-native';
import UploadOptionsSheet from '../../components/UploadOptionsSheet';
import { getPriceComparison } from '../services/priceComparisonAPI'; // ✅ New import
//import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Extend dayjs
dayjs.extend(relativeTime);
dayjs.extend(duration);

export default function SellToyResultScreen() {
  const { data } = useLocalSearchParams();
    const [sheetVisible, setSheetVisible] = useState(false);
   const [comparisonData, setComparisonData] = useState<any[]>([]);
  const [loadingComparison, setLoadingComparison] = useState(true);
  const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
const isFromCategory = parsedData?.fromCategory === true;

  const getMemberSinceText = (createdAtString: string) => {
    const createdAt = dayjs(createdAtString);
    const now = dayjs();
    const diffInDays = now.diff(createdAt, 'day');
    const diffInMonths = now.diff(createdAt, 'month');
    if (diffInMonths < 1) {
      return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    } else {
      return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`;
    }
  };
useEffect(() => {
  const fetchComparison = async () => {
    try {
      const result = await getPriceComparison(parsedData?.title || '');
      setComparisonData(result);
    } catch (err) {
      console.error("Error fetching comparison data:", err);
    } finally {
      setLoadingComparison(false);
    }
  };
  fetchComparison();
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
  const handleEdit = () => {
    router.push({
      pathname: '/screens/SellToy',
      params: {
        editData: JSON.stringify({
          ...parsedData,
          docId: parsedData.docId,
          //from: 'edit'
        })
      }
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Top controls */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
       {!isFromCategory && (
  <TouchableOpacity style={styles.editBtn} onPress={handleEdit}>
    <Ionicons name="create-outline" size={20} color="#000" />
  </TouchableOpacity>
)}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {parsedData.image && <Image source={{ uri: parsedData.image }} style={styles.mainImage} />}

        <Text style={styles.title}>{parsedData.title}</Text>
        <Text style={styles.price}>Rs. {parsedData.price}</Text>

        <View style={styles.locationTag}>
          <Ionicons name="location-outline" size={16} color="#000" />
          <Text style={styles.locationText}>{parsedData.area}</Text>
        </View>

        <View style={styles.profileCard}>
          <Text style={styles.profileLabel}>Listed By Private User</Text>
          <View style={styles.profileRow}>
            <Image source={require('../../assets/icons/profile.png')} style={styles.profileIcon} />
            <View>
              <Text style={styles.userName}>{parsedData.userName}</Text>
              <Text style={styles.profileSubtitle}>Member since {getMemberSinceText(parsedData.userCreatedAt)}</Text>
              <Text style={styles.showProfile}>Show Profile</Text>
            </View>
          </View>
        </View>

        <View style={styles.conditionBox}>
          <Text style={styles.label}>Condition</Text>
          <Text style={styles.value}>{parsedData.condition}/10</Text>
        </View>

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{parsedData.description}</Text>
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Price Comparison</Text>

{loadingComparison ? (
  <ActivityIndicator size="large" color="#F4B731" />
) : comparisonData.length > 0 ? (
  <View style={styles.table}>
    <View style={[styles.row, styles.headerRow]}>
      <Text style={styles.cell}>Platform</Text>
      <Text style={styles.cell}>Price</Text>
      <Text style={styles.cell}>Link</Text>
    </View>
    {comparisonData.map((item, index) => (
      <View style={styles.row} key={index}>
        <Text style={styles.cell}>{item.platform}</Text>
        <Text style={styles.cell}>{item.price}</Text>
        <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
          <Text style={[styles.cell, styles.linkText]}>View</Text>
        </TouchableOpacity>
      </View>
    ))}
  </View>
) : (
  <Text style={{ textAlign: 'center', marginTop: 10, color: '#999' }}>
    No matching product found on Daraz.
  </Text>
)}
      </ScrollView>

      <TouchableOpacity style={styles.chatBtn}>
        <Text style={styles.chatText}>Chat</Text>
      </TouchableOpacity>

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
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 220,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    alignItems: 'center',
    paddingTop: 60
  },
  backBtn: {
    backgroundColor: '#F4B731',
    borderRadius: 20,
    padding: 6,
  },
  editBtn: {
    backgroundColor: '#F4B731',
    borderRadius: 20,
    padding: 6,
  },
  mainImage: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'BalooTammudu2-SemiBold',
  },
  price: {
    fontSize: 16,
    color: '#F4B731',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  locationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1C4',
    padding: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  locationText: {
    marginLeft: 4,
    fontSize: 12,
    fontFamily: 'ABeeZee-Regular',
  },
  profileCard: {
    backgroundColor: '#FAFAFA',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  profileLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 10,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  profileSubtitle: {
    fontSize: 12,
    color: '#999',
  },
  showProfile: {
    fontSize: 12,
    color: '#555',
    marginTop: 4,
  },
  conditionBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
  },
  value: {
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    color: '#333',
  },
  chatBtn: {
    backgroundColor: '#F4B731',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    position: 'absolute',
    bottom: 110,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  chatText: {
    fontWeight: 'bold',
    fontSize: 16,
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
    table: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  headerRow: {
    backgroundColor: '#FFF1C4',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
  },
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },

});