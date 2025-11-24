import { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Button,
  StyleSheet,
  ActivityIndicator,
  Text,
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
  // Extraer el usuario que te pasaron
  const { usuario } = route.params;
  //       ↑ Esto viene de navigation.navigate('Lugares', { usuario: ... })

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
    await crearLugar({ ...datos, usuario_id: usuario.id });
    setMostrarForm(false);
    cargarLugares();
  };

  const handleEliminar = async (id) => {
    await eliminarLugar(id);
    cargarLugares();
  };

  const handleEditar = (lugar) => {
    setLugarEditando(lugar);

    setMostrarForm(true);
  };

  const handleActualizar = async (datos) => {
    console.log("🔴 handleActualizar recibe:", datos); // ← AÑADE
    console.log("🔴 imagen_path:", datos.imagen_path); // ← AÑADE
    await actualizarLugar(datos.id, {
      nombre_lugar: datos.nombre_lugar,
      descripcion: datos.descripcion,
      imagen_path: datos.imagen_path,
    });

    setMostrarForm(false);
    setLugarEditando(null);
    cargarLugares();
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
        title={mostrarForm ? "Cancelar" : "+ Crear Lugar"}
        onPress={() => setMostrarForm(!mostrarForm)}
      />

      {mostrarForm && (
        <FormularioLugar
          lugarParaEditar={lugarEditando}
          onGuardar={lugarEditando ? handleActualizar : handleCrear}
          onCancelar={() => setMostrarForm(false)}
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
