import axiosInstance from './axiosinstance';
import { safeParse } from "valibot";
import { AlumnoFormSchema, ListaAlumnosSchema } from "../types/alumno";

export async function getListaAlumnos() {
    try {
    const url = '/lista/alumnos';
    const { data } = await axiosInstance.get(url);
    // backend may return { data: [...] } or directly an array — handle both
    const lista = data?.data ?? data;
    const resultado = safeParse(ListaAlumnosSchema, lista);
        if (resultado.success) {
            return resultado.output;
        } else {
            throw new Error('Error en la validacion de datos');
        }
    } catch (error) {
        console.error('Error al obtener lista de alumnos:', error);
        return []; // Devolver array vacío en caso de error
    }
}

type AlumnoFormData = {
    [k: string]: FormDataEntryValue;
};

export async function alumnoCrear(formData: AlumnoFormData) {
    try {
        const resultado = safeParse(AlumnoFormSchema, formData);
        if (resultado.success) {
            const url = '/alumno';
            await axiosInstance.post(url, {
                rut_alumno: resultado.output.rut_alumno,
                rut_apoderado: resultado.output.rut_apoderado,
                nombre_alumno: resultado.output.nombre_alumno,
                apellido_paterno: resultado.output.apellido_paterno,
                apellido_materno: resultado.output.apellido_materno,
                telefono_alumno: resultado.output.telefono_alumno,
                correo_alumno: resultado.output.correo,
                direccion_alumno: resultado.output.direccion_alumno,
                diagnostico_ne: resultado.output.diagnostico_ne,
                anio_ingreso_orquesta: resultado.output.anio_ingreso_orquesta,
            });
            return { success: true };
        } else {
            throw new Error('Error en la validacion de datos');
        }
    } catch (error) {
        console.log(error);
    }
}

export async function alumnoEliminar(id_alumno: string | number, id_usuario?: string | number) {
    try {
        // delete alumno by its primary id
        const alumnoUrl = `/alumno/${id_alumno}`;
        await axiosInstance.delete(alumnoUrl);

        // if an associated usuario id is provided, delete that user as well
        if (id_usuario !== undefined && id_usuario !== null) {
            const userUrl = `/user/${id_usuario}`;
            try {
                await axiosInstance.delete(userUrl);
            } catch (userErr:any) {
                // Log and continue — return partial failure info
                console.error('Failed to delete associated user:', userErr);
                return { success: false, error: 'alumno_deleted_but_user_delete_failed', details: userErr.response?.data ?? String(userErr) };
            }
        }

        return { success: true };
    } catch (error:any) {
        console.log(error);
        return { success: false, error: error.response?.data?.error ?? error.message ?? 'unexpected error' };
    }
}

/**
 * Create an alumno using a backend-shaped payload.
 * Expected payload example (from user):
 * {
 *  id_apoderado: null,
 *  id_grupo_teoria: 1,
 *  fecha_ingreso: "2025-11-24",
 *  nombre: "Juan",
 *  apellido_paterno: "Perez",
 *  apellido_materno: "Gonzalez",
 *  telefono: "999999999",
 *  direccion: "Calle Falsa 123",
 *  diagnostico_ne: "ninguno",
 *  correo: "juan@example.com",
 *  password: "Secret123!",
 *  id_rol: 3
 * }
 */
export async function crearAlumno(payload: Record<string, any>) {
    try {
        if (!payload || !payload.correo || !payload.password) {
            return { success: false, error: 'missing_fields' };
        }
        const url = '/alumno';
        const { data } = await axiosInstance.post(url, payload, { headers: { 'Content-Type': 'application/json' } });
        return { success: true, data };
    } catch (error:any) {
        console.error('Error creating alumno:', error);
        return { success: false, error: error.response?.data?.error ?? error.message ?? 'unexpected error' };
    }
}

export async function existeRut(rut: string) {
    try {
        if (!rut) return { exists: false };
        const url = `/alumno/${encodeURIComponent(rut)}`;
        const { data } = await axiosInstance.get(url);
        // if API returns alumno data, consider it exists
        if (data) return { exists: true, data };
        return { exists: false };
    } catch (error: any) {
        // if 404 then not found, otherwise log and rethrow or return exists=false
        if (error.response && error.response.status === 404) return { exists: false };
        console.error('Error checking rut existence:', error);
        return { exists: false, error: error.response?.data ?? String(error) };
    }
}