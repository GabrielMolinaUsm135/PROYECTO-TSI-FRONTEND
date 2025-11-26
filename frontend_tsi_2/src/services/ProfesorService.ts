import { ListaProfesoresSchema } from '../types/profesor';
import axiosInstance from './axiosinstance';
import { safeParse } from 'valibot';
import { getListaClases } from './ClaseService';

export async function crearProfesor(payload: Record<string, any>) {
  try {
    // basic sanity
    if (!payload || !payload.nombre || !payload.correo || !payload.password) {
      return { success: false, error: 'missing_fields' };
    }

    // POST to /api/profesores (axiosInstance baseURL = /api)
    const { data } = await axiosInstance.post('http://localhost:3000/api/profesores', payload, { headers: { 'Content-Type': 'application/json' } });
    return { success: true, data };
  } catch (err: any) {
    console.error('Error crearProfesor:', err);
    return { success: false, error: err.response?.data?.error ?? err.message ?? 'unexpected error' };
  }
}

export async function getListaProfesor() {
    try {
    const url = '/profesores';
    const { data } = await axiosInstance.get(url);
    // backend may return { data: [...] } or directly an array — handle both
    const listaRaw = data?.data ?? data;
    // obtener clases y construir mapa por id_usuario -> asignatura
    const clases = await getListaClases();
    const clasePorUsuario = new Map<number | string, string>();
    for (const c of clases) {
      const key = c.id_usuario ?? c.id_profesor ?? null;
      if (key != null) clasePorUsuario.set(String(key), c.nombre_asignatura ?? '');
    }

    // Filtrar por rol == 2 (soporta variantes) y normalizar cada objeto a la forma que espera ListaProfesoresSchema
    const lista = Array.isArray(listaRaw)
      ? listaRaw
          .filter((item: any) => {
            const posible = item.id_rol ?? item.usuario?.id_rol ?? item.idRol ?? item.role_id ?? item.role;
            const rol = Number(posible);
            return rol === 2;
          })
          .map((item: any) => {
            const id_usuario = item.id_usuario ?? item.usuario?.id_usuario ?? item.idUsuario ?? item.usuario?.id ?? item.id_user ?? null;
            const asignaturaDesdeClase = id_usuario != null ? clasePorUsuario.get(String(id_usuario)) : undefined;
            return {
              rut: item.rut ?? item.id_rut ?? item.id ?? item.rut_profesor ?? '',
              id_profesor: item.id_profesor ?? item.idProfesor ?? item.id ?? null,
              id_usuario: item.id_usuario ?? item.usuario?.id ?? item.idUsuario ?? null,
              nombre: item.nombre ?? item.nombre_completo?.split(' ')?.[0] ?? '',
              apellido_paterno: item.apellido_paterno ?? item.apellidoPaterno ?? '',
              apellido_materno: item.apellido_materno ?? item.apellidoMaterno ?? '',
              asignatura: asignaturaDesdeClase ?? item.asignatura ?? item.subject ?? '',
            };
          })
      : [];

    const resultado = safeParse(ListaProfesoresSchema, lista);
      if (resultado.success) {
        // devuelve la lista original (incluye id_profesor/id_usuario normalizados)
        return lista;
      } else {
        throw new Error('Error en la validacion de datos');
      }
    } catch (error) {
        console.error('Error al obtener lista de profesores:', error);
        return []; // Devolver array vacío en caso de error
    }
}


export async function ProfesorEliminar(id_profesor: string | number, id_usuario : string | number) {
    try {
        // delete profesor by its primary id
    const profesorUrl = `/profesores/${id_profesor}`;
        await axiosInstance.delete(profesorUrl);
        // if an associated usuario id is provided, delete that user as well
        // NOTE: skipping deletion of associated `usuario` because backend does not expose
        // a stable delete endpoint for users in this project. Removing the automatic
        // deletion avoids 404 errors. If you want to re-enable, implement the exact
        // endpoint and uncomment the logic above.
        // We simply return success and indicate userDeleted = null (not attempted).

        return { success: true, userDeleted: null };
    } catch (error:any) {
      console.error('Error ProfesorEliminar:', error?.response ?? error);
      const payload = error?.response?.data ?? error?.message ?? 'unexpected error';
      const errorString = typeof payload === 'object' ? JSON.stringify(payload) : String(payload);
      return { success: false, error: errorString };
    }
}
