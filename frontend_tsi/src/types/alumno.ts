import { array, object, string, type InferOutput } from "valibot";

export const ListaAlumnoSchema = object({
    rut_alumno:string(),
    nombre_alumno:string(),
    apellido_paterno:string(),
    apellido_materno:string()
})

export const ListaAlumnosSchema = array(ListaAlumnoSchema)

//types
export type ListaAlumnoSchema = InferOutput<typeof ListaAlumnoSchema>