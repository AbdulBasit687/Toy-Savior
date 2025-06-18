import { Ionicons } from '@expo/vector-icons';
import firestore from '@react-native-firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
    View,
} from 'react-native';

export default function DonateToyResultScreen() {
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

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(parsedData.title || '');
  const [category, setCategory] = useState(parsedData.category || '');
  const [description, setDescription] = useState(parsedData.description || '');
  const [location, setLocation] = useState(parsedData.location || '');
  const [imageUrls, setImageUrls] = useState(parsedData.imageUrls || []);
  const [saving, setSaving] = useState(false);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });
    if (!result.canceled) {
      const uris = result.assets.map((asset) => asset.uri);
      setImageUrls([...imageUrls, ...uris]);
    }
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      await firestore().collection('donatedToys').doc(parsedData.docId).update({
        title,
        category,
        description,
        location,
        imageUrls,
      });
      ToastAndroid.show('Changes saved successfully!', ToastAndroid.SHORT);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.topControls}>
        <TouchableOpacity onPress={() => router.replace('/dashboard')} style={styles.backIcon}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        {!isEditing ? (
          <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
            <Ionicons name="create-outline" size={20} color="#000" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)}>
            <Ionicons name="close" size={20} color="#000" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Donate Toy</Text>

        {imageUrls.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
            {imageUrls.map((uri: string, index: number) => (
              <Image key={index} source={{ uri }} style={styles.image} />
            ))}
          </ScrollView>
        )}

        {isEditing ? (
          <>
            <TouchableOpacity onPress={handlePickImage} style={styles.uploadBtn}>
              <Text style={styles.uploadText}>Add Images</Text>
            </TouchableOpacity>
            <TextInput
              value={title}
              onChangeText={setTitle}
              style={styles.input}
              placeholder="Title"
            />
            <TextInput
              value={category}
              onChangeText={setCategory}
              style={styles.input}
              placeholder="Category"
            />
            <Text style={styles.sectionLabel}>Description</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              multiline
              style={[styles.input, { height: 100 }]}
              placeholder="Add Description"
            />
            <Text style={styles.sectionLabel}>Location</Text>
            <TextInput
              value={location}
              onChangeText={setLocation}
              style={styles.input}
              placeholder="Add Area"
            />

            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveChanges} disabled={saving}>
              <Text style={styles.saveText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.toyName}>{title}</Text>
            <View style={styles.inlineBox}>
              <Text style={styles.inlineLabel}>Category</Text>
              <Text style={styles.inlineValue}>{category}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.sectionLabel}>Description</Text>
              <Text style={styles.sectionText}>{description}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.sectionLabel}>Location</Text>
              <Text style={styles.sectionText}>{location}</Text>
            </View>
          </>
        )}
      </ScrollView>

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
  topControls: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1000,
  },
  scrollContainer: {
    paddingTop: 120,
    paddingHorizontal: 20,
    paddingBottom: 140,
    backgroundColor: '#fff',
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
  cancelButton: {
    backgroundColor: '#ddd',
    borderRadius: 20,
    padding: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'BalooTammudu2-SemiBold',
    textAlign: 'center',
    marginBottom: 20,
  },
  toyName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'BalooTammudu2-SemiBold',
  },
  input: {
    backgroundColor: '#F5F5F5',
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 16,
    fontFamily: 'ABeeZee-Regular',
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
    marginBottom: 20,
    backgroundColor: '#F5F5F5',
  },
  inlineLabel: {
    fontSize: 16,
    fontFamily: 'ABeeZee-Regular',
  },
  inlineValue: {
    fontSize: 14,
    fontFamily: 'ABeeZee-Regular',
  },
  imageScroll: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  image: {
    width: 160,
    height: 140,
    borderRadius: 10,
    marginRight: 10,
    resizeMode: 'cover',
  },
  saveBtn: {
    backgroundColor: '#F4B731',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  saveText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  uploadBtn: {
    backgroundColor: '#F4B731',
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadText: {
    color: '#000',
    fontWeight: 'bold',
  },
});