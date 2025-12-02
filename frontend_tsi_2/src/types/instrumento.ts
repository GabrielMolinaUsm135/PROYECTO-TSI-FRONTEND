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

// For list/detail views use the same Instrumento shape
export type ListaInstrumento = Instrumento;


