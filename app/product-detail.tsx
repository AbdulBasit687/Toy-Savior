// File path: /app/product-detail.tsx
import { useLocalSearchParams } from 'expo-router';
import { Image, Text, View } from 'react-native';

const productMap = {
  '1': {
    title: 'Drone BA-965K',
    price: 'Rs. 45,000',
    image: require('../assets/images/drone.png'),
    description: 'Remote drone, fully working condition',
  },
  '2': {
    title: 'Tarx Car 2398',
    price: 'Rs. 10,000',
    image: require('../assets/images/car.png'),
    description: 'Electric car, charger included',
  },
};

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const product = productMap[id];

  return (
    <View style={styles.container}>
      <Image source={product.image} style={styles.image} />
      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.price}>{product.price}</Text>
      <Text>{product.description}</Text>
    </View>
  );
}
