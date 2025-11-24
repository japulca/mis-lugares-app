import { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import {
  getUsuarios,
  crearUsuario,
  eliminarUsuario,
  actualizarUsuario,
} from "../api/supabase";
import FormularioUsuario from "../components/FormularioUsuario";
import UsuarioCard from "../components/UsuarioCard";
import { ImageBackground } from "react-native";

export default function UsuariosScreen({ navigation }) {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    setLoading(true);
    const data = await getUsuarios();
    setUsuarios(data);
    setLoading(false);
  };

  const handleCrear = async (datos) => {
    await crearUsuario(datos);
    setMostrarForm(false);
    cargarUsuarios();
  };

  const handleEliminar = async (id) => {
    await eliminarUsuario(id);
    cargarUsuarios();
  };

  const handleEditar = (usuario) => {
    // Guardar el usuario que quieres editar
    setUsuarioEditando(usuario);
    // Mostrar el formulario
    setMostrarForm(true);
  };

  const handleActualizar = async (datos) => {
    await actualizarUsuario(datos.id, {
      nombre: datos.nombre,
      email: datos.email,
    });

    setMostrarForm(false);
    setUsuarioEditando(null);
    cargarUsuarios();
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={{
        uri: "https://images.pexels.com/photos/372360/pexels-photo-372360.jpeg",
      }}
      style={styles.backgroundImage}
      imageStyle={{ opacity: 0.3 }}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Button
          color="#ae1c1cff"
          title={mostrarForm ? "Cancelar" : "+ Crear Usuario"}
          onPress={() => setMostrarForm(!mostrarForm)}
        />

        {mostrarForm && (
          <FormularioUsuario
            usuarioParaEditar={usuarioEditando}
            onGuardar={usuarioEditando ? handleActualizar : handleCrear}
            onCancelar={() => setMostrarForm(false)}
          />
        )}

        <FlatList
          data={usuarios}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <UsuarioCard
              usuario={item}
              onEliminar={() => handleEliminar(item.id)}
              onEditar={() => handleEditar(item)}
            />
          )}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "transparent",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
