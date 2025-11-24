import axiosInstance from './axiosinstance';

export async function crearProfesor(payload: Record<string, any>) {
  try {
    // basic sanity
    if (!payload || !payload.nombre || !payload.correo || !payload.password) {
      return { success: false, error: 'missing_fields' };
    }

    // POST to /api/profesores (axiosInstance baseURL = /api)
    const { data } = await axiosInstance.post('/profesores', payload, { headers: { 'Content-Type': 'application/json' } });
    return { success: true, data };
  } catch (err: any) {
    console.error('Error crearProfesor:', err);
    return { success: false, error: err.response?.data?.error ?? err.message ?? 'unexpected error' };
  }
}
