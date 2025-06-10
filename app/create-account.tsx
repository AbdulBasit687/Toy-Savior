// File: /app/create-account.tsx

import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { router } from "expo-router";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    router.push("/dashboard");
  }, []);

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
      <Text style={styles.heading}>Create Account</Text>
      <TextInput
        placeholder="Firstname"
        placeholderTextColor={"gray"}
        style={styles.input}
        onChangeText={setFirst}
      />
      <TextInput
        placeholder="Lastname"
        placeholderTextColor={"gray"}
        style={styles.input}
        onChangeText={setLast}
      />
      <TextInput
        placeholder="Email Address"
        placeholderTextColor={"gray"}
        style={styles.input}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor={"gray"}
        secureTextEntry
        style={styles.input}
        onChangeText={setPass}
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  heading: { fontSize: 24, marginBottom: 20, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    padding: 12,
    borderRadius: 10,
    color: "black",
  },
  button: {
    backgroundColor: "#F4B831",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});

export default CreateAccount;
