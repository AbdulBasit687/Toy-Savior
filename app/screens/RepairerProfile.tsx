import { Ionicons } from "@expo/vector-icons";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function RepairerProfile() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any>({});
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [hours, setHours] = useState("");
  const [cnic, setCnic] = useState("");
  const [editMode, setEditMode] = useState({ skills: false, experience: false, hours: false, cnic: false });
  const [showSave, setShowSave] = useState(false);
  const [showCameraOptions, setShowCameraOptions] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = auth().currentUser;
      if (!currentUser) return;

      const doc = await firestore().collection("users").doc(currentUser.uid).get();
      if (doc.exists) {
        const data = doc.data();
        setUserInfo(data);
        setSkills(data?.skills || "");
        setExperience(data?.experience || "");
        setHours(data?.businessHours || "");
        setCnic(data?.cnic || "");
      }
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    const currentUser = auth().currentUser;
    if (!currentUser) return;

    if (cnic.length !== 13) {
      Alert.alert("Invalid CNIC", "CNIC must be exactly 13 digits.");
      return;
    }

    try {
      await firestore().collection("users").doc(currentUser.uid).update({
        skills,
        experience,
        businessHours: hours,
        cnic,
      });

      setEditMode({ skills: false, experience: false, hours: false, cnic: false });
      setShowSave(false);
      Alert.alert("Saved", "Profile updated successfully.");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  const onEdit = (field: "skills" | "experience" | "hours" | "cnic") => {
    setEditMode((prev) => ({ ...prev, [field]: true }));
    setShowSave(true);
  };

  const uploadToCloudinary = async (uri: string) => {
    const data = new FormData();
    data.append("file", {
      uri,
      name: "profile.jpg",
      type: "image/jpeg",
    } as any);
    data.append("upload_preset", "Useruploads");

    const res = await fetch("https://api.cloudinary.com/v1_1/dqke8pf3p/image/upload", {
      method: "POST",
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
      try {
        setUploading(true);
        const uri = result.assets[0].uri;
        const imageUrl = await uploadToCloudinary(uri);
        const currentUser = auth().currentUser;
        if (!currentUser) return;

        await firestore().collection("users").doc(currentUser.uid).update({
          photoURL: imageUrl,
        });

        setUserInfo((prev: any) => ({
          ...prev,
          photoURL: imageUrl,
        }));
      } catch (err) {
        Alert.alert("Error", "Failed to upload image");
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 160 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Profile</Text>

          <Image
            source={userInfo.photoURL ? { uri: userInfo.photoURL } : require('../../assets/images/default-avatar.png')}
            style={styles.avatar}
          />

          <TouchableOpacity onPress={() => setShowCameraOptions(true)}>
            <Text style={styles.addPhotoText}>+ Add Profile Photo</Text>
          </TouchableOpacity>

          <Text style={styles.name}>{userInfo.firstName} {userInfo.lastName}</Text>
          <Text style={styles.email}>{userInfo.email}</Text>

          <TouchableOpacity style={styles.option} onPress={() => router.push('../screens/EditProfile')}>
            <Text style={styles.optionText}>Edit Profile</Text>
          </TouchableOpacity>

          {/* CNIC */}
          <View style={styles.sectionBox}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>CNIC Number</Text>
              <TouchableOpacity onPress={() => onEdit("cnic")}>
                <Ionicons name="create-outline" size={18} color="#000" />
              </TouchableOpacity>
            </View>
            {editMode.cnic ? (
              <TextInput
                style={styles.input}
                value={cnic}
                onChangeText={(text) => {
                  const digits = text.replace(/[^0-9]/g, '');
                  setCnic(digits);
                }}
                keyboardType="numeric"
                maxLength={13}
                placeholder="Enter 13-digit CNIC"
              />
            ) : (
              <Text style={styles.sectionText}>{cnic || "Not provided"}</Text>
            )}
          </View>

          {/* Skills */}
          <View style={styles.sectionBox}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Skills</Text>
              <TouchableOpacity onPress={() => onEdit("skills")}>
                <Ionicons name="create-outline" size={18} color="#000" />
              </TouchableOpacity>
            </View>
            {editMode.skills ? (
              <TextInput
                style={styles.input}
                multiline
                value={skills}
                onChangeText={setSkills}
                placeholder="Add skills..."
              />
            ) : (
              <Text style={styles.sectionText}>{skills || "No skills listed."}</Text>
            )}
          </View>

          {/* Experience */}
          <View style={styles.sectionBox}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Experience</Text>
              <TouchableOpacity onPress={() => onEdit("experience")}>
                <Ionicons name="create-outline" size={18} color="#000" />
              </TouchableOpacity>
            </View>
            {editMode.experience ? (
              <TextInput
                style={styles.input}
                value={experience}
                onChangeText={setExperience}
                placeholder="e.g., 1-2 Years"
              />
            ) : (
              <Text style={styles.sectionText}>{experience || "No experience listed."}</Text>
            )}
          </View>

          {/* Business Hours */}
          <View style={styles.sectionBox}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Business Hours</Text>
              <TouchableOpacity onPress={() => onEdit("hours")}>
                <Ionicons name="create-outline" size={18} color="#000" />
              </TouchableOpacity>
            </View>
            {editMode.hours ? (
              <TextInput
                style={styles.input}
                value={hours}
                onChangeText={setHours}
                placeholder="e.g., 11 AM - 6 PM"
              />
            ) : (
              <Text style={styles.sectionText}>{hours || "No business hours listed."}</Text>
            )}
          </View>

          {/* Switch to User Mode */}
          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => router.push({ pathname: '/dashboard', params: { mode: 'repairer' } })}
          >
            <Text style={styles.switchButtonText}>Switch to User Mode</Text>
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={async () => {
              try {
                await auth().signOut(); // Sign out the user
                router.push("/login"); // Navigate to login screen
              } catch (error) {
                Alert.alert("Error", "Failed to log out.");
              }
            }}
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>

          {/* Save Changes Button */}
          {showSave && (
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>Save Changes</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.push('/repairer-dashboard')}>
          <Image source={require('../../assets/icons/home.png')} style={styles.footerIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem}>
          <Image source={require('../../assets/icons/message.png')} style={styles.footerIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.push('../screens/RepairerProfile')}>
          <Image source={require('../../assets/icons/profile.png')} style={styles.footerIconprofile} />
        </TouchableOpacity>
      </View>

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 40,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "BalooTammudu2-SemiBold",
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignSelf: "center",
    marginBottom: 12,
  },
  addPhotoText: {
    color: "#F4B731",
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "ABeeZee-Regular",
    marginBottom: 10,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "ABeeZee-Regular",
  },
  email: {
    color: "#888",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "ABeeZee-Regular",
  },
  sectionBox: {
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 10,
    marginBottom: 14,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 14,
    fontFamily: "BalooTammudu2-SemiBold",
  },
  sectionText: {
    fontFamily: "ABeeZee-Regular",
    fontSize: 14,
    color: "#444",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    fontFamily: "ABeeZee-Regular",
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: "#F4B731",
    padding: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },
  saveText: {
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "ABeeZee-Regular",
  },
  switchButton: {
    backgroundColor: "#F4B731",
    padding: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },
  switchButtonText: {
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "ABeeZee-Regular",
  },
  logoutButton: {
    backgroundColor: "#F4B731", // Yellow background color
    padding: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20, // Space between this button and the previous one
  },
  logoutButtonText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#fff", // White text color
    fontFamily: "ABeeZee-Regular",
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
