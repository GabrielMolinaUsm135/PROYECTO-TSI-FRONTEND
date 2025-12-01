import axiosInstance from './axiosinstance';
import { safeParse } from 'valibot';
import { ListaNotasSchema} from '../types/notas';


export async function getListaNotas() {
    try {
    const url = '/notas';
    const { data } = await axiosInstance.get(url);
    // backend may return { data: [...] } or directly an array — handle both
    const listaRaw = data?.data ?? data;
    // Normalize notas items: { fecha_evaluacion, nombre_evaluacion, nota }
    const lista = Array.isArray(listaRaw)
      ? listaRaw
          .map((item: any) => {
            const fechaRaw = item.fecha_evaluacion ?? item.fecha ?? item.fecha_eval ?? item.created_at ?? item.fechaEvaluacion;
            const fecha = fechaRaw ? new Date(fechaRaw) : null;
            const nombre = item.nombre_evaluacion ?? item.nombre ?? item.titulo ?? item.nombreEvaluacion ?? '';
            const notaVal = item.nota ?? item.score ?? item.valor ?? item.value ?? null;
            const nota = notaVal !== null && notaVal !== undefined ? Number(notaVal) : null;
            return {
              fecha_evaluacion: fecha,
              nombre_evaluacion: String(nombre ?? ''),
              nota: nota,
            };
          })
          .filter((it: any) => it.fecha_evaluacion instanceof Date && !isNaN(it.fecha_evaluacion.getTime()) && typeof it.nombre_evaluacion === 'string' && it.nota !== null && !isNaN(it.nota))
      : [];

    const resultado = safeParse(ListaNotasSchema, lista);
    if (resultado.success) {
      return lista;
    } else {
      throw new Error('Error en la validacion de datos de notas');
    }
    } catch (error) {
        console.error('Error al obtener lista de Notas', error);
        return []; // Devolver array vacío en caso de error
    }
}

export async function getNotasByAlumno(id_alumno: number | string) {
    try {
        const url = `/Tnotas/${encodeURIComponent(String(id_alumno))}`;
        const { data } = await axiosInstance.get(url);
        const listaRaw = data?.data ?? data;

        const lista = Array.isArray(listaRaw)
          ? listaRaw
              .map((item: any) => {
                const fechaRaw = item.fecha_evaluacion ?? item.fecha ?? item.fecha_eval ?? item.created_at ?? item.fechaEvaluacion;
                const fecha = fechaRaw ? new Date(fechaRaw) : null;
                const nombre = item.nombre_evaluacion ?? item.nombre ?? item.titulo ?? item.nombreEvaluacion ?? '';
                const notaVal = item.nota ?? item.score ?? item.valor ?? item.value ?? null;
                const nota = notaVal !== null && notaVal !== undefined ? Number(notaVal) : null;
                return {
                  id_nota: item.id_nota ?? item.id ?? null,
                  id_alumno: item.id_alumno ?? item.alumno_id ?? item.idAlumno ?? id_alumno,
                  fecha_evaluacion: fecha,
                  nombre_evaluacion: String(nombre ?? ''),
                  nota: nota,
                };
              })
              .filter((it: any) => it.fecha_evaluacion instanceof Date && !isNaN(it.fecha_evaluacion.getTime()) && typeof it.nombre_evaluacion === 'string' && it.nota !== null && !isNaN(it.nota))
          : [];

        // We can validate using ListaNotasSchema if needed, but return the normalized list
        return lista;
    } catch (error) {
        console.error('Error al obtener notas por alumno', error);
        return [];
    }
}