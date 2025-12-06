import { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";

export default function FormularioUsuario({
  onGuardar,

  usuarioParaEditar,
}) {
  const [nombre, setNombre] = useState(usuarioParaEditar?.nombre || "");
  const [email, setEmail] = useState(usuarioParaEditar?.email || "");

  const handleGuardar = () => {
    if (!nombre.trim() || !email.trim()) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    if (usuarioParaEditar) {
      onGuardar({ id: usuarioParaEditar.id, nombre, email });
    } else {
      onGuardar({ nombre, email });
    }
  };

  return (
    <View style={styles.form}>
      <TextInput
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
      />
      <View style={styles.buttons}>
        <Button
          title={usuarioParaEditar ? "Actualizar" : "Guardar"}
          onPress={handleGuardar}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    marginVertical: 20,
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
});
