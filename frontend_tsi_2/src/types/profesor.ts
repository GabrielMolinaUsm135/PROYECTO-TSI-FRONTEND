import {array, number, object, string, type InferOutput } from "valibot";

export const ProfesorFormSchema = object({
    rut: string(),
    id_profesor: number(),
    id_usuario: number(),
    nombre: string(),
    apellido_paterno: string(),
    apellido_materno: string(),
    telefono: string(),
    direccion: string(),
    asignatura: string(),
    correo: string(),
});

export const listaProfesorSchema = object({
    rut: string(),
    nombre: string(),
    apellido_paterno: string(),
    apellido_materno: string(),
    asignatura: string(),
});

export const ListaProfesoresSchema = array(listaProfesorSchema);
export type ListaProfesor = InferOutput<typeof listaProfesorSchema>;

