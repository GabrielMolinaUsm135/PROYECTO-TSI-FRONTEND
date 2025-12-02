import { useLoaderData, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { ListaInstrumento } from '../../types/instrumento';
import { getInstrumento, asociarInsumoAInstrumento, getInsumosPorInstrumento, desasociarInsumoDeInstrumento } from '../../services/InstrumentoService';
import { getListaInsumos } from '../../services/InsumoService';
import type { ListaInsumo } from '../../types/insumo';

export async function loader({ params }: any) {
    const cod = params?.cod;
    if (!cod) return null;
    const instrumento = await getInstrumento(cod);
    return instrumento;
}

export default function DetalleInstrumento() {
    const instrumento = useLoaderData() as ListaInstrumento | null;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [availableInsumos, setAvailableInsumos] = useState<ListaInsumo[]>([]);
    const [selectedInsumo, setSelectedInsumo] = useState<string | null>(null);
    const [adding, setAdding] = useState(false);
    const [relatedInsumos, setRelatedInsumos] = useState<ListaInsumo[]>([]);

    useEffect(() => {
        async function load() {
            // fetch all insumos (to display names and for available picklist)
            const all = await getListaInsumos();
            const allArray = Array.isArray(all) ? (all as ListaInsumo[]) : [];

            // fetch relations for this instrumento from instrumento_insumo endpoint
            const rels = (await getInsumosPorInstrumento(instrumento?.cod_instrumento ?? '')) as Array<any>;
            // rels expected like [{ cod_instrumento, cod_insumo }, ...]
            const relatedCodes = new Set(rels.map((r: any) => String(r.cod_insumo)));

            // build related insumos with names by matching all list
            const insumoByCode = new Map(allArray.map(i => [i.cod_insumo, i] as [string, ListaInsumo]));
            const relatedList = Array.from(relatedCodes).map(code => insumoByCode.get(String(code)) ?? ({ cod_insumo: String(code), nombre_insumo: String(code) } as ListaInsumo));

            // available = all - related
            const avail = allArray.filter(i => !relatedCodes.has(i.cod_insumo));

            setAvailableInsumos(avail);
            if (avail.length > 0) setSelectedInsumo(avail[0].cod_insumo);

            // set instrumento insumos into a local state by overriding if needed
            setRelatedInsumos(relatedList);
        }
        load();
    }, [instrumento]);

    const handleAddInsumo = async () => {
        if (!selectedInsumo) {
            alert('Seleccione un insumo para agregar.');
            return;
        }
        setAdding(true);
        const res = await asociarInsumoAInstrumento(instrumento!.cod_instrumento, selectedInsumo);
        setAdding(false);
        if (!res.success) {
            alert('Error al asociar insumo: ' + (typeof res.error === 'string' ? res.error : JSON.stringify(res.error)));
            return;
        }
        // update UI locally: move selected insumo from available -> related
        const insObj = availableInsumos.find(i => i.cod_insumo === selectedInsumo);
        if (insObj) {
            setRelatedInsumos(prev => [...prev, insObj]);
            setAvailableInsumos(prev => prev.filter(i => i.cod_insumo !== selectedInsumo));
        }
        setIsModalOpen(false);
    };

    if (!instrumento) {
        return (
            <div className="container py-5">
                <div className="alert alert-warning">Instrumento no encontrado.</div>
                <div className="mt-3"><Link to="/Instrumentos/ListaInstrumentos" className="btn btn-secondary">Volver a lista</Link></div>
            </div>
        );
    }

    return (
        <div className="container py-4">        

            <div className="card shadow-sm">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <div>
                        <h4 className="mb-0">{instrumento.cod_instrumento ?? 'Instrumento'}</h4>                        
                    </div>
                    <div>
                        <Link to="/Instrumentos/ListaInstrumentos" className="btn btn-outline-secondary btn-sm me-2">Volver</Link>
                    </div>
                </div>

                <div className="card-body">
                    <div className="row">
                        <div className="col-md-7">
                            <h6 className="text-uppercase text-muted">Detalles</h6>
                            <dl className="row">
                                <dt className="col-sm-4">Código</dt>
                                <dd className="col-sm-8">{instrumento.cod_instrumento}</dd>

                                <dt className="col-sm-4">Nombre</dt>
                                <dd className="col-sm-8">{instrumento.nombre_instrumento ?? '—'}</dd>

                                <dt className="col-sm-4">Modelo</dt>
                                <dd className="col-sm-8">{instrumento.modelo_instrumento ?? '—'}</dd>

                                <dt className="col-sm-4">Tamaño</dt>
                                <dd className="col-sm-8">{instrumento.tamano ?? '—'}</dd>
                            </dl>

                            <h6 className="text-uppercase text-muted mt-4">Observación</h6>
                            <div className="p-3 border rounded bg-light">
                                <pre className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{instrumento.observacion ?? '-'}</pre>
                            </div>
                        </div>

                        <div className="col-md-5">
                            <div className="text-center mb-3">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/2/27/Instrument_Placeholder.png"
                                    alt={instrumento.nombre_instrumento ?? 'Instrumento'}
                                    className="img-fluid rounded"
                                    style={{ maxHeight: 300, objectFit: 'contain' }}
                                />
                            </div>

                            <div className="card mt-3">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h6 className="card-title mb-0">Insumos relacionados</h6>
                                        <button className="btn btn-sm btn-outline-primary" onClick={() => setIsModalOpen(true)}>Agregar insumo</button>
                                    </div>
                                    {relatedInsumos && relatedInsumos.length > 0 ? (
                                        <ul className="list-group list-group-flush">
                                            {relatedInsumos.map((ins) => (
                                                        <li key={ins.cod_insumo} className="list-group-item d-flex justify-content-between align-items-center">
                                                            <div>
                                                                <Link to={`/Insumos/Detalle/${ins.cod_insumo}`} className="me-2">{ins.nombre_insumo ?? ins.cod_insumo}</Link>
                                                                <small className="text-muted"> <span className="badge bg-secondary">{ins.cod_insumo}</span></small>
                                                            </div>
                                                            <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={async () => {
                                                                if (!confirm(`Eliminar relación con ${ins.nombre_insumo ?? ins.cod_insumo}?`)) return;
                                                                const res = await desasociarInsumoDeInstrumento(instrumento.cod_instrumento, ins.cod_insumo);
                                                                if (!res.success) {
                                                                    alert('Error al eliminar relación: ' + (typeof res.error === 'string' ? res.error : JSON.stringify(res.error)));
                                                                    return;
                                                                }
                                                                // update lists locally
                                                                setRelatedInsumos(prev => prev.filter(r => r.cod_insumo !== ins.cod_insumo));
                                                                setAvailableInsumos(prev => [{ cod_insumo: ins.cod_insumo, nombre_insumo: ins.nombre_insumo ?? ins.cod_insumo, observacion: (ins as any).observacion ?? '' }, ...prev]);
                                                            }}
                                                        >Eliminar</button>
                                                    </li>
                                                ))}
                                        </ul>
                                        ) : (
                                    <div className="text-muted">No hay insumos relacionados.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <div className="modal fade show d-block" tabIndex={-1} role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Agregar insumo a {instrumento.nombre_instrumento ?? instrumento.cod_instrumento}</h5>
                                <button type="button" className="close" onClick={() => setIsModalOpen(false)} aria-label="Close"><span aria-hidden="true">×</span></button>
                            </div>
                            <div className="modal-body">
                                {availableInsumos.length === 0 ? (
                                    <div className="text-muted">No hay insumos disponibles para agregar.</div>
                                ) : (
                                    <div className="mb-3">
                                        <label className="form-label">Seleccione insumo</label>
                                        <select className="form-select" value={selectedInsumo ?? ''} onChange={(e) => setSelectedInsumo(e.target.value)}>
                                            {availableInsumos.map(i => (
                                                    <option key={i.cod_insumo} value={i.cod_insumo}>{`${i.nombre_insumo ?? i.cod_insumo} — ${i.cod_insumo}`}</option>
                                                ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cerrar</button>
                                <button type="button" className="btn btn-primary" onClick={handleAddInsumo} disabled={adding || availableInsumos.length === 0}>{adding ? 'Agregando...' : 'Agregar'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Modal markup and handlers are appended below so lint tools see used variables

