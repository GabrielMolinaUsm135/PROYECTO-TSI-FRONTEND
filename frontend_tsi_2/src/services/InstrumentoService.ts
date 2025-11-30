import axiosInstance from './axiosinstance';

export async function getListaInstrumentos() {
  try {
    // Use the axios instance baseURL and request the plural resource
    const { data } = await axiosInstance.get('/instrumentos');
    return data?.data ?? data ?? [];
  } catch (err: any) {
    // fallback to singular endpoint
    try {
      const { data } = await axiosInstance.get('/instrumento');
      return data?.data ?? data ?? [];
    } catch (err2:any) {
      console.error('Error fetching instrumentos:', err, err2);
      return [];
    }
  }
}

export async function instrumentoEliminar(cod_instrumento: string) {
  try {
    // Backend uses plural resource for instrumentos; use /instrumentos/:cod
    const url = `/instrumentos/${encodeURIComponent(cod_instrumento)}`;
    const { data } = await axiosInstance.delete(url);
    return { success: true, data };
  } catch (err:any) {
    console.error('Error deleting instrumento:', err);
    console.error('Delete response data:', err.response?.data);
    return { success: false, error: err.response?.data ?? err.message ?? 'unexpected error' };
  }
}

export async function getInstrumento(cod_instrumento: string) {
  try {
    const url = `/instrumentos/${encodeURIComponent(cod_instrumento)}`;
    const { data } = await axiosInstance.get(url);
    return data?.data ?? data ?? null;
  } catch (err:any) {
    console.error('Error fetching instrument by cod:', err);
    console.error('Response body:', err.response?.data);
    return null;
  }
}

export async function actualizarInstrumento(id: string, payload: Partial<{ nombre_instrumento: string; modelo_instrumento: string; tamano: string; observacion: string;}>) {
  try {
    const url = `/instrumentos/${encodeURIComponent(id)}`;
    const { data } = await axiosInstance.put(url, payload);
    return { success: true, data };
  } catch (err:any) {
    console.error('Error updating instrumento:', err);
    console.error('Update response data:', err.response?.data);
    return { success: false, error: err.response?.data ?? err.message ?? 'unexpected error' };
  }
}
