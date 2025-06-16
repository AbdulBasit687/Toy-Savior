import { Ionicons } from '@expo/vector-icons';
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
  TouchableOpacity,
  View
} from 'react-native';
import UploadOptionsSheet from '../../components/UploadOptionsSheet';

export default function RequestRepair() {
  const [toyName, setToyName] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState('');
  const [toyType, setToyType] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [showCameraOptions, setShowCameraOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState('repair');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showUrgencyDropdown, setShowUrgencyDropdown] = useState(false);
  const [docId, setDocId] = useState('');

  const { editData } = useLocalSearchParams();

  useEffect(() => {
  if (editData) {
    const parsed = typeof editData === 'string' ? JSON.parse(editData) : editData;
    setToyName(parsed.toyName || '');
    setDescription(parsed.description || '');
    setUrgency(parsed.urgency || '');
    setToyType(parsed.toyType || '');
    setImageUri(parsed.imageUrl || '');
    setDocId(parsed.docId || '');
  }
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
      name: 'repair.jpg',
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

  const handleSubmit = async () => {
    if (!toyName || !description || !urgency || !toyType || !imageUri) {
      Alert.alert('All fields are required');
      return;
    }

    try {
      setUploading(true);
      const imageUrl = await uploadToCloudinary(imageUri);

      const requestData = {
        toyName,
        description,
        urgency,
        toyType,
        imageUrl,
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      if (docId) {
      // If editing, update existing document
      await firestore().collection('repairRequests').doc(docId).update(requestData);
    } else {
      // If new, create document
      const newDoc = await firestore().collection('repairRequests').add(requestData);
      requestData.docId = newDoc.id; // Store the new docId
    }

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.push({
          pathname: '/screens/RequestRepairResultScreen',
          params: { data: JSON.stringify(requestData) },
        });
      }, 1200);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong while uploading.');
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
          <Text style={styles.title}>Request Service</Text>
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
          placeholder="Title"
          style={styles.input}
          value={toyName}
          onChangeText={setToyName}
        />

        <Text style={styles.label}>Category</Text>
        <TouchableOpacity onPress={() => setShowCategoryDropdown(!showCategoryDropdown)} style={styles.dropdownBox}>
          <Text style={styles.dropdownText}>{toyType || 'Select Category'}</Text>
          <Ionicons name={showCategoryDropdown ? 'chevron-up' : 'chevron-down'} size={18} color="#000" />
        </TouchableOpacity>
        {showCategoryDropdown && (
          <View style={styles.dropdownList}>
            {['Toy', 'Drone', 'Console'].map((type) => (
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

        <Text style={styles.label}>Urgency Of Repair</Text>
        <TouchableOpacity onPress={() => setShowUrgencyDropdown(!showUrgencyDropdown)} style={styles.dropdownBox}>
          <Text style={styles.dropdownText}>{urgency || 'Select Urgency'}</Text>
          <Ionicons name={showUrgencyDropdown ? 'chevron-up' : 'chevron-down'} size={18} color="#000" />
        </TouchableOpacity>
        {showUrgencyDropdown && (
          <View style={styles.dropdownList}>
            {['Low', 'Medium', 'High'].map((level) => (
              <TouchableOpacity
                key={level}
                onPress={() => {
                  setUrgency(level);
                  setShowUrgencyDropdown(false);
                }}
                style={styles.dropdownItemBox}
              >
                <Text style={styles.dropdownText}>{level}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.label}>Description</Text>
        <TextInput
          placeholder="Add Description"
          style={[styles.input, { height: 100 }]}
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={uploading}
        >
          <Text style={styles.submitText}>{uploading ? 'Submitting...' : 'Upload'}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Footer */}
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

      {/* Modals */}
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

      <UploadOptionsSheet
        visible={sheetVisible}
        selected={selectedOption}
        onClose={() => setSheetVisible(false)}
        onSelect={handleOptionSelect}
      />
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingBottom: 40,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    height: 100,
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
});
