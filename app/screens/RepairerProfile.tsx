import { Ionicons } from "@expo/vector-icons";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from "react";
import {
    Alert,
    Image,
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
  const [editMode, setEditMode] = useState({ skills: false, experience: false, hours: false });
  const [showSave, setShowSave] = useState(false);

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
    }
  };

  fetchUser();
}, []); // ✅ Proper closing of useEffect

  const handleSave = async () => {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) return;

      await firestore().collection("users").doc(currentUser.uid).update({
        skills,
        experience,
        businessHours: hours,
      });

      setEditMode({ skills: false, experience: false, hours: false });
      setShowSave(false);
      Alert.alert("Saved", "Profile updated successfully.");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  const onEdit = (field: "skills" | "experience" | "hours") => {
    setEditMode((prev) => ({ ...prev, [field]: true }));
    setShowSave(true);
  };
  const handlePickImage = async () => {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    Alert.alert('Permission Denied', 'Permission to access gallery is required.');
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 1,
  });

  if (!result.canceled) {
    const uri = result.assets[0].uri;
    const currentUser = auth().currentUser;
    if (!currentUser) return;

    await firestore().collection("users").doc(currentUser.uid).update({
      photoURL: uri,
    });

    setUserInfo((prev: any) => ({
      ...prev,
      photoURL: uri,
    }));
  }
};


  return (
     <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 50 }}>
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Profile</Text>

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
        <Text style={styles.name}>{userInfo.firstName} {userInfo.lastName}</Text>
        <Text style={styles.email}>{userInfo.email}</Text>

      {/* Edit Profile Placeholder */}
      <TouchableOpacity style={styles.option} onPress={() => router.push('../screens/EditProfile')}>
            <Text style={styles.optionText}>Edit Profile</Text>
        </TouchableOpacity>

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

      {/* Save Changes Button */}
      {showSave && (
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
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
</View>
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
  editRow: {
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  editLabel: {
    fontFamily: "ABeeZee-Regular",
    fontSize: 14,
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
});

