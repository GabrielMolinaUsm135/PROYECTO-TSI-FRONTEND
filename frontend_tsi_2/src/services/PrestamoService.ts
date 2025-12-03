import axiosInstance from './axiosinstance';

// Prestamos Instrumento
export async function getPrestamosInstrumento() {
  try {
    const { data } = await axiosInstance.get('/prestamos_instrumento');
    return data?.data ?? data ?? [];
  } catch (err:any) {
    console.error('Error fetching prestamos instrumento', err);
    return [];
  }
}

// Fetch all existing prestamo codigos (instrumento + insumo)
export async function getPrestamoCodigos() {
  try {
    const { data } = await axiosInstance.get('/prestamos/codigos');
    return data?.data ?? data ?? [];
  } catch (err:any) {
    console.error('Error fetching prestamos codigos', err);
    return [];
  }
}

export async function getPrestamoInstrumentoById(id: string | number) {
  try {
    const { data } = await axiosInstance.get(`/prestamos_instrumento/${encodeURIComponent(String(id))}`);
    return data?.data ?? data ?? null;
  } catch (err:any) {
    console.error('Error fetching prestamo instrumento by id', err);
    return null;
  }
}

export async function crearPrestamoInstrumento(payload: Record<string, any>) {
  try {
    // ensure cod_prestamo is sent as a number when provided
    const body = { ...payload } as Record<string, any>;
    if (body.cod_prestamo !== undefined && body.cod_prestamo !== null && body.cod_prestamo !== '') {
      body.cod_prestamo = Number(body.cod_prestamo);
    }
    const { data } = await axiosInstance.post('/prestamos_instrumento', body);
    return { success: true, data: data?.data ?? data };
  } catch (err:any) {
    console.error('Error creating prestamo instrumento', err);
    return { success: false, error: err.response?.data ?? err.message ?? 'unexpected error' };
  }
}

export async function actualizarPrestamoInstrumento(id: string | number, payload: Record<string, any>) {
  try {
    const { data } = await axiosInstance.put(`/prestamos_instrumento/${encodeURIComponent(String(id))}`, payload);
    return { success: true, data: data?.data ?? data };
  } catch (err:any) {
    console.error('Error updating prestamo instrumento', err);
    return { success: false, error: err.response?.data ?? err.message ?? 'unexpected error' };
  }
}

export async function eliminarPrestamoInstrumento(id: string | number) {
  try {
    const { data } = await axiosInstance.delete(`/prestamos_instrumento/${encodeURIComponent(String(id))}`);
    return { success: true, data: data?.data ?? data };
  } catch (err:any) {
    console.error('Error deleting prestamo instrumento', err);
    return { success: false, error: err.response?.data ?? err.message ?? 'unexpected error' };
  }
}

// Prestamos Insumo
export async function getPrestamosInsumo() {
  try {
    const { data } = await axiosInstance.get('/prestamos_insumo');
    return data?.data ?? data ?? [];
  } catch (err:any) {
    console.error('Error fetching prestamos insumo', err);
    return [];
  }
}

export async function getPrestamoInsumoById(id: string | number) {
  try {
    const { data } = await axiosInstance.get(`/prestamos_insumo/${encodeURIComponent(String(id))}`);
    return data?.data ?? data ?? null;
  } catch (err:any) {
    console.error('Error fetching prestamo insumo by id', err);
    return null;
  }
}

export async function crearPrestamoInsumo(payload: Record<string, any>) {
  try {
    const body = { ...payload } as Record<string, any>;
    if (body.cod_prestamo !== undefined && body.cod_prestamo !== null && body.cod_prestamo !== '') {
      body.cod_prestamo = Number(body.cod_prestamo);
    }
    const { data } = await axiosInstance.post('/prestamos_insumo', body);
    return { success: true, data: data?.data ?? data };
  } catch (err:any) {
    console.error('Error creating prestamo insumo', err);
    return { success: false, error: err.response?.data ?? err.message ?? 'unexpected error' };
  }
}

export async function actualizarPrestamoInsumo(id: string | number, payload: Record<string, any>) {
  try {
    const { data } = await axiosInstance.put(`/prestamos_insumo/${encodeURIComponent(String(id))}`, payload);
    return { success: true, data: data?.data ?? data };
  } catch (err:any) {
    console.error('Error updating prestamo insumo', err);
    return { success: false, error: err.response?.data ?? err.message ?? 'unexpected error' };
  }
}

export async function eliminarPrestamoInsumo(id: string | number) {
  try {
    const { data } = await axiosInstance.delete(`/prestamos_insumo/${encodeURIComponent(String(id))}`);
    return { success: true, data: data?.data ?? data };
  } catch (err:any) {
    console.error('Error deleting prestamo insumo', err);
    return { success: false, error: err.response?.data ?? err.message ?? 'unexpected error' };
  }
}
