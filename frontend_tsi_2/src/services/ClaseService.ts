import axiosInstance from './axiosinstance';
import { safeParse } from 'valibot';
import { ListaClasesSchema } from '../types/clase';

export async function getListaClases() {
  try {
    const url = '/clases';
    const { data } = await axiosInstance.get(url);
    const listaRaw = data?.data ?? data;
    // Normalizar forma: aceptar `nombre_asignatura` o `asignatura` y varios nombres de id
    const lista = Array.isArray(listaRaw)
      ? listaRaw.map((item: any) => ({
          id_profesor: item.id_profesor ?? item.idProfesor ?? item.id_prof ?? item.id ?? null,
          id_usuario: item.id_usuario ?? item.idUsuario ?? item.usuarioId ?? item.usuario?.id ?? null,
          asignatura: item.nombre_asignatura ?? item.asignatura ?? item.nombre ?? '',
        }))
      : [];

    const resultado = safeParse(ListaClasesSchema, lista);
    if (resultado.success) {
      return resultado.output;
    }
    throw new Error('Error en validacion de clases');
  } catch (err: any) {
    console.error('Error al obtener lista de clases:', err);
    return [];
  }
}
