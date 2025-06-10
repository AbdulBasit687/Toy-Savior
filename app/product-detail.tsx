// File path: /app/product-detail.tsx
import { useLocalSearchParams } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";

const productMap = {
  "1": {
    title: "Drone BA-965K",
    price: "Rs. 45,000",
    image: require("../assets/images/drone.png"),
    description: "Remote drone, fully working condition",
  },
  "2": {
    title: "Tarx Car 2398",
    price: "Rs. 10,000",
    image: require("../assets/images/car.png"),
    description: "Electric car, charger included",
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 16,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    color: "#666",
    marginBottom: 8,
  },
});
