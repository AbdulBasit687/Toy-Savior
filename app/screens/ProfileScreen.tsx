import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import UploadOptionsSheet from '../../components/UploadOptionsSheet';

export default function ProfileScreen() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    photoURL: '',
  });

  const [sheetVisible, setSheetVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [role, setRole] = useState('');

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
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

  const fetchUserData = async () => {
    try {
      const currentUser = auth().currentUser;
      if (currentUser) {
        const doc = await firestore().collection('users').doc(currentUser.uid).get();
        if (doc.exists) {
          const data = doc.data();
          setUserInfo({
            firstName: data?.firstName || '',
            lastName: data?.lastName || '',
            email: data?.email || '',
            photoURL: data?.photoURL || '',
          });
          setRole(data?.role || ''); // ✅ Add this line here
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load profile');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Denied', 'Permission to access gallery is required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const uri = asset.uri;
      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });

      try {
        const response = await fetch('https://freeimage.host/api/1/upload?key=YOUR_API_KEY', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `source=${base64}&type=base64`,
        });

        const json = await response.json();
        console.log('FreeImage response:', json);

        const downloadURL = json.image?.display_url;
        if (!downloadURL) throw new Error('Failed to get image URL');

        const currentUser = auth().currentUser;
        if (currentUser) {
          await firestore().collection('users').doc(currentUser.uid).update({
            photoURL: downloadURL,
          });
          setUserInfo((prev) => ({ ...prev, photoURL: downloadURL }));
          Alert.alert('Success', 'Profile photo updated!');
        }
      } catch (error) {
        Alert.alert('Upload Error', 'Failed to upload photo.');
        console.error(error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await auth().signOut();
      router.replace('/login');
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1, // Ensures the content grows to fill space
          justifyContent: 'flex-start', // Align content to the top
          paddingBottom: 90, // Adjusted to ensure enough space at the bottom
        }}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <Image
            source={
              userInfo.photoURL
                ? { uri: userInfo.photoURL }
                : require('../../assets/images/default-avatar.png')
            }
            style={styles.avatar}
          />
          <TouchableOpacity onPress={handlePickImage}>
            <Text style={styles.addPhotoText}>+ Add Profile Photo</Text>
          </TouchableOpacity>

          <View style={styles.card}>
            <Text style={styles.name}>
              {userInfo.firstName} {userInfo.lastName}
            </Text>
            <Text style={styles.email}>{userInfo.email}</Text>
          </View>

          <View style={styles.options}>
            <TouchableOpacity style={styles.option} onPress={() => router.push('../screens/EditProfile')}>
              <Text style={styles.optionText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={() => router.push('../screens/Conditions')}>
              <Text style={styles.optionText}>Conditions</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={() => router.push('../screens/Feedback')}>
              <Text style={styles.optionText}>Feedback</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={() => router.push('../screens/Help')}>
              <Text style={styles.optionText}>Help</Text>
            </TouchableOpacity>

            {/* Reduced space between My Requests and Logout */}
            <TouchableOpacity style={[styles.option, { marginBottom: 10 }]} onPress={() => router.push('../screens/MyRequestsScreen')}>
              <Text style={styles.optionText}>My Requests</Text>
            </TouchableOpacity>
          </View>

          {role === 'repairer' && (
            <TouchableOpacity style={styles.switchButton} onPress={() => router.push('/repairer-dashboard')}>
              <Text style={styles.switchButtonText}>Return to Repairer Mode</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Move logout button a little more upwards */}
      <TouchableOpacity
        style={[styles.logoutButton, { marginBottom: 10 }]} // Reduced marginBottom to move it up
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Log out</Text>
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,  // Adjusted to move content upward
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    flexGrow: 1,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 30,
    marginBottom: 10,
  },
  addPhotoText: {
    color: '#F4B731',
    fontSize: 14,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'BalooTammudu2-SemiBold',
  },
  email: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'ABeeZee-Regular',
  },
  options: {
    width: '100%',
    marginBottom: 30,
  },
  option: {
    backgroundColor: '#f9f9f9',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'ABeeZee-Regular',
  },
  logoutButton: {
    backgroundColor: '#F4B731',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginBottom: 10, // Adjusted margin for more space upwards
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  logoutText: {
    color: '#000',
    fontWeight: 'bold',
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
  switchButton: {
    backgroundColor: '#F4B731',
    padding: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  switchButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'ABeeZee-Regular',
  },
});
