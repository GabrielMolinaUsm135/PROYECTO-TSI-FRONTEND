import axiosInstance from './axiosinstance';
import { safeParse } from "valibot";
import { ListaImagenesSchema} from '../types/imagen';

export async function getListaImagenes() {
    try {
    const url = '/lista/imagenes';
    const { data } = await axiosInstance.get(url);
    // backend may return { data: [...] } or directly an array — handle both
    const lista = data?.data ?? data;
    const resultado = safeParse(ListaImagenesSchema, lista);
        if (resultado.success) {
            return resultado.output;
        } else {
            throw new Error('Error en la validacion de datos');
        }
    } catch (error) {
        console.error('Error al obtener lista de imagenes:', error);
        return []; // Devolver array vacío en caso de error
    }
}

export async function crearimagen(payload: Record<string, any>) {
  try {
    const { data } = await axiosInstance.post('/imagenes', payload, { headers: { 'Content-Type': 'application/json' } });
    return { success: true, data };
  } catch (err: any) {
    console.error('Error crearimagen:', err);
    const resp = err?.response;
    if (resp) console.error('Response data:', resp.data, 'status:', resp.status);
    return { success: false, error: resp?.data ?? err.message ?? 'unexpected error' };
  }
}

// Create image record associated to an insumo
export async function crearImagenInsumo(payload: { cod_insumo: string | number; imagenIns: string }) {
  try {
    const { data } = await axiosInstance.post('/imagenesIns', payload, { headers: { 'Content-Type': 'application/json' } });
    return { success: true, data };
  } catch (err: any) {
    console.error('Error crearImagenInsumo:', err);
    const resp = err?.response;
    if (resp) console.error('Response data:', resp.data, 'status:', resp.status);
    return { success: false, error: resp?.data ?? err.message ?? 'unexpected error' };
  }
}


export async function getListaImagenesinsumos() {
    try {
    const url = '/lista/imagenesIns';
    const { data } = await axiosInstance.get(url);
    // backend may return { data: [...] } or directly an array — handle both
    const lista = data?.data ?? data;
    const resultado = safeParse(ListaImagenesSchema, lista);
        if (resultado.success) {
            return resultado.output;
        } else {
            throw new Error('Error en la validacion de datos');
        }
    } catch (error) {
        console.error('Error al obtener lista de imagenes:', error);
        return []; // Devolver array vacío en caso de error
    }
}
