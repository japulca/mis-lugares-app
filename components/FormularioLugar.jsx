import { useState, useEffect } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import ImagenLugar from "./ImagenLugar"; // ← IMPORTAR componente
import { subirImagen, eliminarImagen } from "../api/supabase"; // ← IMPORTAR función

export default function FormularioLugar({
  onGuardar,
  onCancelar,
  lugarParaEditar,
}) {
  // Estados para los campos del formulario
  const [nombre, setNombre] = useState(lugarParaEditar?.nombre_lugar || "");
  const [descripcion, setDescripcion] = useState(
    lugarParaEditar?.descripcion || ""
  );

  // ← NUEVO: Estado para la URI de la imagen seleccionada
  const [imagenUri, setImagenUri] = useState(null);

  // ← NUEVO: Estado para mostrar loading mientras sube la imagen
  const [subiendo, setSubiendo] = useState(false);

  useEffect(() => {
    if (lugarParaEditar) {
      // Estamos editando, cargar datos
      setNombre(lugarParaEditar.nombre_lugar || "");
      setDescripcion(lugarParaEditar.descripcion || "");
      setImagenUri(lugarParaEditar.imagen_path || null);
    } else {
      // Estamos creando, limpiar campos
      setNombre("");
      setDescripcion("");
      setImagenUri(null);
    }
  }, [lugarParaEditar]);
  const handleGuardar = async () => {
    // 1. Validar que los campos obligatorios estén completos
    if (!nombre.trim() || !descripcion.trim()) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    try {
      // Mostrar indicador de carga
      setSubiendo(true);

      // 2. Inicializar la ruta de la imagen
      // Si estamos editando y ya tenía imagen, mantenerla
      let imagenPath = lugarParaEditar?.imagen_path || null;

      // ← CLAVE: Si hay una NUEVA imagen (URI local, no URL de Supabase)
      if (imagenUri && !imagenUri.startsWith("http")) {
        // Es una imagen nueva desde galería/cámara
        const nombreArchivo = `lugar_${Date.now()}.jpg`;
        imagenPath = await subirImagen(imagenUri, nombreArchivo);

        // BONUS: Eliminar la imagen vieja si existe
        if (lugarParaEditar?.imagen_path) {
          await eliminarImagen(lugarParaEditar.imagen_path);
        }
      }

      // 4. Preparar los datos a enviar
      const datos = {
        nombre_lugar: nombre,
        descripcion: descripcion,
        imagen_path: imagenPath, // URL de la imagen o null
      };

      // 5. Si estamos editando, incluir el ID
      if (lugarParaEditar) {
        datos.id = lugarParaEditar.id;
      }

      // 6. Llamar a la función del padre (handleCrear o handleActualizar)
      onGuardar(datos);
    } catch (error) {
      // Si hubo error al subir la imagen, mostrar alerta
      Alert.alert("Error", "No se pudo subir la imagen");
      console.error(error);
    } finally {
      // Ocultar indicador de carga (se ejecute bien o mal)
      setSubiendo(false);
    }
  };

  return (
    <View style={styles.form}>
      {/* Input para nombre del lugar */}
      <TextInput
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
        style={styles.input}
      />

      {/* Input para descripción */}
      <TextInput
        placeholder="Descripcion"
        value={descripcion}
        onChangeText={setDescripcion}
        style={styles.input}
      />

      {/* ← NUEVO: Componente para seleccionar imagen */}
      <ImagenLugar
        imagenUri={imagenUri} // URI actual de la imagen
        setImagenUri={setImagenUri} // Función para actualizarla
      />

      {/* Botones de acción */}
      <View style={styles.buttons}>
        <Button
          title={
            subiendo
              ? "Subiendo..."
              : lugarParaEditar
              ? "Actualizar"
              : "Guardar"
          }
          onPress={handleGuardar}
          disabled={subiendo} // Deshabilitar mientras sube
        />
        <Button
          title="Cancelar"
          onPress={onCancelar}
          color="gray"
          disabled={subiendo} // Deshabilitar mientras sube
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
