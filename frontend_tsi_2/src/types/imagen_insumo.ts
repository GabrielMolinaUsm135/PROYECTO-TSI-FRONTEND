import {array, number, object, blob, type InferOutput } from "valibot";

export const listaimagenSchema = object({
   id_imagen: number(),
   imagenIns: blob(),
});

export const ImagenFormSchema = object({
   cod_insumo: number(),
   id_imagen: number(),
   imagenIns: blob()
});


export const ListaImagenesSchema = array(listaimagenSchema);
export type ListaImagen = InferOutput<typeof listaimagenSchema>;