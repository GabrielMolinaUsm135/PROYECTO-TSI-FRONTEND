import { array, object, string, type InferOutput } from "valibot";

export type Instrumento = {
  cod_instrumento: string;
  nombre_instrumento?: string | null;
  modelo_instrumento?: string | null;
  tamano?: string | null;
  observacion?: string | null;
  insumos?: Array<{
    cod_insumo: string;
    nombre_insumo?: string | null;
  }>;
};

export const listainstrumentosSchema = object({
    cod_instrumento: string(),
    nombre_instrumento: string(),
    modelo_instrumento: string(),
    observacion: string(),
});


export const ListaInstrumentosSchema = array(listainstrumentosSchema);
export type ListaInstrumento = InferOutput<typeof listainstrumentosSchema>;



