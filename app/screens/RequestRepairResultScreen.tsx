import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function RequestRepairResultScreen() {
  const { data } = useLocalSearchParams();

  if (!data) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No data available</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
      </View>
    );
  }

  const parsedData = typeof data === 'string' ? JSON.parse(data) : data;

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 50 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace('/dashboard')} style={styles.backIcon}>
  <Ionicons name="chevron-back" size={24} color="#000" />
</TouchableOpacity>

          <Text style={styles.title}>Request Service</Text>
          <TouchableOpacity
  onPress={() =>
  router.push({
    pathname: '/screens/RequestRepair',
    params: {
      editData: JSON.stringify({
        ...parsedData,
        docId: parsedData.docId, // make sure docId is part of original object
      }),
    },
  })
}
>
  <Ionicons name="create-outline" size={20} color="#000" />
</TouchableOpacity>
        </View>

        {/* Images */}
        {parsedData.imageUrl && (
          <Image source={{ uri: parsedData.imageUrl }} style={styles.image} />
        )}

        {/* Toy Name */}
        <Text style={styles.toyName}>{parsedData.toyName}</Text>

        {/* Category */}
        <View style={styles.inlineBox}>
  <Text style={styles.inlineLabel}>Category</Text>
  <Text style={styles.inlineValue}>{parsedData.toyType}</Text>
</View>

        {/* Urgency */}
        <View style={[styles.inlineBox, { backgroundColor: '#F4B731' }]}>
  <Text style={[styles.inlineLabel, { color: '#000' }]}>Urgency Of Repair</Text>
  <Text style={[styles.inlineValue, { fontWeight: 'bold' }]}>{parsedData.urgency}</Text>
</View>

        {/* Description */}
        <View style={styles.infoBlock}>
          <Text style={styles.sectionLabel}>Description</Text>
          <Text style={styles.sectionText}>{parsedData.description}</Text>
        </View>

        {/* Placeholder Location */}
        <View style={styles.infoBlock}>
          <Text style={styles.sectionLabel}>Location</Text>
          <Text style={styles.sectionText}>
            Muhammad Ali Jinah Rd, Gazdarabad Preedy Quarters, Karachi, Karachi City, Sindh, Pakistan
          </Text>
        </View>

        {/* Upload Again */}
        
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerItem}>
          <Image source={require('../../assets/icons/home.png')} style={styles.footerIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem}>
          <Image source={require('../../assets/icons/upload.png')} style={styles.footerIconupload} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem}>
          <Image source={require('../../assets/icons/message.png')} style={styles.footerIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.push('/screens/ProfileScreen')}>
          <Image source={require('../../assets/icons/profile.png')} style={styles.footerIconprofile} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  scrollContainer: {
    padding: 20,
    paddingBottom: 140,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backIcon: {
    backgroundColor: '#F4B731',
    borderRadius: 20,
    padding: 6,
  },
  editButton: {
    backgroundColor: '#F4B731',
    borderRadius: 20,
    padding: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'BalooTammudu2-SemiBold',
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    resizeMode: 'cover',
    marginBottom: 12,
  },
  toyName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'BalooTammudu2-SemiBold',
  },
  infoBox: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: '#555',
    fontFamily: 'ABeeZee-Regular',
  },
  info: {
    fontSize: 14,
    fontFamily: 'ABeeZee-Regular',
  },
  infoBlock: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontWeight: 'bold',
    marginBottom: 6,
    fontSize: 18,
    fontFamily: 'BalooTammudu2-SemiBold',
  },
  sectionText: {
    fontSize: 13,
    fontFamily: 'ABeeZee-Regular',
    color: '#333',
    lineHeight: 18,
  },
  submitButton: {
    backgroundColor: '#F4B731',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  submitText: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: 16,
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
  inlineBox: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 16,
  paddingVertical: 14,
  borderRadius: 30,
  marginBottom: 12,
  backgroundColor: '#F5F5F5',
  width: 342,
  height: 56
},
inlineLabel: {
  fontSize: 16,
  fontFamily: 'ABeeZee-Regular',
},
inlineValue: {
  fontSize: 14,
  fontFamily: 'ABeeZee-Regular',
},
});
