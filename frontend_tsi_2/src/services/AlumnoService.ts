import axiosInstance from './axiosinstance';
import { safeParse } from "valibot";
import { AlumnoFormSchema, ListaAlumnosSchema } from "../types/alumno";

export async function getListaAlumnos() {
    try {
    const url = '/lista/alumnos';
    const { data: alumnos } = await axiosInstance.get(url);
        const resultado = safeParse(ListaAlumnosSchema, alumnos.data);
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
                correo_alumno: resultado.output.correo_alumno,
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

export async function alumnoEliminar(rut: string) {
    try {
    const url = `/alumno/${rut}`;
    await axiosInstance.delete(url);
        return { success: true };
    } catch (error) {
        console.log(error);
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