import { Ionicons } from '@expo/vector-icons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function DonateToy() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [imageUris, setImageUris] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showCameraOptions, setShowCameraOptions] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const uploadToCloudinary = async (uri: string) => {
  const data = new FormData();
  data.append('file', {
    uri,
    name: 'donate.jpg',
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
    : await ImagePicker.launchImageLibraryAsync({ 
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1
      });

  if (!result.canceled) {
    const uris = result.assets.map(asset => asset.uri);
    setImageUris(prev => [...prev, ...uris]);
  }
};
  const handleSubmit = async () => {
  if (!title || !category || !description || !location || imageUris.length === 0) {
    Alert.alert('All fields are required');
    return;
  }

  try {
    setUploading(true);
    const currentUser = auth().currentUser;

    // Upload all images in parallel
    const uploadPromises = imageUris.map(uri => uploadToCloudinary(uri));
    const imageUrls = await Promise.all(uploadPromises);

    const donateData = {
      title,
      category,
      description,
      location,
      imageUrls,
      userId: currentUser?.uid,
      createdAt: firestore.FieldValue.serverTimestamp(),
    };

    const newDoc = await firestore().collection('donatedToys').add(donateData);

// Include docId and title so the result screen can use them
const resultData = {
  ...donateData,
  docId: newDoc.id,
};

setShowSuccess(true);
setTimeout(() => {
  setShowSuccess(false);
  router.push({
    pathname: '/screens/DonateToyResultScreen',
    params: { data: JSON.stringify(resultData) },
  });
}, 1000);
  } catch (error) {
    console.error(error);
    Alert.alert('Error', 'Failed to upload toy');
  } finally {
    setUploading(false);
  }
};

  return (
  <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={10}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
          <Ionicons name="chevron-back" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Donate Toy</Text>
        <TouchableOpacity onPress={() => setShowCameraOptions(true)} style={styles.navBtn}>
          <Ionicons name="camera" size={18} color="#000" />
        </TouchableOpacity>
      </View>

      {imageUris.length > 0 ? (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
    {imageUris.map((uri, index) => (
      <Image key={index} source={{ uri }} style={styles.imagePreview} />
    ))}
  </ScrollView>
) : (
  <View style={styles.imagePlaceholder} />
)}

      <TextInput
        placeholder="Title"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      <TouchableOpacity
        onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
        style={styles.dropdown}
      >
        <Text style={styles.dropdownText}>{category || 'Category'}</Text>
        <Ionicons name={showCategoryDropdown ? 'chevron-up' : 'chevron-down'} size={16} color="#000" />
      </TouchableOpacity>
      {showCategoryDropdown && (
        <View style={styles.dropdownList}>
          {['Toy', 'Drone', 'Console'].map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => {
                setCategory(item);
                setShowCategoryDropdown(false);
              }}
              style={styles.dropdownItem}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Text style={styles.label}>Description</Text>
      <TextInput
        placeholder="Add Description"
        multiline
        numberOfLines={4}
        style={[styles.input, { height: 100 }]}
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Location</Text>
      <TextInput
        placeholder="Add Area"
        style={styles.input}
        value={location}
        onChangeText={setLocation}
      />

      <TouchableOpacity style={styles.uploadBtn} onPress={handleSubmit} disabled={uploading}>
        <Text style={styles.uploadText}>{uploading ? 'Uploading...' : 'Upload'}</Text>
      </TouchableOpacity>
    </ScrollView>

    {/* Camera Modal */}
    <Modal visible={showCameraOptions} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={() => { setShowCameraOptions(false); pickImage(false); }} style={styles.modalBtn}>
            <Text>Upload from Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setShowCameraOptions(false); pickImage(true); }} style={styles.modalBtn}>
            <Text>Take a Picture</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>

    {/* Success Modal */}
    <Modal visible={showSuccess} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Ionicons name="checkmark-circle" size={60} color="green" />
          <Text style={{ marginTop: 10 }}>Donation Submitted!</Text>
        </View>
      </View>
    </Modal>
  </KeyboardAvoidingView>
);

}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 70,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navBtn: {
    backgroundColor: '#F4B731',
    borderRadius: 20,
    padding: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#F5F5F5',
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 14,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
  dropdown: {
    backgroundColor: '#F5F5F5',
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownList: {
    backgroundColor: '#eee',
    borderRadius: 10,
    marginBottom: 10,
  },
  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  imagePreview: {
  width: 140,
  height: 140,
  borderRadius: 10,
  marginRight: 10,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    marginBottom: 16,
  },
  uploadBtn: {
    backgroundColor: '#F4B731',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  uploadText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
  },
  modalBtn: {
    padding: 10,
    width: 200,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    marginVertical: 10,
  },
});
