import {array, number, object, string, type InferOutput } from "valibot";

export const listaClaseSchema = object({
   id_profesor: number(),
   id_usuario: number(),
   nombre_asignatura: string(),
});
export const ListaClasesSchema = array(listaClaseSchema);
export type ListaClase = InferOutput<typeof listaClaseSchema>;