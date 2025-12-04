import { useLoaderData, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import type { ListaInstrumento } from '../../types/instrumento';
import { getInstrumento, asociarInsumoAInstrumento, getInsumosPorInstrumento, desasociarInsumoDeInstrumento } from '../../services/InstrumentoService';
import { getListaInsumos } from '../../services/InsumoService';
import type { ListaInsumo } from '../../types/insumo';
import axiosInstance from '../../services/axiosinstance';
import { crearImagenInstrumento, getImagenInstrumentoTrPorCod, eliminarImagenInstrumentoPorCod } from '../../services/ImagenService';
import { resizeImageFileToDataUrl, fileToDataUrl } from '../../utils/image';

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
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const prevObjectUrlRef = useRef<string | null>(null);
    const [previewSrc, setPreviewSrc] = useState<string>('https://upload.wikimedia.org/wikipedia/commons/2/27/Instrument_Placeholder.png');
    const [uploadingImage, setUploadingImage] = useState(false);
    const [hasImageLinked, setHasImageLinked] = useState<boolean>(false);

    useEffect(() => {
        async function load() {
            // fetch all insumos (to display names and for available picklist)
            const all = await getListaInsumos();
            const allArray = Array.isArray(all) ? (all as ListaInsumo[]) : [];

            // fetch relations for this instrumento from instrumento_insumo endpoint
            const rels = (await getInsumosPorInstrumento(instrumento?.cod_instrumento ?? '')) as Array<any>;
            // rels expected like [{ cod_instrumento, cod_insumo }, ...]
            const relatedCodes = new Set(rels.map((r: any) => String(r.cod_insumo)));

            // fetch all instrumento_insumo relations to know which insumos are already linked to any instrument
            let allRels: Array<any> = [];
            try {
                const resp = await axiosInstance.get('/instrumento_insumo');
                allRels = resp.data?.data ?? resp.data ?? [];
            } catch (e) {
                // if endpoint not available, fall back to assuming only local relations
                allRels = [];
            }
            const globallyAssociated = new Set(allRels.map((r: any) => String(r.cod_insumo)));

            // build related insumos with names by matching all list
            const insumoByCode = new Map(allArray.map(i => [i.cod_insumo, i] as [string, ListaInsumo]));
            const relatedList = Array.from(relatedCodes).map(code => insumoByCode.get(String(code)) ?? ({ cod_insumo: String(code), nombre_insumo: String(code) } as ListaInsumo));

            // available = all - (globally associated except those associated to THIS instrument)
            const avail = allArray.filter(i => {
                const code = String(i.cod_insumo);
                // allow insumos that are related to THIS instrument (they appear in relatedCodes)
                if (relatedCodes.has(code)) return false; // already related, don't show in available
                // if globally associated to another instrument, exclude
                if (globallyAssociated.has(code)) return false;
                return true;
            });

            setAvailableInsumos(avail);
            if (avail.length > 0) setSelectedInsumo(avail[0].cod_insumo);

            // set instrumento insumos into a local state by overriding if needed
            setRelatedInsumos(relatedList);
        }
        load();
    }, [instrumento]);

    // load existing image from imagenesTru for this instrumento (if any)
    useEffect(() => {
        let mounted = true;
        async function loadImagenTr() {
            const cod = instrumento?.cod_instrumento ?? null;
            if (!cod) return;
            try {
                const payload = await getImagenInstrumentoTrPorCod(cod);
                if (!mounted || !payload) return;

                const pickFirst = (p: any) => Array.isArray(p) && p.length > 0 ? p[0] : p;
                let item = pickFirst(payload);
                if (item && item.data) item = pickFirst(item.data);

                const mime = item?.mimeType ?? item?.mime ?? 'image/jpeg';
                const b64 = item?.imagenBase64 ?? item?.imagentr ?? item?.imagenInst ?? item?.imageBase64 ?? item?.imagen ?? item?.imagenB ?? null;
                if (typeof b64 === 'string' && b64.length > 0) {
                    setPreviewSrc(`data:${mime};base64,${b64}`);
                    setHasImageLinked(true);
                    return;
                }

                const url = item?.url ?? item?.imagen_url ?? null;
                if (typeof url === 'string' && url.length > 0) {
                    setPreviewSrc(url);
                    setHasImageLinked(true);
                    return;
                }
            } catch (err) {
                // ignore
            }
        }
        loadImagenTr();
        return () => { mounted = false; };
    }, [instrumento?.cod_instrumento]);

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
                                        src={previewSrc}
                                        alt={instrumento.nombre_instrumento ?? 'Instrumento'}
                                        className="img-fluid rounded"
                                        style={{ maxHeight: 300, objectFit: 'contain' }}
                                    />
                                    <div className="mt-2 d-flex justify-content-center gap-2">
                                        <button type="button" className="btn btn-primary btn-sm" onClick={() => fileInputRef.current?.click()} disabled={uploadingImage || hasImageLinked} aria-label="Añadir imagen">{uploadingImage ? 'Cargando...' : 'Añadir imagen'}</button>
                                        <button type="button" className="btn btn-outline-danger btn-sm" disabled={!hasImageLinked} onClick={async () => {
                                            if (!instrumento?.cod_instrumento) return alert('Instrumento sin codigo');
                                            if (!confirm('¿Eliminar la imagen asociada a este instrumento?')) return;
                                            try {
                                                const res = await eliminarImagenInstrumentoPorCod(instrumento.cod_instrumento);
                                                if (res?.success) {
                                                    setPreviewSrc('https://upload.wikimedia.org/wikipedia/commons/2/27/Instrument_Placeholder.png');
                                                    setHasImageLinked(false);
                                                    alert('Imagen eliminada.');
                                                } else {
                                                    console.error('Error eliminando imagen:', res?.error ?? res);
                                                    alert('Error eliminando imagen. Revisa la consola.');
                                                }
                                            } catch (err) {
                                                console.error('Error eliminando imagen', err);
                                                alert('Error eliminando imagen. Revisa la consola.');
                                            }
                                        }} aria-label="Eliminar imagen">Eliminar imagen</button>
                                    </div>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            if (prevObjectUrlRef.current) {
                                                try { URL.revokeObjectURL(prevObjectUrlRef.current); } catch (err) { /* ignore */ }
                                                prevObjectUrlRef.current = null;
                                            }
                                            const objUrl = URL.createObjectURL(file);
                                            prevObjectUrlRef.current = objUrl;
                                            setPreviewSrc(objUrl);

                                            try {
                                                setUploadingImage(true);
                                                    // Resize image to reasonable width before uploading
                                                    let dataUrl: string;
                                                    try {
                                                        dataUrl = await resizeImageFileToDataUrl(file, 1200, 0.8);
                                                    } catch (err) {
                                                        // fallback to raw data url if resize fails
                                                        dataUrl = await fileToDataUrl(file);
                                                    }
                                                    const base64 = dataUrl.split(',')[1] ?? dataUrl;
                                                    const payload: Record<string, any> = { imagentr: base64, imagenDataUrl: dataUrl };
                                                if (instrumento?.cod_instrumento) payload.cod_instrumento = instrumento.cod_instrumento;

                                                const res = await crearImagenInstrumento(payload as any);
                                                console.log('Upload response', res);
                                                if (res?.success) {
                                                    const returned = res.data?.data ?? res.data ?? res;
                                                    const url = returned?.url ?? returned?.data?.url ?? returned?.imagen_url ?? null;
                                                    if (url) setPreviewSrc(url);
                                                    alert('Imagen subida correctamente.');
                                                    setHasImageLinked(true);
                                                } else {
                                                    console.error('Error subiendo imagen:', res?.error ?? res);
                                                    alert('Error subiendo imagen. Revisa la consola.');
                                                }
                                            } catch (err) {
                                                console.error('Error subiendo imagen', err);
                                                alert('Error subiendo imagen. Revisa la consola.');
                                            } finally {
                                                setUploadingImage(false);
                                            }
                                        }}
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

