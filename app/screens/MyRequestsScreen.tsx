import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MyRequestsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Requests</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/screens/RepairRequestsList')}>
        <Text style={styles.buttonText}>Repair Requests</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/screens/SellRequestsList')}>
        <Text style={styles.buttonText}>Sell Requests</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/screens/DonateRequestsList')}>
        <Text style={styles.buttonText}>Donate Requests</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    fontFamily: 'BalooTammudu2-SemiBold',
  },
  button: {
    backgroundColor: '#F4B731',
    padding: 16,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'ABeeZee-Regular',
  },
});