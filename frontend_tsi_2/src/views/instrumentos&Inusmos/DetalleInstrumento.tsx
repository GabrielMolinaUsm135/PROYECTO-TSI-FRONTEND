import { useLoaderData, Link } from 'react-router-dom';
import type { ListaInstrumento } from '../../types/instrumento';
import { getInstrumento } from '../../services/InstrumentoService';

export async function loader({ params }: any) {
    const cod = params?.cod;
    if (!cod) return null;
    const instrumento = await getInstrumento(cod);
    return instrumento;
}

export default function DetalleInstrumento() {
    const instrumento = useLoaderData() as ListaInstrumento | null;

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
                                    <h6 className="card-title">Insumos relacionados</h6>
                                    {instrumento.insumos && instrumento.insumos.length > 0 ? (
                                        <ul className="list-group list-group-flush">
                                            {instrumento.insumos.map((ins) => (
                                                <li key={ins.cod_insumo} className="list-group-item">
                                                    <Link to={`/Insumos/Detalle/${ins.cod_insumo}`}>{ins.nombre_insumo ?? ins.cod_insumo}</Link>
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
        </div>
    );
}