import axiosInstance from './axiosinstance';
import { safeParse } from 'valibot';
import { ListaImagenesSchema } from '../types/imagen';

export async function getListaImagenes() {
  try {
    const url = '/lista/imagenes';
    const { data } = await axiosInstance.get(url);
    const lista = data?.data ?? data;
    const resultado = safeParse(ListaImagenesSchema, lista);
    if (resultado.success) {
      return resultado.output;
    } else {
      throw new Error('Error en la validacion de datos');
    }
  } catch (error) {
    console.error('Error al obtener lista de imagenes:', error);
    return [];
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
export async function ImagenEliminar(id_usuario : string | number) {
    try {
        
    const imagenUrl = `/imagenes/${id_usuario}`;
        await axiosInstance.delete(imagenUrl);
        return { success: true, userDeleted: null };
    } catch (error:any) {
      console.error('Error ImagenEliminar:', error?.response ?? error);
      const payload = error?.response?.data ?? error?.message ?? 'unexpected error';
      const errorString = typeof payload === 'object' ? JSON.stringify(payload) : String(payload);
      return { success: false, error: errorString };
    }
}

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
    const lista = data?.data ?? data;
    const resultado = safeParse(ListaImagenesSchema, lista);
    if (resultado.success) {
      return resultado.output;
    } else {
      throw new Error('Error en la validacion de datos');
    }
  } catch (error) {
    console.error('Error al obtener lista de imagenes:', error);
    return [];
  }
}

export async function ImagenEliminarInsumos(cod_insumo : string | number) {
    try {
        
    const imagenUrl = `/imagenesIns/${cod_insumo}`;
        await axiosInstance.delete(imagenUrl);
        return { success: true, userDeleted: null };
    } catch (error:any) {
      console.error('Error ImagenEliminarInsumos:', error?.response ?? error);
      const payload = error?.response?.data ?? error?.message ?? 'unexpected error';
      const errorString = typeof payload === 'object' ? JSON.stringify(payload) : String(payload);
      return { success: false, error: errorString };
    }
}

// Create image record associated to an instrumento
export async function crearImagenInstrumento(payload: { cod_instrumento: string | number; imagentr?: string; imagenDataUrl?: string }) {
  // prefer explicit imagentr, else try to extract from imagenDataUrl
  let imagentr = '';
  if (payload.imagentr && String(payload.imagentr).trim().length > 0) {
    imagentr = String(payload.imagentr);
  } else if (payload.imagenDataUrl && String(payload.imagenDataUrl).includes(',')) {
    imagentr = String(payload.imagenDataUrl).split(',')[1] ?? '';
  }

  const body: Record<string, any> = {
    Id_img: 0,
    cod_instrumento: payload.cod_instrumento,
    imagentr: imagentr,
  };
  if (payload.imagenDataUrl) body.imagenDataUrl = payload.imagenDataUrl;

  try {
    console.debug('crearImagenInstrumento - body a enviar:', { Id_img: body.Id_img, cod_instrumento: body.cod_instrumento, has_imagentr: Boolean(body.imagentr) });
    const { data } = await axiosInstance.post('/imagenesTru', body, { headers: { 'Content-Type': 'application/json' } });
    return { success: true, data };
  } catch (err: any) {
    console.error('Error crearImagenInstrumento:', err);
    const resp = err?.response;
    if (resp) console.error('Response data:', resp.data, 'status:', resp.status);

    // fallback: if server complains about missing imagentr/base64, try multipart/form-data
    try {
      const errMsg = resp?.data?.error ?? '';
      if (String(errMsg).toLowerCase().includes('imagen') || String(errMsg).toLowerCase().includes('base64')) {
        const b64 = imagentr && imagentr.length > 0 ? imagentr : (String(body.imagenDataUrl ?? body.imagen ?? '').includes(',') ? String(body.imagenDataUrl ?? body.imagen ?? '').split(',')[1] : '');
        if (b64 && b64.length > 0) {
          const byteChars = atob(b64);
          const byteNumbers = new Array(byteChars.length);
          for (let i = 0; i < byteChars.length; i++) {
            byteNumbers[i] = byteChars.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'image/jpeg' });
          const form = new FormData();
          form.append('cod_instrumento', String(payload.cod_instrumento ?? ''));
          form.append('Id_img', String(0));
          form.append('imagentr', blob, 'imagen.jpg');
          console.debug('crearImagenInstrumento - reintentando con FormData');
          const { data: data2 } = await axiosInstance.post('/imagenesTru', form);
          return { success: true, data: data2 };
        }
      }
    } catch (retryErr) {
      console.error('Retry with FormData failed:', retryErr);
    }

    return { success: false, error: resp?.data ?? err.message ?? 'unexpected error' };
  }
}

// Obtener imagen registrada en imagenesTru por cod_instrumento
export async function getImagenInstrumentoTrPorCod(cod: string | number) {
  try {
    const safe = encodeURIComponent(String(cod));
    const res = await axiosInstance.get(`/imagenesTru/${safe}`);
    const payload = res.data?.data ?? res.data ?? null;
    return payload;
  } catch (err: any) {
    console.error('Error getImagenInstrumentoTrPorCod:', err);
    return null;
  }
}

// Eliminar imagen asociada a un instrumento por su codigo
export async function eliminarImagenInstrumentoPorCod(cod: string | number) {
  try {
    const safe = encodeURIComponent(String(cod));
    const res = await axiosInstance.delete(`/imagenesTru/${safe}`);
    return { success: true, data: res.data };
  } catch (err: any) {
    console.error('Error eliminarImagenInstrumentoPorCod:', err);
    const resp = err?.response;
    return { success: false, error: resp?.data ?? err.message ?? 'unexpected error' };
  }
}