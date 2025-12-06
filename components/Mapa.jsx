import { StyleSheet, Text, View } from "react-native";
import MapView from "react-native-maps";

export default function Mapa() {
  const granCanaria = {
    latitude: 28.05,
    longitude: -15.45,
    latitudeDelta: 0.7,
    longitudeDelta: 0.6,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Gran Canaria </Text>

      <MapView style={styles.mapa} initialRegion={granCanaria}></MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  mapa: {
    width: "100%",
    height: 300,
    borderRadius: 10,
  },
});
