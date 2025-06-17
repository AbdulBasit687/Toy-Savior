import { Ionicons } from "@expo/vector-icons";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const CreateAccount = () => {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
 const [role, setRole] = useState('');
const [showRoleDropdown, setShowRoleDropdown] = useState(false);


  const handleRegister = async () => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        pass
      );
      await firestore().collection("users").doc(userCredential.user.uid).set({
        uid: userCredential.user.uid,
        firstName: first,
        lastName: last,
        email,
        role, // NEW
      });
      router.replace("/login");
    } catch (e: any) {
      Alert.alert("Error", e.message);
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Create Account</Text>

      <TextInput
        placeholder="Firstname"
        placeholderTextColor="#888"
        style={styles.input}
        onChangeText={setFirst}
      />
      <TextInput
        placeholder="Lastname"
        placeholderTextColor="#888"
        style={styles.input}
        onChangeText={setLast}
      />
      <TextInput
        placeholder="Email Address"
        placeholderTextColor="#888"
        keyboardType="email-address"
        style={styles.input}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        style={styles.input}
        onChangeText={setPass}
      />

      {/* Dropdown Picker */}
      <Text style={styles.label}>Sign Up As</Text>
<TouchableOpacity onPress={() => setShowRoleDropdown(!showRoleDropdown)} style={styles.dropdownBox}>
  <Text style={styles.dropdownText}>{role || 'Select Role'}</Text>
  <Ionicons name={showRoleDropdown ? 'chevron-up' : 'chevron-down'} size={18} color="#000" />
</TouchableOpacity>

{showRoleDropdown && (
  <View style={styles.dropdownList}>
    {['user', 'repairer'].map((r) => (
      <TouchableOpacity
        key={r}
        onPress={() => {
          setRole(r);
          setShowRoleDropdown(false);
        }}
        style={styles.dropdownItemBox}
      >
        <Text style={styles.dropdownText}>{r.charAt(0).toUpperCase() + r.slice(1)}</Text>
      </TouchableOpacity>
    ))}
  </View>
)}


      <TouchableOpacity style={styles.continueButton} onPress={handleRegister}>
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Forgot Password?{" "}
        <Text style={styles.reset} onPress={() => router.push("/ForgotPassword")}>
          Reset
        </Text>
      </Text>
    </View>
  );
};

export default CreateAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
    backgroundColor: "#fff",
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
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    fontFamily: "BalooTammudu2-SemiBold",
  },
  input: {
    backgroundColor: "#F5F5F5",
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16,
    fontFamily: "ABeeZee-Regular",
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
  continueButton: {
    backgroundColor: "#F4B731",
    padding: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },
  continueText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "ABeeZee-Regular",
  },
  footerText: {
    marginTop: 14,
    fontSize: 14,
    textAlign: "center",
    color: "#000",
    fontFamily: "ABeeZee-Regular",
  },
  reset: {
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
