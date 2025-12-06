import { useState, useEffect } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import ImagenLugar from "./ImagenLugar";

export default function FormularioLugar({
  onGuardar,

  lugarParaEditar,
}) {
  const [nombre, setNombre] = useState(lugarParaEditar?.nombre_lugar || "");
  const [descripcion, setDescripcion] = useState(
    lugarParaEditar?.descripcion || ""
  );
  const [imagenUri, setImagenUri] = useState(
    lugarParaEditar?.imagen_path || null
  );

  useEffect(() => {
    if (lugarParaEditar) {
      setNombre(lugarParaEditar.nombre_lugar || "");
      setDescripcion(lugarParaEditar.descripcion || "");
      setImagenUri(lugarParaEditar.imagen_path || null);
    } else {
      setNombre("");
      setDescripcion("");
      setImagenUri(null);
    }
  }, [lugarParaEditar]);

  const handleGuardar = () => {
    if (!nombre.trim() || !descripcion.trim()) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    const datos = {
      nombre_lugar: nombre,
      descripcion: descripcion,
      imagen_path: imagenUri,
    };

    if (lugarParaEditar) {
      datos.id = lugarParaEditar.id;
    }

    onGuardar(datos);
  };

  return (
    <View style={styles.form}>
      <TextInput
        placeholder="Nombre del lugar"
        value={nombre}
        onChangeText={setNombre}
        style={styles.input}
      />

      <TextInput
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
        style={styles.input}
      />

      <ImagenLugar imagenUri={imagenUri} setImagenUri={setImagenUri} />

      <View style={styles.buttons}>
        <Button
          title={lugarParaEditar ? "Actualizar" : "Guardar"}
          onPress={handleGuardar}
          color="#ae1c1cff"
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
