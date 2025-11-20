import { array, object, string, type InferOutput } from "valibot";

export const ListaAlumnoSchema = object({
    rut_alumno: string(),
    nombre_alumno: string(),
    apellido_paterno: string(),
    apellido_materno: string()
})

export const AlumnoFormSchema = object({
    rut_alumno: string(),
    rut_apoderado: string(),
    nombre_alumno: string(),
    apellido_paterno: string(),
    apellido_materno: string(),
    telefono_alumno: string(),
    correo_alumno: string(),
    direccion_alumno: string(),
    diagnostico_ne: string(),
    anio_ingreso_orquesta: string()
})

export const ListaAlumnosSchema = array(ListaAlumnoSchema)

// derived types from schemas
export type ListaAlumno = InferOutput<typeof ListaAlumnoSchema>

// Explicit Alumno type matching DB structure
export interface Alumno {
    id_alumno?: number;
    id_apoderado?: number | null;
    id_usuario?: number | null;
    nombre?: string | null;
    apellido_paterno?: string | null;
    apellido_materno?: string | null;
    telefono?: string | null;
    direccion?: string | null;
    diagnostico_ne?: string | null;
    id_grupo_teoria?: number | null;
    fecha_ingreso?: string | null; // ISO date string
}