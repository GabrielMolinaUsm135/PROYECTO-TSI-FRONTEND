import {array, number, object, blob, type InferOutput } from "valibot";

export const listaimagenSchema = object({
   id_imagen: number(),
   imagenB: blob(),
});

export const ImagenFormSchema = object({
   id_usuario: number(),
   id_imagen: number(),
   imagenB: blob()
});


export const ListaImagenesSchema = array(listaimagenSchema);
export type ListaImagen = InferOutput<typeof listaimagenSchema>;