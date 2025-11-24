import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  Platform,
  Image,
} from "react-native";

export default function LugarCard({ lugar, onEliminar, onEditar }) {
  const confirmarEliminar = () => {
    if (Platform.OS === "web") {
      const confirmado = window.confirm(`¿Eliminar a ${lugar.nombre_lugar}?`);
      if (confirmado) {
        onEliminar();
      }
    } else {
      Alert.alert("Confirmar", `¿Eliminar a ${lugar.nombre_lugar}?`, [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", onPress: onEliminar, style: "destructive" },
      ]);
    }
  };

  const confirmarEditar = () => {
    onEditar();
  };

  return (
    <View style={styles.card}>
      {/* MOSTRAR IMAGEN SI EXISTE */}
      {lugar.imagen_path && (
        <Image source={{ uri: lugar.imagen_path }} style={styles.imagenLugar} />
      )}

      <View style={styles.info}>
        <Text style={styles.nombre}>{lugar.nombre_lugar}</Text>
        <Text style={styles.descripcion}>{lugar.descripcion}</Text>
      </View>

      <View style={styles.bottons}>
        <Button title="Eliminar" onPress={confirmarEliminar} color="red" />
        <Button title="Editar" onPress={confirmarEditar} color="blue" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  // AÑADIR ESTILO PARA LA IMAGEN
  imagenLugar: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  bottons: {
    flexDirection: "row",
    gap: 10,
  },
  info: {
    flex: 1,
  },
  nombre: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  descripcion: {
    fontSize: 14,
    color: "#666",
  },
});
