import { useLoaderData, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { getInsumo } from '../../services/InsumoService';
import { getInstrumentosPorInsumo, getListaInstrumentos } from '../../services/InstrumentoService';
import axiosInstance from '../../services/axiosinstance';
import type { ListaInsumo } from '../../types/insumo';
import type { ListaInstrumento } from '../../types/instrumento';
import { crearImagenInsumo, ImagenEliminarInsumos } from '../../services/ImagenService';

export async function loader({ params }: any) {
    const cod = params?.cod;
    if (!cod) return null;
    const insumo = await getInsumo(cod);
    return insumo;
}

export default function DetalleInsumo(){
    const insumo = useLoaderData() as ListaInsumo | null;
    const [relatedInstruments, setRelatedInstruments] = useState<ListaInstrumento[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const prevObjectUrlRef = useRef<string | null>(null);
    const [previewSrc, setPreviewSrc] = useState<string>('https://upload.wikimedia.org/wikipedia/commons/2/27/Instrument_Placeholder.png');
    const [uploadingImage, setUploadingImage] = useState(false);

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

    // cleanup object URL when unmounting
    useEffect(() => {
        return () => {
            if (prevObjectUrlRef.current) {
                try { URL.revokeObjectURL(prevObjectUrlRef.current); } catch (e) { /* ignore */ }
            }
        };
    }, []);

    // load existing image associated with this insumo (if any)
    useEffect(() => {
        let mounted = true;
        async function loadImagenInsumo() {
            const cod = insumo?.cod_insumo ?? null;
            if (!cod) return;
            try {
                const res = await axiosInstance.get(`/imagenesIns/${encodeURIComponent(String(cod))}`);
                let payload: any = res.data?.data ?? res.data ?? null;
                if (!mounted || !payload) return;

                // If the API returned an array or nested data, pick the first relevant node
                const pickFirst = (p: any) => Array.isArray(p) && p.length > 0 ? p[0] : p;
                payload = pickFirst(payload);
                if (payload && payload.data) payload = pickFirst(payload.data);

                // Try many possible keys that backends sometimes use for base64 / blob / url
                const mime = payload?.mimeType ?? payload?.mime ?? 'image/jpeg';

                const b64Candidates = [
                    payload?.imageBase64,
                    payload?.imagenIns,
                    payload?.imagenInsBase64,
                    payload?.imagenBase64,
                    payload?.base64,
                    payload?.imagenB,
                    payload?.imagen,
                    payload?.imagen64,
                    payload?.imagen_b64,
                ];
                const b64 = b64Candidates.find((v: any) => typeof v === 'string' && v.length > 0) ?? null;

                if (b64) {
                    if (prevObjectUrlRef.current) {
                        try { URL.revokeObjectURL(prevObjectUrlRef.current); } catch (e) { /* ignore */ }
                        prevObjectUrlRef.current = null;
                    }
                    setPreviewSrc(`data:${mime};base64,${b64}`);
                    return;
                }

                const urlCandidates = [
                    payload?.url,
                    payload?.imagen_url,
                    payload?.path,
                    payload?.ruta,
                    payload?.publicUrl,
                    payload?.fileUrl,
                ];
                const url = urlCandidates.find((v: any) => typeof v === 'string' && v.length > 0) ?? null;
                if (url) {
                    setPreviewSrc(url);
                    return;
                }
            } catch (err) {
                // ignore, no image for this insumo or fetch error
            }
        }
        loadImagenInsumo();
        return () => { mounted = false; };
    }, [insumo?.cod_insumo]);
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
                                <img src={previewSrc}
                                    alt={insumo.nombre_insumo ?? 'Insumo'} className="img-fluid rounded" style={{ maxHeight: 300, objectFit: 'contain' }} />
                                <div className="mt-2 d-flex justify-content-center gap-2">
                                    <button type="button" className="btn btn-primary btn-sm" onClick={() => fileInputRef.current?.click()} disabled={uploadingImage}>
                                        {uploadingImage ? 'Cargando...' : 'Añadir imagen'}
                                    </button>
                                    <button type="button" className="btn btn-outline-danger btn-sm" onClick={async () => {
                                        if (!insumo?.cod_insumo) return alert('Insumo sin codigo');
                                        if (!confirm('¿Eliminar la imagen asociada a este insumo?')) return;
                                        try {
                                            const res = await ImagenEliminarInsumos(insumo.cod_insumo);
                                            if (res?.success) {
                                                setPreviewSrc('https://upload.wikimedia.org/wikipedia/commons/2/27/Instrument_Placeholder.png');
                                                alert('Imagen eliminada.');
                                            } else {
                                                console.error('Error eliminando imagen:', res?.error ?? res);
                                                alert('Error eliminando imagen. Revisa la consola.');
                                            }
                                        } catch (err) {
                                            console.error('Error eliminando imagen', err);
                                            alert('Error eliminando imagen. Revisa la consola.');
                                        }
                                    }}>Eliminar imagen</button>
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
                                            const toDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
                                                const reader = new FileReader();
                                                reader.onload = () => resolve(String(reader.result));
                                                reader.onerror = () => reject(new Error('FileReader error'));
                                                reader.readAsDataURL(file);
                                            });

                                            const dataUrl = await toDataUrl(file);
                                            const base64 = dataUrl.split(',')[1] ?? dataUrl;
                                            const payload: Record<string, any> = { imagenIns: base64 };
                                            if (insumo?.cod_insumo) payload.cod_insumo = insumo.cod_insumo;

                                            const res = await crearImagenInsumo(payload as any);
                                            console.log('Upload response', res);
                                            if (res?.success) {
                                                const returned = res.data?.data ?? res.data ?? res;
                                                const url = returned?.url ?? returned?.data?.url ?? returned?.imagen_url ?? null;
                                                if (url) setPreviewSrc(url);
                                                alert('Imagen subida correctamente.');
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