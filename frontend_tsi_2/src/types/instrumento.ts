export type Instrumento = {
  cod_instrumento: string;
  nombre_instrumento?: string | null;
  modelo_instrumento?: string | null;
  tamano?: string | null;
  observacion?: string | null;
  // Optional related insumos (frontend can populate this when available)
  insumos?: Array<{
    cod_insumo: string;
    nombre_insumo?: string | null;
  }>;
};

export type ListaInstrumento = Instrumento;
