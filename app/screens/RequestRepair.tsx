import { Ionicons } from '@expo/vector-icons';
import firestore from '@react-native-firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
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

export default function RequestRepair() {
  const [toyName, setToyName] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState('');
  const [toyType, setToyType] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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

      await firestore().collection('repairRequests').add(requestData);

      // Show success modal
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
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Request Repair</Text>

        <TextInput
          placeholder="Toy Name / Title"
          style={styles.input}
          value={toyName}
          onChangeText={setToyName}
        />
        <TextInput
          placeholder="Description / Issue"
          style={[styles.input, { height: 100 }]}
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <Text style={styles.label}>Urgency of Repair:</Text>
        <View style={styles.dropdownRow}>
          {['Low', 'Medium', 'High'].map((level) => (
            <TouchableOpacity
              key={level}
              onPress={() => setUrgency(level)}
              style={[styles.dropdownItem, urgency === level && styles.dropdownSelected]}>
              <Text>{level}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Toy Type:</Text>
        <View style={styles.dropdownRow}>
          {['Toy', 'Drone', 'Console'].map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setToyType(type)}
              style={[styles.dropdownItem, toyType === type && styles.dropdownSelected]}>
              <Text>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Add Picture:</Text>
        <View style={styles.imageButtons}>
          <TouchableOpacity style={styles.imageBtn} onPress={() => pickImage(false)}>
            <Text style={styles.imageBtnText}>Upload from Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.imageBtn} onPress={() => pickImage(true)}>
            <Text style={styles.imageBtnText}>Take a Picture</Text>
          </TouchableOpacity>
        </View>

        {imageUri ? <Image source={{ uri: imageUri }} style={styles.preview} /> : null}

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={uploading}>
          <Text style={styles.submitText}>{uploading ? 'Submitting...' : 'Submit Request'}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ✅ Success Checkmark Modal */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.checkmarkContainer}>
            <Ionicons name="checkmark-circle" size={80} color="#4BB543" />
            <Text style={styles.successText}>Submitted!</Text>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', fontFamily: 'BalooTammudu2-SemiBold', marginBottom: 20 },
  backButton: {
    backgroundColor: '#F4B731',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#F5F5F5',
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 14,
  },
  label: { fontWeight: 'bold', marginBottom: 6, fontSize: 15 },
  dropdownRow: { flexDirection: 'row', marginBottom: 12 },
  dropdownItem: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  dropdownSelected: {
    backgroundColor: '#F4B731',
  },
  imageButtons: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  imageBtn: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 10,
    flex: 0.48,
  },
  imageBtnText: { textAlign: 'center' },
  preview: { width: '100%', height: 200, borderRadius: 10, marginTop: 10, marginBottom: 20 },
  submitButton: {
    backgroundColor: '#F4B731',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  submitText: { fontWeight: 'bold', color: '#000', fontSize: 16 },
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
});
