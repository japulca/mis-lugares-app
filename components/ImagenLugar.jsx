import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ImagenLugar({ imagenUri, setImagenUri }) {
  const [permisoGaleria, setPermisoGaleria] = useState(null);
  const [permisoCamara, setPermisoCamara] = useState(null);

  // Pedir permiso de galería
  async function pedirPermisoGaleria() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setPermisoGaleria(status === "granted");
    return status === "granted";
  }

  // Pedir permiso de cámara
  async function pedirPermisoCamara() {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setPermisoCamara(status === "granted");
    return status === "granted";
  }

  // Abrir galería
  async function abrirGaleria() {
    const tienePermiso = permisoGaleria || (await pedirPermisoGaleria());

    if (!tienePermiso) {
      Alert.alert("Permiso denegado", "Necesitamos acceso a tu galería");
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!resultado.canceled) {
      setImagenUri(resultado.assets[0].uri);
    }
  }

  // Abrir cámara
  async function abrirCamara() {
    const tienePermiso = permisoCamara || (await pedirPermisoCamara());

    if (!tienePermiso) {
      Alert.alert("Permiso denegado", "Necesitamos acceso a tu cámara");
      return;
    }

    const resultado = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!resultado.canceled) {
      setImagenUri(resultado.assets[0].uri);
    }
  }

  return (
    <View style={styles.container}>
      {imagenUri ? (
        <Image source={{ uri: imagenUri }} style={styles.imagen} />
      ) : (
        <View style={styles.sinImagen}>
          <Text style={styles.textoSinImagen}>Sin imagen</Text>
        </View>
      )}

      <View style={styles.botones}>
        <TouchableOpacity style={styles.boton} onPress={abrirGaleria}>
          <Text style={styles.textoBoton}>Galería</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.boton} onPress={abrirCamara}>
          <Text style={styles.textoBoton}> Cámara</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    marginHorizontal: 10,
    alignItems: "center",
  },
  imagen: {
    width: 120,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  sinImagen: {
    width: 120,
    height: 100,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  textoSinImagen: {
    color: "#999",
    fontSize: 16,
  },
  botones: {
    flexDirection: "row",
    gap: 5,
  },
  boton: {
    backgroundColor: "#2c4b6bff",
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 8,
  },
  textoBoton: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
