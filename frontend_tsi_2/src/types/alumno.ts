import { array, object, string, type InferOutput } from "valibot";

export const ListaAlumnoSchema = object({
    rut_alumno:string(),
    nombre_alumno:string(),
    apellido_paterno:string(),
    apellido_materno:string()
})

export const AlumnoFormSchema = object({
    rut_alumno:string(),
    rut_apoderado:string(),
    nombre_alumno:string(),
    apellido_paterno:string(),
    apellido_materno:string(),
    telefono_alumno:string(),
    correo_alumno:string(),
    direccion_alumno:string(),
    diagnostico_ne:string(),
    anio_ingreso_orquesta:string()
})

export const ListaAlumnosSchema = array(ListaAlumnoSchema)

//types
export type ListaAlumno = InferOutput<typeof ListaAlumnoSchema>