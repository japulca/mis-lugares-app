const SUPABASE_URL = "https://atdzebjweqwhchfgauuj.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0ZHplYmp3ZXF3aGNoZmdhdXVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNDYxNDUsImV4cCI6MjA3ODcyMjE0NX0.2b08f6YW2KDsZxp4hffDVUnQrDOQcAMQJK5mwY1SlQo";

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

// ========== USUARIOS ==========

export const getUsuarios = async () => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/usuarios`, {
      headers,
    });
    return await response.json();
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return [];
  }
};

export const crearUsuario = async (datos) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/usuarios`, {
      method: "POST",
      headers,
      body: JSON.stringify(datos),
    });
    return await response.json();
  } catch (error) {
    console.error("Error al crear usuario:", error);
    throw error;
  }
};

export const eliminarUsuario = async (id) => {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/usuarios?id=eq.${id}`,
      {
        method: "DELETE",
        headers,
      }
    );
    return await response.json();
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    throw error;
  }
};

export const actualizarUsuario = async (id, datos) => {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/usuarios?id=eq.${id}`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify(datos),
      }
    );
    return await response.json();
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    throw error;
  }
};

/* LUGARES */

export const getLugares = async () => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/lugares`, {
      headers,
    });
    return await response.json();
  } catch (error) {
    console.error("Error al obtener los lugares:", error);
    return [];
  }
};

export const crearLugar = async (datos) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/lugares`, {
      method: "POST",
      headers,
      body: JSON.stringify(datos),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(result));
    }

    return result;
  } catch (error) {
    console.error("🔴 Error completo:", error);
    throw error;
  }
};

export const eliminarLugar = async (id) => {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/lugares?id=eq.${id}`,
      {
        method: "DELETE",
        headers,
      }
    );
    return await response.json();
  } catch (error) {
    console.error("Error al eliminar el lugar:", error);
    throw error;
  }
};

export const actualizarLugar = async (id, datos) => {
  console.log("🌐 actualizarLugar:", { id, datos });

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/lugares?id=eq.${id}`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify(datos),
      }
    );

    const result = await response.json();
    console.log("🌐 Respuesta actualización:", result);

    return result;
  } catch (error) {
    console.error("Error al actualizar el lugar:", error);
    throw error;
  }
};

export const getLugaresByUsuario = async (usuarioId) => {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/lugares?usuario_id=eq.${usuarioId}`,
      { headers }
    );
    return await response.json();
  } catch (error) {
    console.error("Error al obtener lugares:", error);
    return [];
  }
};

/* IMAGENES */

// ========== IMÁGENES ==========

/**
 * Sube una imagen al bucket de Supabase Storage
 * @param {string} uri - URI local de la imagen (ej: file:///...)
 * @param {string} nombreArchivo - Nombre con el que se guardará (ej: lugar_123456.jpg)
 * @returns {string} URL pública de la imagen subida
 */
export const subirImagen = async (uri, nombreArchivo) => {
  try {
    // 1. Crear FormData
    const formData = new FormData();

    // 2. Convertir URI a blob
    const response = await fetch(uri);
    const blob = await response.blob();

    // 3. Añadir al FormData
    formData.append("file", blob, nombreArchivo);

    // 4. Subir a Supabase
    const uploadResponse = await fetch(
      `${SUPABASE_URL}/storage/v1/object/imagenes-lugares/${nombreArchivo}`,
      {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        body: formData,
      }
    );

    // 5. Leer respuesta (SOLO UNA VEZ)
    const result = await uploadResponse.json();

    // 7. Verificar si fue exitoso
    if (!uploadResponse.ok) {
      throw new Error(result.message || JSON.stringify(result));
    }

    // 8. Construir URL pública
    return `${SUPABASE_URL}/storage/v1/object/public/imagenes-lugares/${nombreArchivo}`;
  } catch (error) {
    console.error("❌ Error completo:", error);
    throw error;
  }
};
export const eliminarImagen = async (imagenPath) => {
  try {
    if (!imagenPath) return;

    const nombreArchivo = imagenPath.split("/").pop();

    await fetch(
      `${SUPABASE_URL}/storage/v1/object/imagenes-lugares/${nombreArchivo}`,
      {
        method: "DELETE",
        headers,
      }
    );
  } catch (error) {
    console.error("Error al eliminar imagen:", error);
  }
};
