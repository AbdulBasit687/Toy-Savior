// File: /app/create-account.tsx

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
  View,
} from "react-native";

const CreateAccount = () => {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

 /* useEffect(() => {
    router.push("/dashboard");
  }, []);*/

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
      });
      router.replace("/login");
    } catch (e: any) {
      Alert.alert("Error", e.message);
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color="black" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Create Account</Text>

      {/* Form Fields */}
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

      {/* Continue Button */}
      <TouchableOpacity style={styles.continueButton} onPress={handleRegister}>
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>

      {/* Forgot Password */}
      <Text style={styles.footerText}>
        Forgot Password?{" "}
        <Text
          style={styles.reset}
          onPress={() => router.push("/ForgotPassword")}
        >
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
