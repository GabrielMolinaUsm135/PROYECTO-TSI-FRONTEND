import axiosInstance from './axiosinstance';

export async function getListaAlergias() {
  try {
    const { data } = await axiosInstance.get('/alergias');
    return data?.data ?? data ?? [];
  } catch (err:any) {
    console.error('Error fetching alergias:', err);
    return [];
  }
}

export async function getAlergia(id: string | number) {
  try {
    const { data } = await axiosInstance.get(`/alergias/${encodeURIComponent(String(id))}`);
    return data?.data ?? data ?? null;
  } catch (err:any) {
    console.error('Error fetching alergia by id:', err);
    return null;
  }
}

export async function crearAlergia(payload: { nombre_alergia: string }) {
  try {
    const { data } = await axiosInstance.post('/alergias', payload);
    return { success: true, data: data?.data ?? data };
  } catch (err:any) {
    console.error('Error creating alergia:', err);
    return { success: false, error: err.response?.data ?? err.message ?? 'unexpected error' };
  }
}

export async function actualizarAlergia(id: string | number, payload: { nombre_alergia: string }) {
  try {
    const { data } = await axiosInstance.put(`/alergias/${encodeURIComponent(String(id))}`, payload);
    return { success: true, data: data?.data ?? data };
  } catch (err:any) {
    console.error('Error updating alergia:', err);
    return { success: false, error: err.response?.data ?? err.message ?? 'unexpected error' };
  }
}

export async function eliminarAlergia(id: string | number) {
  try {
    const { data } = await axiosInstance.delete(`/alergias/${encodeURIComponent(String(id))}`);
    return { success: true, data: data?.data ?? data };
  } catch (err:any) {
    console.error('Error deleting alergia:', err);
    return { success: false, error: err.response?.data ?? err.message ?? 'unexpected error' };
  }
}

export async function crearAlumnoAlergia(payload: { cod_alergia: number | string; id_alumno: number | string }) {
  try {
    const { data } = await axiosInstance.post('/alumno_alergia', payload);
    return { success: true, data: data?.data ?? data };
  } catch (err:any) {
    console.error('Error creating alumno_alergia:', err);
    return { success: false, error: err.response?.data ?? err.message ?? 'unexpected error' };
  }
}

export async function getAlergiasPorAlumno(id_alumno: number | string) {
  try {
    const { data } = await axiosInstance.get(`/alumno_alergia/alumno/${encodeURIComponent(String(id_alumno))}`);
    return data?.data ?? data ?? [];
  } catch (err:any) {
    console.error('Error fetching alergias for alumno:', err);
    return [];
  }
}

export async function eliminarAlumnoAlergia(cod_alergia: number | string, id_alumno: number | string) {
  try {
    const { data } = await axiosInstance.delete(`/alumno_alergia/${encodeURIComponent(String(cod_alergia))}/${encodeURIComponent(String(id_alumno))}`);
    return { success: true, data: data?.data ?? data };
  } catch (err:any) {
    console.error('Error deleting alumno_alergia relation:', err);
    return { success: false, error: err.response?.data ?? err.message ?? 'unexpected error' };
  }
}
