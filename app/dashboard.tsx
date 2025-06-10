// File path: /app/dashboard.tsx
import { router } from 'expo-router';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';

const dummyProducts = [
  {
    id: '1',
    title: 'Drone BA-965K',
    price: 'Rs. 45,000',
    image: require('../assets/images/drone.png'), // 🔁 Replace with your image path
  },
  {
    id: '2',
    title: 'Tarx Car 2398',
    price: 'Rs. 10,000',
    image: require('../assets/images/car.png'),
  },
];

export default function Dashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Featured</Text>
      <FlatList
        data={dummyProducts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push({ pathname: '/product-detail', params: { id: item.id } })}>
            <View style={styles.card}>
              <Image source={item.image} style={styles.image} />
              <Text>{item.title}</Text>
              <Text>{item.price}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
