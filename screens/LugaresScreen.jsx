import { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Button,
  StyleSheet,
  ActivityIndicator,
  Text,
  Alert,
} from "react-native";
import {
  getLugaresByUsuario,
  crearLugar,
  eliminarLugar,
  actualizarLugar,
} from "../api/supabase";
import LugarCard from "../components/LugarCard";
import FormularioLugar from "../components/FormularioLugar";

export default function LugaresScreen({ route }) {
  const [lugares, setLugares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [lugarEditando, setLugarEditando] = useState(null);

  const { usuario } = route.params;

  useEffect(() => {
    cargarLugares();
  }, []);

  const cargarLugares = async () => {
    setLoading(true);
    const data = await getLugaresByUsuario(usuario.id);
    setLugares(data);
    setLoading(false);
  };

  const handleCrear = async (datos) => {
    try {
      const nuevoLugar = await crearLugar({
        nombre_lugar: datos.nombre_lugar,
        descripcion: datos.descripcion,
        usuario_id: usuario.id,
        imagen_path: datos.imagen_path,
      });

      setLugares([...lugares, nuevoLugar[0]]);
      setMostrarForm(false);
    } catch (error) {
      console.error("Error al crear lugar:", error);
      Alert.alert("Error", "No se pudo crear el lugar");
    }
  };

  const handleEliminar = async (id) => {
    await eliminarLugar(id);
    setLugares(lugares.filter((lugar) => lugar.id !== id));
  };

  const handleEditar = (lugar) => {
    setLugarEditando(lugar);
    setMostrarForm(true);
  };

  const handleActualizar = async (datos) => {
    try {
      await actualizarLugar(datos.id, {
        nombre_lugar: datos.nombre_lugar,
        descripcion: datos.descripcion,
        imagen_path: datos.imagen_path,
      });

      setLugares(
        lugares.map((lugar) =>
          lugar.id === datos.id
            ? {
                ...lugar,
                nombre_lugar: datos.nombre_lugar,
                descripcion: datos.descripcion,
                imagen_path: datos.imagen_path,
              }
            : lugar
        )
      );

      setMostrarForm(false);
      setLugarEditando(null);
    } catch (error) {
      console.error("Error al actualizar lugar:", error);
      Alert.alert("Error", "No se pudo actualizar el lugar");
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lugares de {usuario.nombre}</Text>

      <Button
        color="#ae1c1cff"
        title={mostrarForm ? "Cancelar" : "+ Crear Lugar"}
        onPress={() => {
          setMostrarForm(!mostrarForm);
          if (mostrarForm) setLugarEditando(null);
        }}
      />

      {mostrarForm && (
        <FormularioLugar
          lugarParaEditar={lugarEditando}
          onGuardar={lugarEditando ? handleActualizar : handleCrear}
          onCancelar={() => {
            setMostrarForm(false);
            setLugarEditando(null);
          }}
        />
      )}

      <FlatList
        data={lugares}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <LugarCard
            lugar={item}
            onEliminar={() => handleEliminar(item.id)}
            onEditar={() => handleEditar(item)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
});
