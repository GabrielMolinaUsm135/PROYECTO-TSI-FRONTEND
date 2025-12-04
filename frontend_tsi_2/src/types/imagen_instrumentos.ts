import {array, number, object, blob, type InferOutput } from "valibot";

export const listaimagenTrSchema = object({
   id_img: number(),
   imagenTr: blob(),
});

export const ImagenTrFormSchema = object({
   cod_instrumento: number(),
   id_img: number(),
   imagentr: blob()
});


export const ListaImagenesTrSchema = array(listaimagenTrSchema);
export type ListaImagenTr = InferOutput<typeof listaimagenTrSchema>;