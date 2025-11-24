import { View, Text, Button, StyleSheet, Alert, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function UsuarioCard({ usuario, onEliminar, onEditar }) {
  const navigation = useNavigation();
  const confirmarEliminar = () => {
    // Si estamos en web, usar window.confirm
    if (Platform.OS === "web") {
      const confirmado = window.confirm(`¿Eliminar a ${usuario.nombre}?`);
      if (confirmado) {
        onEliminar();
      }
    } else {
      // Si estamos en móvil, usar Alert.alert
      Alert.alert("Confirmar", `¿Eliminar a ${usuario.nombre}?`, [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", onPress: onEliminar, style: "destructive" },
      ]);
    }
  };

  const confirmarEditar = () => {
    onEditar();
  };

  const irALugares = () => {
    navigation.navigate("Lugares", { usuario: usuario });
    //                   ↑ Nombre      ↑ Datos que pasas
  };

  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.nombre}>{usuario.nombre}</Text>
        <Text style={styles.email}>{usuario.email}</Text>
      </View>
      <View style={styles.bottons}>
        <Button title="Eliminar" onPress={confirmarEliminar} color="red" />
        <Button title="Editar" onPress={confirmarEditar} color="blue" />
        <Button title="Ver Lugares" onPress={irALugares} color="green" />
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
  email: {
    fontSize: 14,
    color: "#666",
  },
});
