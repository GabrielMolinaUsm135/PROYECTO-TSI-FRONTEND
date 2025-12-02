import axiosInstance from './axiosinstance';

export async function crearInsumo(payload: Record<string, any>) {
  try {
    // POST to /api/profesores (axiosInstance baseURL = /api)
    const { data } = await axiosInstance.post('http://localhost:3000/api/insumos', payload, { headers: { 'Content-Type': 'application/json' } });
    return { success: true, data };
  } catch (err: any) {
    console.error('Error crearInsumo:', err);
    return { success: false, error: err.response?.data?.error ?? err.message ?? 'unexpected error' };
  }
}

export async function getListaInsumos() {
  try {
    const { data } = await axiosInstance.get('/insumos');
    return data?.data ?? data ?? [];
  } catch (err:any) {
    console.error('Error fetching insumos:', err);
    return [];
  }
}

export async function insumoEliminar(cod_insumo: string) {
  try {
    const url = `/insumos/${encodeURIComponent(cod_insumo)}`;
    const { data } = await axiosInstance.delete(url);
    return { success: true, data };
  } catch (err:any) {
    console.error('Error deleting insumo:', err);
    return { success: false, error: err.response?.data ?? err.message ?? 'unexpected error' };
  }
}

export async function getInsumo(cod_insumo: string) {
  try {
    const { data } = await axiosInstance.get(`/insumos/${encodeURIComponent(cod_insumo)}`);
    return data?.data ?? data ?? null;
  } catch (err:any) {
    console.error('Error fetching insumo by cod:', err);
    return null;
  }
}

export async function actualizarInsumo(id: string, payload: Partial<{ nombre_insumo: string; observacion: string | null;}>) {
  try {
    const url = `/insumos/${encodeURIComponent(id)}`;
    // Only send the fields that match the backend model: nombre_insumo and observacion
    const body: Record<string, any> = {};
    if (payload.nombre_insumo !== undefined) body.nombre_insumo = payload.nombre_insumo;
    if (payload.observacion !== undefined) body.observacion = payload.observacion;
    const { data } = await axiosInstance.put(url, body);
    return { success: true, data };
  } catch (err:any) {
    console.error('Error updating insumo:', err);
    console.error('Update response body:', err.response?.data);
    return { success: false, error: err.response?.data ?? err.message ?? 'unexpected error' };
  }
}
