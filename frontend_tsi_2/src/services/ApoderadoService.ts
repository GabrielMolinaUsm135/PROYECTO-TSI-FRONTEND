import axiosInstance from './axiosinstance';
import type { Apoderado } from '../types/apoderado';

export async function getListaApoderados() {
    try {
        const res = await axiosInstance.get('/apoderados');
        return res.data?.data ?? res.data ?? [];
    } catch (error) {
        console.error('getListaApoderados error', error);
        return [];
    }
}

export async function getApoderado(id: number | string) {
    try {
        const res = await axiosInstance.get(`/apoderados/${id}`);
        return { success: true, data: res.data?.data ?? res.data };
    } catch (error) {
        console.error('getApoderado error', error);
        return { success: false, error };
    }
}

export async function crearApoderado(payload: Partial<Apoderado>) {
    try {
        // Ensure payload uses API field names
        const body = {
            rut: payload.rut,
            nombre: payload.nombre,
            correo: payload.correo,
            telefono: payload.telefono,
        };
        const res = await axiosInstance.post('/apoderados', body);
        return { success: true, data: res.data?.data ?? res.data };
    } catch (error) {
        console.error('crearApoderado error', error);
        return { success: false, error };
    }
}

export async function actualizarApoderado(id: number | string, payload: Partial<Apoderado>) {
    try {
        const body = {
            rut: payload.rut,
            nombre: payload.nombre,
            correo: payload.correo,
            telefono: payload.telefono,
        };
        const res = await axiosInstance.put(`/apoderados/${id}`, body);
        return { success: true, data: res.data?.data ?? res.data };
    } catch (error) {
        console.error('actualizarApoderado error', error);
        return { success: false, error };
    }
}

export async function eliminarApoderado(id: number | string) {
    try {
        const res = await axiosInstance.delete(`/apoderados/${id}`);
        return { success: true, data: res.data?.data ?? res.data };
    } catch (error) {
        console.error('eliminarApoderado error', error);
        return { success: false, error };
    }
}
