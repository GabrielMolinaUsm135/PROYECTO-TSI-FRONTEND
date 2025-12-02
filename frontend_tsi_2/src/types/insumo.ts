import { array, object, string, type InferOutput } from "valibot";

export type Insumo = {
  cod_insumo: string;
  nombre_insumo?: string | null;
  observacion?: string | null;
  instrumentos?: Array<{ cod_instrumento: string; nombre_instrumento?: string | null }>;
};

export const listaInsumosSchema = object({
  cod_insumo: string(),
  nombre_insumo: string(),
  observacion: string(),
});

export const ListaInsumosSchema = array(listaInsumosSchema);
export type ListaInsumo = InferOutput<typeof listaInsumosSchema>;