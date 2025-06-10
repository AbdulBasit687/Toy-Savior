// File path: /app/dashboard.tsx
import { router } from "expo-router";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const dummyProducts = [
  {
    id: "1",
    title: "Drone BA-965K",
    price: "Rs. 45,000",
    image: require("../assets/images/drone.png"), // 🔁 Replace with your image path
  },
  {
    id: "2",
    title: "Tarx Car 2398",
    price: "Rs. 10,000",
    image: require("../assets/images/car.png"),
  },
];

export default function Dashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Featured</Text>
      <FlatList
        data={dummyProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/product-detail",
                params: { id: item.id },
              })
            }
          >
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 8,
    resizeMode: "contain",
  },
});
