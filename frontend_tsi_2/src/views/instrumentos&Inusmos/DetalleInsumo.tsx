import { useLoaderData, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getInsumo } from '../../services/InsumoService';
import { getInstrumentosPorInsumo, getListaInstrumentos } from '../../services/InstrumentoService';
import type { ListaInsumo } from '../../types/insumo';
import type { ListaInstrumento } from '../../types/instrumento';

export async function loader({ params }: any) {
    const cod = params?.cod;
    if (!cod) return null;
    const insumo = await getInsumo(cod);
    return insumo;
}

export default function DetalleInsumo(){
    const insumo = useLoaderData() as ListaInsumo | null;
    const [relatedInstruments, setRelatedInstruments] = useState<ListaInstrumento[]>([]);

    useEffect(() => {
        async function loadRelated() {
            if (!insumo) return;
            // fetch relation rows
            const rels = await getInstrumentosPorInsumo(insumo.cod_insumo);
            const codes = Array.isArray(rels) ? rels.map((r:any) => String(r.cod_instrumento)) : [];

            // fetch all instruments to match names (efficient enough for small lists)
            const all = await getListaInstrumentos();
            const map = new Map((Array.isArray(all) ? all : []).map((it: any) => [it.cod_instrumento, it]));

            const related = codes.map(code => map.get(code) ?? ({ cod_instrumento: code, nombre_instrumento: code }));
            setRelatedInstruments(related);
        }
        loadRelated();
    }, [insumo]);
    if (!insumo) {
        return (
            <div className="container py-5">
                <div className="alert alert-warning">Insumo no encontrado.</div>
                <div className="mt-3"><Link to="/ListaInsumos" className="btn btn-secondary">Volver a lista</Link></div>
            </div>
        );
    }

    return (
        <div className="container py-4">            

            <div className="card shadow-sm">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <div>
                        <h4 className="mb-0">{insumo.cod_insumo ?? 'Insumo'}</h4>                        
                    </div>
                    <div>
                        <Link to="/ListaInsumos" className="btn btn-outline-secondary btn-sm">Volver</Link>
                    </div>
                </div>

                <div className="card-body">
                    <div className="row">
                        <div className="col-md-7">
                            <h6 className="text-uppercase text-muted">Detalles</h6>
                            <dl className="row">
                                <dt className="col-sm-4">Código</dt>
                                <dd className="col-sm-8">{insumo.cod_insumo}</dd>

                                <dt className="col-sm-4">Nombre</dt>
                                <dd className="col-sm-8">{insumo.nombre_insumo ?? '—'}</dd>
                            </dl>

                            <h6 className="text-uppercase text-muted mt-4">Observación</h6>
                            <div className="p-3 border rounded bg-light">
                                <pre className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{insumo.observacion ?? '-'}</pre>
                            </div>
                        </div>

                        <div className="col-md-5">
                            <div className="text-center mb-3">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/2/27/Instrument_Placeholder.png"
                                    alt={insumo.nombre_insumo ?? 'Insumo'} className="img-fluid rounded" style={{ maxHeight: 300, objectFit: 'contain' }} />
                            </div>

                            <div className="card mt-3">
                                <div className="card-body">
                                        <h6 className="card-title">Instrumento relacionados</h6>
                                        {relatedInstruments.length > 0 ? (
                                            <ul className="list-group list-group-flush mt-3">
                                                {relatedInstruments.map((inst:any) => (
                                                    <li key={inst.cod_instrumento} className="list-group-item d-flex justify-content-between align-items-center">
                                                        <Link to={`/Instrumentos/Detalle/${inst.cod_instrumento}`}>{inst.nombre_instrumento ?? inst.cod_instrumento}</Link>
                                                        <small className="text-muted"><span className="badge bg-secondary">{inst.cod_instrumento}</span></small>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : null}
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}