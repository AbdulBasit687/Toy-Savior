import { Ionicons } from "@expo/vector-icons";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity
} from 'react-native';

export default function EditProfile() {
  const router = useRouter();
  const [fields, setFields] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
  });

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = auth().currentUser;
      if (currentUser) {
        const doc = await firestore().collection('users').doc(currentUser.uid).get();
        const data = doc.data();
        setFields({
          firstName: data?.firstName || '',
          lastName: data?.lastName || '',
          email: data?.email || '',
          phone: data?.phone || '',
          city: data?.city || '',
        });
      }
    };
    loadUser();
  }, []);

  const handleUpdate = async () => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      try {
        await firestore().collection('users').doc(currentUser.uid).update(fields);
        Alert.alert('Success', 'Profile updated successfully');
        router.back();
      } catch (error) {
        Alert.alert('Error', 'Could not update profile');
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
         {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.heading}>Edit Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={fields.firstName}
        onChangeText={(text) => setFields({ ...fields, firstName: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={fields.lastName}
        onChangeText={(text) => setFields({ ...fields, lastName: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={fields.email}
        onChangeText={(text) => setFields({ ...fields, email: text })}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={fields.phone}
        onChangeText={(text) => setFields({ ...fields, phone: text })}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="City"
        value={fields.city}
        onChangeText={(text) => setFields({ ...fields, city: text })}
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 120,
    padding: 24,
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    backgroundColor: "#F4B731",
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  heading: {
    paddingTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'BalooTammudu2-SemiBold',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#F5F5F5',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16,
    fontFamily: 'ABeeZee-Regular',
  },
  button: {
    backgroundColor: '#F4B731',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'ABeeZee-Regular',
  },
});
