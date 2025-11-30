export type Insumo = {
  cod_insumo: string;
  nombre_insumo?: string | null;
  observacion?: string | null;
  instrumentos?: Array<{ cod_instrumento: string; nombre_instrumento?: string | null }>;
};

export type ListaInsumo = Insumo;
