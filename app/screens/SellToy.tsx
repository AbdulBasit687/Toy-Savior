// File: /app/screens/SellToy.tsx

import { Ionicons } from '@expo/vector-icons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import UploadOptionsSheet from '../../components/UploadOptionsSheet';

export default function SellToy() {
  const { editData } = useLocalSearchParams();
  const parsedEdit = typeof editData === 'string' ? JSON.parse(editData) : null;

  const [toyName, setToyName] = useState(parsedEdit?.title || '');
  const [description, setDescription] = useState(parsedEdit?.description || '');
  const [toyType, setToyType] = useState(parsedEdit?.toyType || '');
  const [condition, setCondition] = useState(parsedEdit?.condition || '');
  const [price, setPrice] = useState(parsedEdit?.price || '');
  const [area, setArea] = useState(parsedEdit?.area || '');
  const [location, setLocation] = useState(parsedEdit?.location || '');
  const [imageUri, setImageUri] = useState(parsedEdit?.image || '');
  const [uploading, setUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [showCameraOptions, setShowCameraOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState('sell');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [userInfo, setUserInfo] = useState({ firstName: '', email: '', userCreatedAt: '' });

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = auth().currentUser;
      if (currentUser) {
        const userDoc = await firestore().collection('users').doc(currentUser.uid).get();
        const data = userDoc.data();
        const userCreatedAt = data?.createdAt?.toDate().toISOString() ?? new Date().toISOString();
        setUserInfo({
          firstName: data?.firstName || '',
          email: data?.email || '',
          userCreatedAt,
        });
      }
    };
    fetchUser();
  }, []);

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

  const uploadToCloudinary = async (uri: string) => {
    const data = new FormData();
    data.append('file', {
      uri,
      name: 'sell.jpg',
      type: 'image/jpeg',
    } as any);
    data.append('upload_preset', 'Useruploads');

    const res = await fetch('https://api.cloudinary.com/v1_1/dqke8pf3p/image/upload', {
      method: 'POST',
      body: data,
    });
    const json = await res.json();
    return json.secure_url;
  };

  const pickImage = async (fromCamera = false) => {
    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 1 })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 1 });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
    }
  };

  const handleSave = async () => {
    if (!toyName || !description || !toyType || !imageUri || !condition || !price || !area || !location) {
      Alert.alert('All fields are required');
      return;
    }

    try {
      setUploading(true);
      const imageUrl = imageUri.startsWith('http') ? imageUri : await uploadToCloudinary(imageUri);

      const data = {
        title: toyName,
        description,
        toyType,
        condition,
        price,
        area,
        location,
        userName: userInfo.firstName,
        userEmail: userInfo.email,
        image: imageUrl,
        category: 'Newly Uploaded',
        categoryType: toyType,  
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      if (parsedEdit) {
        await firestore().collection('products').doc(parsedEdit.docId).update(data);
        ToastAndroid.show('Updated successfully', ToastAndroid.SHORT);
        router.replace({ pathname: '/screens/SellToyResultScreen', params: { data: JSON.stringify({ ...data, docId: parsedEdit.docId, userCreatedAt: userInfo.userCreatedAt }) } });
      } else {
        const docRef = await firestore().collection('products').add(data);
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          router.push({ pathname: '/screens/SellToyResultScreen', params: { data: JSON.stringify({ ...data, docId: docRef.id, userCreatedAt: userInfo.userCreatedAt }) } });
        }, 1200);
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Something went wrong.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>Sell a Toy</Text>
          <TouchableOpacity onPress={() => setShowCameraOptions(true)} style={styles.cameraIcon}>
            <Ionicons name="camera" size={20} color="#000" />
          </TouchableOpacity>
        </View>

        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.preview} />
        ) : (
          <View style={styles.previewPlaceholder} />
        )}

        <TextInput
          placeholder="Selling Price (Rs)"
          style={styles.input}
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />

        <View style={styles.profileBox}>
          <Text style={styles.label}>Seller: {userInfo.firstName}</Text>
          <Text style={styles.label}>Email: {userInfo.email}</Text>
        </View>

        <View style={styles.rowInputs}>
          <TextInput
            placeholder="Title"
            style={[styles.input, { flex: 2, marginRight: 10 }]}
            value={toyName}
            onChangeText={setToyName}
          />
          <View style={[styles.input, styles.areaInput]}>
            <Ionicons name="location" size={16} color="#555" style={{ marginRight: 6 }} />
            <TextInput
              placeholder="Area"
              value={area}
              onChangeText={setArea}
              style={{ flex: 1 }}
            />
          </View>
        </View>

        <Text style={styles.label}>Category</Text>
        <TouchableOpacity onPress={() => setShowCategoryDropdown(!showCategoryDropdown)} style={styles.dropdownBox}>
          <Text style={styles.dropdownText}>{toyType || 'Select Category'}</Text>
          <Ionicons name={showCategoryDropdown ? 'chevron-up' : 'chevron-down'} size={18} color="#000" />
        </TouchableOpacity>
        {showCategoryDropdown && (
          <View style={styles.dropdownList}>
            {["0-5 years", "6-10 years", "11-15 years", "Drone", "Console"].map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => {
                  setToyType(type);
                  setShowCategoryDropdown(false);
                }}
                style={styles.dropdownItemBox}
              >
                <Text style={styles.dropdownText}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.label}>Condition Rating (1-10)</Text>
        <TextInput
          placeholder="e.g., 8"
          style={styles.input}
          keyboardType="numeric"
          value={condition}
          onChangeText={setCondition}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          placeholder="Add Description"
          style={[styles.input, { height: 100 }]}
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <Text style={styles.label}>Full Location</Text>
        <TextInput
          placeholder="Enter full address or landmark"
          style={styles.input}
          value={location}
          onChangeText={setLocation}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSave} disabled={uploading}>
          <Text style={styles.submitText}>{uploading ? 'Submitting...' : parsedEdit ? 'Save Changes' : 'Upload'}</Text>
        </TouchableOpacity>
      </ScrollView>

      <UploadOptionsSheet
        visible={sheetVisible}
        selected={selectedOption}
        onClose={() => setSheetVisible(false)}
        onSelect={handleOptionSelect}
      />

      <Modal visible={showCameraOptions} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.cameraModal}>
            <TouchableOpacity onPress={() => { setShowCameraOptions(false); pickImage(false); }} style={styles.cameraBtn}>
              <Text style={styles.cameraBtnText}>Upload from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setShowCameraOptions(false); pickImage(true); }} style={styles.cameraBtn}>
              <Text style={styles.cameraBtnText}>Take a Picture</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.checkmarkContainer}>
            <Ionicons name="checkmark-circle" size={80} color="#4BB543" />
            <Text style={styles.successText}>Submitted!</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingTop: 60,
    paddingBottom: 140,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: '#F4B731',
    borderRadius: 20,
    padding: 6,
  },
  cameraIcon: {
    backgroundColor: '#F4B731',
    borderRadius: 20,
    padding: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'BalooTammudu2-SemiBold',
  },
  preview: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    resizeMode: 'cover',
    marginBottom: 12,
  },
  previewPlaceholder: {
    width: '100%',
    height: 248,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#F5F5F5',
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 14,
    width: '100%',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 6,
    fontSize: 14,
    fontFamily: 'BalooTammudu2-SemiBold',
  },
  dropdownBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
  },
  dropdownList: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    marginBottom: 12,
  },
  dropdownItemBox: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  dropdownText: {
    fontSize: 14,
    fontFamily: 'ABeeZee-Regular',
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  checkmarkContainer: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
  },
  successText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4BB543',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  cameraModal: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    width: 300,
    alignItems: 'center',
  },
  cameraBtn: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginVertical: 10,
    width: '100%',
  },
  cameraBtnText: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'ABeeZee-Regular',
  },
  rowInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  areaInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 10,
    flex: 1,
  },
  profileBox: {
    padding: 12,
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    marginBottom: 14,
  },
});