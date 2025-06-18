// File: /app/login.tsx

import auth from "@react-native-firebase/auth";
import firestore from '@react-native-firebase/firestore';
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
import RoleSelector from "../components/RoleSelector";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("repairer");

  const handleLogin = async () => {
    try {
const userCredential = await auth().signInWithEmailAndPassword(email, password);
const userDoc = await firestore().collection("users").doc(userCredential.user.uid).get();
const userData = userDoc.data();


       if (!userData || !userData.role) {
        Alert.alert("Login Failed", "User role not found.");
        return;
      }

      if (userData.role !== selectedRole) {
        Alert.alert(
          "Role Mismatch",
          `This account is registered as a "${userData.role}". Please select the correct role to login.`
        );
        return;
      }

      if (selectedRole === "repairer") {
        router.replace("/repairer-dashboard");
      } else {
        router.replace("/dashboard");
      }
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Sign in</Text>

      <Text style={styles.subheading}>Sign in as:</Text>
<RoleSelector selectedRole={selectedRole} setSelectedRole={setSelectedRole} />

      <TextInput
        placeholder="Email Address"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.continueButton} onPress={handleLogin}>
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>

      <Text style={styles.bottomText}>
        Don’t have an Account?{" "}
        <Text
          style={styles.linkText}
          onPress={() => router.push("/create-account")}
        >
          Create One
        </Text>
      </Text>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "white",
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "BalooTammudu2-SemiBold",
  },
  subheading: {
    fontSize: 16,
    marginBottom: 10,
    fontFamily: "ABeeZee-Regular",
  },
  input: {
    backgroundColor: "#F4F4F4",
    padding: 14,
    borderRadius: 8,
    marginVertical: 8,
    fontFamily: "ABeeZee-Regular",
  },
  continueButton: {
    backgroundColor: "#F4B731",
    padding: 16,
    borderRadius: 25,
    alignItems: "center",
    marginVertical: 16,
  },
  continueText: {
    fontWeight: "bold",
    color: "black",
    fontSize: 16,
    fontFamily: "ABeeZee-Regular",
  },
  bottomText: {
    textAlign: "center",
    marginBottom: 16,
    fontSize: 12,
    fontFamily: "ABeeZee-Regular",
  },
  linkText: {
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});

export default Login;
