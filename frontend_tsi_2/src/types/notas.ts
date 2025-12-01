import {array, date, number, object, string, type InferOutput } from "valibot";

export const NotasFormSchema = object({
    id_nota: number(),
    id_alumno: number(),
    fecha_evaluacion: date(),
    nombre_evaluacion: string(),
    nota: number(),
});

export const listaNotasSchema = object({
    fecha_evaluacion: date(),
    nombre_evaluacion: string(),
    nota: number(),
});

export const ListaNotasSchema = array(listaNotasSchema);
export type ListaNota = InferOutput<typeof listaNotasSchema>;