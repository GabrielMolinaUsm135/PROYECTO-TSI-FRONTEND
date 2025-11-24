import {number, object, string } from "valibot";

export const ProfesorFormSchema = object({
    id_profesor: number(),
    id_usuario: number(),
    nombre: string(),
    apellido_paterno: string(),
    apellido_materno: string(),
    telefono: string(),
    direccion: string(),
    asignatura: string(),
});