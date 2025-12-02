import axiosInstance from './axiosinstance';


export async function crearInstrumento(payload: Record<string, any>) {
  try {
    // POST to /api/profesores (axiosInstance baseURL = /api)
    const { data } = await axiosInstance.post('http://localhost:3000/api/instrumentos', payload, { headers: { 'Content-Type': 'application/json' } });
    return { success: true, data };
  } catch (err: any) {
    console.error('Error crearInstrumento:', err);
    return { success: false, error: err.response?.data?.error ?? err.message ?? 'unexpected error' };
  }
}


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

export async function asociarInsumoAInstrumento(codInstrumento: string, codInsumo: string) {
  // Try several common backend routes to associate insumo to instrumento
  const attempts = [
    async () => {
      // POST /instrumentos/:id/insumos { cod_insumo }
      const url = `/instrumentos/${encodeURIComponent(codInstrumento)}/insumos`;
      return axiosInstance.post(url, { cod_insumo: codInsumo });
    },
    async () => {
      // POST /instrumento_insumo { cod_instrumento, cod_insumo }
      return axiosInstance.post('/instrumento_insumo', { cod_instrumento: codInstrumento, cod_insumo: codInsumo });
    },
    async () => {
      // PUT /instrumentos/:id { insumos: [cod] } (less common but try)
      const url = `/instrumentos/${encodeURIComponent(codInstrumento)}`;
      return axiosInstance.put(url, { insumos: [codInsumo] });
    }
  ];

  for (const attempt of attempts) {
    try {
      const { data } = await attempt();
      return { success: true, data: data?.data ?? data };
    } catch (err:any) {
      // continue to next attempt, but keep last error
      console.debug('asociarInsumo attempt failed:', err.response?.status, err.response?.data);
      var lastErr = err;
    }
  }

  console.error('Failed to associate insumo to instrumento:', lastErr?.response?.data ?? lastErr?.message ?? lastErr);
  return { success: false, error: lastErr?.response?.data ?? lastErr?.message ?? 'failed to associate' };
}

export async function getInsumosPorInstrumento(codInstrumento: string) {
  try {
    const url = `/instrumento_insumo/${encodeURIComponent(codInstrumento)}`;
    const { data } = await axiosInstance.get(url);
    // expected shape: { data: [ { cod_instrumento, cod_insumo }, ... ] }
    return data?.data ?? data ?? [];
  } catch (err:any) {
    console.error('Error fetching instrumento_insumo relations:', err);
    console.error('Response body:', err.response?.data);
    return [];
  }
}

export async function getInstrumentosPorInsumo(codInsumo: string) {
  try {
    const url = `/instrumento_insumo/insumo/${encodeURIComponent(codInsumo)}`;
    const { data } = await axiosInstance.get(url);
    // expected shape: { data: [ { cod_instrumento, cod_insumo }, ... ] }
    return data?.data ?? data ?? [];
  } catch (err:any) {
    console.error('Error fetching instrumento_insumo by insumo:', err);
    console.error('Response body:', err.response?.data);
    return [];
  }
}

export async function desasociarInsumoDeInstrumento(codInstrumento: string, codInsumo: string) {
  // Try several common backend routes to remove the association
  const attempts = [
    async () => {
      // DELETE /instrumento_insumo/:instrumento/:insumo
      const url = `/instrumento_insumo/${encodeURIComponent(codInstrumento)}/${encodeURIComponent(codInsumo)}`;
      return axiosInstance.delete(url);
    },
    async () => {
      // DELETE /instrumento_insumo with body { cod_instrumento, cod_insumo }
      return axiosInstance.delete('/instrumento_insumo', { data: { cod_instrumento: codInstrumento, cod_insumo: codInsumo } });
    },
    async () => {
      // DELETE /instrumento_insumo/:instrumento with query param cod_insumo
      const url = `/instrumento_insumo/${encodeURIComponent(codInstrumento)}`;
      return axiosInstance.delete(url, { params: { cod_insumo: codInsumo } });
    }
  ];

  for (const attempt of attempts) {
    try {
      const { data } = await attempt();
      return { success: true, data: data?.data ?? data };
    } catch (err:any) {
      console.debug('desasociarInsumo attempt failed:', err.response?.status, err.response?.data);
      var lastErr = err;
    }
  }

  console.error('Failed to remove association instrumento_insumo:', lastErr?.response?.data ?? lastErr?.message ?? lastErr);
  return { success: false, error: lastErr?.response?.data ?? lastErr?.message ?? 'failed to remove association' };
}
