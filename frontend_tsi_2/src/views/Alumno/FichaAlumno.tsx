import { Link, useLoaderData, type LoaderFunctionArgs, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from 'react';
import axios from "axios";
import axiosInstance from "../../services/axiosinstance";
import { crearimagen, getListaImagenes, ImagenEliminar } from '../../services/ImagenService';
import { resizeImageFileToDataUrl, fileToDataUrl } from '../../utils/image';
import { actualizarPrestamoInstrumento, actualizarPrestamoInsumo } from '../../services/PrestamoService';
import { getListaAlergias, crearAlumnoAlergia, getAlergiasPorAlumno, eliminarAlumnoAlergia } from '../../services/AlergiaService';
import type { Alergia } from '../../types/alergia';

export async function loader({ params }: LoaderFunctionArgs) {
    const idOrRut = params.id;
    if (!idOrRut) {
        throw new Response("Alumno identifier is missing", { status: 400 });
    }

    const token = localStorage.getItem('token');
    if (!token) {
        throw new Response("Unauthorized", { status: 401 });
    }

    try {
        // backend seems to accept the same endpoint for id or rut; try directly
        const url = `http://localhost:3000/api/alumno/${encodeURIComponent(idOrRut)}`;
        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const alumno = response.data; // expected shape: { data: { ... } }

        // if correo is missing, but there's an associated user id, fetch the user to obtain correo
        const alumnoData = alumno?.data ?? alumno;
        if ((alumnoData && !alumnoData.correo) && (alumnoData?.id_usuario || alumnoData?.id_user)) {
            const userId = alumnoData.id_usuario ?? alumnoData.id_user;
            try {
                const userUrl = `http://localhost:3000/api/user/${encodeURIComponent(userId)}`;
                const userRes = await axios.get(userUrl, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const userData = userRes.data?.data ?? userRes.data;
                if (userData?.correo) {
                    // attach correo to the alumno data so the component can display it
                    if (alumno.data) alumno.data.correo = userData.correo;
                    else alumno.correo = userData.correo;
                }
            } catch (userErr) {
                // if user lookup fails, continue returning alumno (no correo)
                console.warn('Could not fetch associated user for correo:', userErr);
            }
        }

        // attempt to fetch notas for this alumno (Tnotas/:id_alumno)
        const alumnoDataForNotas = alumno?.data ?? alumno;
        let notas = [];
        if (alumnoDataForNotas?.id_alumno) {
            try {
                const notasRes = await getNotasAlumno(alumnoDataForNotas.id_alumno);
                notas = notasRes?.data ?? notasRes ?? [];
            } catch (notaErr) {
                console.warn('No se pudieron obtener las notas del alumno:', notaErr);
                notas = [];
            }
        }

        // return combined payload: { alumno: <original>, notas: [...] }
        return { alumno: alumno, notas };
    } catch (error) {
        throw new Response("Alumno not found", { status: 404 });
    }
}

export async function getNotasAlumno(id_alumno: number | string) {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Response("Unauthorized", { status: 401 });
    }
    try{   
        const url = `http://localhost:3000/api/Tnotas/${encodeURIComponent(id_alumno)}`;
        const notaResponse = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return notaResponse.data;
     }
    catch (error) {
        throw new Response("Notas no encontradas", { status: 404 });
    }
}



export default function FichaAlumno() {
    const loader = useLoaderData() as any;
    const alumno = loader?.alumno ?? loader;
    const notas: any[] = loader?.notas ?? [];
    const navigate = useNavigate();
    console.log('alumno loader:', alumno);
    console.log('notas loader:', notas);
    const alumnoId = alumno?.data?.id_alumno ?? alumno?.data?.id ?? alumno?.id_alumno ?? alumno?.id ?? null;
    const canEditNotas = !!alumnoId && Array.isArray(notas) && notas.length >= 4;
    const canCreateNotas = !!alumnoId && Array.isArray(notas) && notas.length < 4;

    // alergias state
    const [allAlergias, setAllAlergias] = useState<Alergia[]>([]);
    const [appliedAlergias, setAppliedAlergias] = useState<Alergia[]>([]);
    const [selectedAlergia, setSelectedAlergia] = useState<string | number>('');
    const [addingAlergia, setAddingAlergia] = useState(false);
    const [removingAlergia, setRemovingAlergia] = useState<string | number | null>(null);
    const [apoderadoRut, setApoderadoRut] = useState<string | null>(null);
    const [imageSrc, setImageSrc] = useState<string>(alumno?.data?.foto ?? alumno?.data?.foto_url ?? 'https://t4.ftcdn.net/jpg/05/42/36/11/360_F_542361185_VFRJWpR2FH5OiAEVveWO7oZnfSccZfD3.jpg');
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const prevObjectUrlRef = useRef<string | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [hasImageLinked, setHasImageLinked] = useState<boolean>(Boolean(alumno?.data?.foto ?? alumno?.data?.foto_url));
    const [grupoNombre, setGrupoNombre] = useState<string | null>(null);
    const [prestamosInstrumento, setPrestamosInstrumento] = useState<any[]>([]);
    const [prestamosInsumo, setPrestamosInsumo] = useState<any[]>([]);
    const [loadingPrestamos, setLoadingPrestamos] = useState(false);
    const [actionLoading, setActionLoading] = useState<Record<string | number, boolean>>({});

    useEffect(() => {
        let mounted = true;
        async function load() {
            try {
                const list = await getListaAlergias();
                if (mounted) setAllAlergias(Array.isArray(list) ? list : []);
            } catch (err) {
                console.warn('Error loading alergias', err);
            }

            // fetch applied alergias for this alumno via the dedicated endpoint
            try {
                if (alumnoId) {
                    const applied = await getAlergiasPorAlumno(alumnoId);
                    if (mounted) setAppliedAlergias(Array.isArray(applied) ? applied : []);
                }
            } catch (e) {
                console.warn('Error loading applied alergias for alumno', e);
            }
        }
        load();

        return () => { mounted = false; };
    }, [alumno, alumnoId]);

    // load apoderado rut when id_apoderado is present (so link can show the actual rut)
    useEffect(() => {
        let mounted = true;
        async function loadApoderadoRut() {
            try {
                const id = alumno?.data?.id_apoderado ?? alumno?.id_apoderado ?? null;
                if (!id) {
                    if (mounted) setApoderadoRut(null);
                    return;
                }
                const res = await axiosInstance.get(`/apoderados/${encodeURIComponent(String(id))}`);
                const data = res.data?.data ?? res.data ?? null;
                if (mounted) setApoderadoRut(data?.rut ?? null);
            } catch (err) {
                console.warn('Could not load apoderado rut by id:', err);
            }
        }
        loadApoderadoRut();
        return () => { mounted = false; };
    }, [alumno?.data?.id_apoderado]);

    // fetch grupo teoria name by id_grupo_teoria
    useEffect(() => {
        let mounted = true;
        async function loadGrupo() {
            try {
                const id = alumno?.data?.id_grupo_teoria ?? alumno?.id_grupo_teoria ?? null;
                if (!id) {
                    if (mounted) setGrupoNombre(null);
                    return;
                }
                const res = await axiosInstance.get(`/grupos/${encodeURIComponent(String(id))}`);
                const data = res.data?.data ?? res.data ?? null;
                if (mounted) setGrupoNombre(data?.nombre_grupo ?? null);
            } catch (err) {
                console.warn('Could not load grupo teoria by id:', err);
                if (mounted) setGrupoNombre(null);
            }
        }
        loadGrupo();
        return () => { mounted = false; };
    }, [alumno?.data?.id_grupo_teoria, alumno?.id_grupo_teoria]);

    // fetch prestamos for this alumno (both instrumento and insumo)
    useEffect(() => {
        let mounted = true;
        async function loadPrestamos() {
            setLoadingPrestamos(true);
            try {
                const idUsuario = alumno?.data?.id_usuario ?? alumno?.data?.id_user ?? alumno?.id_usuario ?? alumno?.id_user ?? null;
                if (!idUsuario) {
                    if (mounted) {
                        setPrestamosInstrumento([]);
                        setPrestamosInsumo([]);
                    }
                    return;
                }
                const res = await axiosInstance.get(`/prestamos/usuario/${encodeURIComponent(String(idUsuario))}`);
                const data = res.data?.data ?? res.data ?? {};
                if (mounted) {
                    setPrestamosInstrumento(Array.isArray(data?.prestamos_instrumento) ? data.prestamos_instrumento : []);
                    setPrestamosInsumo(Array.isArray(data?.prestamos_insumo) ? data.prestamos_insumo : []);
                }
            } catch (err) {
                console.warn('Error loading prestamos for alumno', err);
                if (mounted) {
                    setPrestamosInstrumento([]);
                    setPrestamosInsumo([]);
                }
            } finally {
                if (mounted) setLoadingPrestamos(false);
            }
        }
        loadPrestamos();
        return () => { mounted = false; };
    }, [alumno?.data?.id_usuario, alumno?.data?.id_user]);

    // cleanup object URL when unmounting
    useEffect(() => {
        return () => {
            if (prevObjectUrlRef.current) {
                try { URL.revokeObjectURL(prevObjectUrlRef.current); } catch (e) { /* ignore */ }
            }
        };
    }, []);

    // If the alumno has an associated id_usuario, try to fetch an existing image
    useEffect(() => {
        let mounted = true;
        async function loadImageForUsuario() {
            const idUsuario = alumno?.data?.id_usuario ?? alumno?.data?.id_user ?? null;
            if (!idUsuario) return;
            try {
                const res = await axiosInstance.get(`/imagenes/${encodeURIComponent(String(idUsuario))}`);
                const payload = res.data?.data ?? res.data ?? null;
                if (!mounted || !payload) return;

                // accept several possible keys returned by backend
                const b64 = payload.imageBase64 ?? payload.imagenBase64 ?? payload.imagenB ?? null;
                const mime = payload.mimeType ?? payload.mime ?? 'image/jpeg';
                if (typeof b64 === 'string' && b64.length > 0) {
                    // revoke previous object URL if any
                    if (prevObjectUrlRef.current) {
                        try { URL.revokeObjectURL(prevObjectUrlRef.current); } catch (e) { /* ignore */ }
                        prevObjectUrlRef.current = null;
                    }
                    setImageSrc(`data:${mime};base64,${b64}`);
                    setHasImageLinked(true);
                    return;
                }

                // if backend returned a URL
                const url = payload.url ?? payload.imagen_url ?? null;
                if (typeof url === 'string' && url.length > 0) {
                    setImageSrc(url);
                    setHasImageLinked(true);
                    return;
                }
            } catch (err) {
                // ignore — keep current imageSrc
                console.warn('No existing image for usuario or fetch failed', err);
            }
        }
        loadImageForUsuario();
        return () => { mounted = false; };
    }, [alumno?.data?.id_usuario]);

    async function handleEntregarPrestamo(p: any, tipo: 'instrumento' | 'insumo') {
        const idParam = p.cod_prestamo ?? p.cod ?? (Number(p.cod_prestamo ?? p.cod) || null);
        if (!idParam) return;
        const estadoActual: string = (p.estado ?? '').toString().toLowerCase();
        if (estadoActual.includes('devuelto')) return;

        const fechaDev = p.fecha_devolucion ? new Date(String(p.fecha_devolucion).slice(0,10)) : null;
        const today = new Date();
        const todayYMD = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
        let nuevoEstado = 'devuelto';
        if (fechaDev && fechaDev < todayYMD) nuevoEstado = 'devuelto atrasado';

        setActionLoading(prev => ({ ...prev, [idParam]: true }));
        try {
            let res;
            if (tipo === 'instrumento') res = await actualizarPrestamoInstrumento(idParam, { estado: nuevoEstado });
            else res = await actualizarPrestamoInsumo(idParam, { estado: nuevoEstado });

            if (res?.success) {
                // update local state
                if (tipo === 'instrumento') {
                    setPrestamosInstrumento(prev => prev.map(it => ( (it.cod_prestamo ?? it.cod) === (p.cod_prestamo ?? p.cod) ? { ...it, estado: nuevoEstado } : it )));
                } else {
                    setPrestamosInsumo(prev => prev.map(it => ( (it.cod_prestamo ?? it.cod) === (p.cod_prestamo ?? p.cod) ? { ...it, estado: nuevoEstado } : it )));
                }
            } else {
                alert('Error al marcar préstamo como entregado');
            }
        } catch (err) {
            console.error('Error entregando prestamo', err);
            alert('Error al marcar préstamo como entregado');
        } finally {
            setActionLoading(prev => ({ ...prev, [idParam]: false }));
        }
    }

    async function handleAddAlergia() {
        if (!selectedAlergia || !alumnoId) return;
        setAddingAlergia(true);
        try {
            const res = await crearAlumnoAlergia({ cod_alergia: selectedAlergia, id_alumno: alumnoId });
            if (!res.success) {
                alert('Error agregando alergia: ' + (res.error ? JSON.stringify(res.error) : 'unknown'));
                return;
            }
            // refresh applied alergias list from server
            try {
                const applied = await getAlergiasPorAlumno(alumnoId);
                setAppliedAlergias(Array.isArray(applied) ? applied : []);
            } catch (e) {
                console.warn('Error refreshing applied alergias after add', e);
            }
        } catch (err) {
            console.error('Error adding alergia', err);
            alert('Error agregando alergia. Revisa la consola.');
        } finally {
            setAddingAlergia(false);
        }
    }

    async function handleRemoveAlergia(cod_alergia: string | number) {
        if (!alumnoId) return;
        const ok = window.confirm('¿Eliminar esta asociación de alergia para el alumno?');
        if (!ok) return;
        setRemovingAlergia(cod_alergia);
        try {
            const res = await eliminarAlumnoAlergia(cod_alergia, alumnoId);
            if (!res.success) {
                alert('Error eliminando la relación: ' + (res.error ? JSON.stringify(res.error) : 'unknown'));
                return;
            }
            // refresh list
            const applied = await getAlergiasPorAlumno(alumnoId);
            setAppliedAlergias(Array.isArray(applied) ? applied : []);
        } catch (err) {
            console.error('Error removing alumno_alergia', err);
            alert('Error eliminando la relación. Revisa la consola.');
        } finally {
            setRemovingAlergia(null);
        }
    }

    async function createMissingNotas() {
        if (!alumnoId) return;
        const missing = 4 - (Array.isArray(notas) ? notas.length : 0);
        if (missing <= 0) return;

        const token = localStorage.getItem('token');
        if (!token) {
            alert('No autorizado');
            return;
        }

        // attempt to get alumno info (id_alumno/id_usuario)
        let id_alumno = alumno?.data?.id_alumno ?? alumno?.data?.id ?? alumno?.id_alumno ?? alumno?.id ?? null;
        let id_usuario = alumno?.data?.id_usuario ?? alumno?.data?.id_user ?? null;

        try {
            // if id_alumno not present, fetch alumno by route id
            if (!id_alumno) {
                const res = await axios.get(`http://localhost:3000/api/alumno/${encodeURIComponent(String(alumnoId))}`, { headers: { Authorization: `Bearer ${token}` } });
                const a = res.data?.data ?? res.data ?? null;
                id_alumno = a?.id_alumno ?? a?.id ?? null;
                id_usuario = id_usuario ?? a?.id_usuario ?? a?.id_user ?? null;
            }

            if (!id_alumno) {
                alert('No se pudo obtener id_alumno para crear notas');
                return;
            }

            const today = new Date().toISOString().split('T')[0];
            for (let i = 1; i <= missing; i++) {
                const payload: Record<string, any> = {
                    id_alumno,
                    fecha_evaluacion: today,
                    nombre_evaluacion: `Evaluación ${ (Array.isArray(notas) ? notas.length : 0) + i }`,
                    nota: null,
                };
                if (id_usuario) payload.id_usuario = id_usuario;
                try {
                    await axiosInstance.post('/notas', payload);
                } catch (err) {
                    console.warn('Error creando nota por defecto', err);
                }
            }

            // refresh the ficha after creation
            navigate(0);
        } catch (err) {
            console.error('Error al crear notas faltantes:', err);
            alert('Error creando notas. Revisa la consola.');
        }
    }

    return (
        <>
            <div className="row bg-primary text-white py-3 mb-5">
                <div className="col text-center">
                    <h1>Ficha "{alumno.data.nombre} {alumno.data.apellido_paterno} {alumno.data.apellido_materno}"</h1>
                </div>
            </div>
            <div className="container mt-5 mb-5">
                <div className="row h-100 align-items-stretch">
                    {/* Column 1 */}
                    <div className="col-md-3 d-flex flex-column justify-content-center align-items-center border bg-primary bg-opacity-50">
                        <div className="text-center">
                            <img
                                src={imageSrc}
                                alt="Foto del alumno"
                                className="img-fluid border"
                                style={{ maxHeight: 220, objectFit: 'cover' }}
                            />
                            <div className="mt-2 d-flex gap-2">
                                <button type="button" className="btn btn-sm btn-primary" onClick={() => fileInputRef.current?.click()} disabled={uploadingImage || hasImageLinked}>
                                    {uploadingImage ? 'Cargando...' : 'Insertar imagen'}
                                </button>
                                <button type="button" className="btn btn-sm btn-outline-danger" disabled={!hasImageLinked} onClick={async () => {
                                    const idUsuario = alumno?.data?.id_usuario ?? alumno?.data?.id_user ?? alumno?.id_user ?? alumno?.id_usuario ?? null;
                                    if (!idUsuario) return alert('No hay usuario asociado a este alumno');
                                    if (!confirm('¿Eliminar la imagen asociada a este alumno?')) return;
                                    try {
                                        const res = await ImagenEliminar(idUsuario);
                                        if (res?.success) {
                                            setImageSrc('https://t4.ftcdn.net/jpg/05/42/36/11/360_F_542361185_VFRJWpR2FH5OiAEVveWO7oZnfSccZfD3.jpg');
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
                                    // revoke previous object URL if any
                                    if (prevObjectUrlRef.current) {
                                        URL.revokeObjectURL(prevObjectUrlRef.current);
                                    }
                                    const objUrl = URL.createObjectURL(file);
                                    prevObjectUrlRef.current = objUrl;
                                    setImageSrc(objUrl);

                                    // upload to server as JSON with base64 under 'imagenB' (backend expects id_usuario and imagenB)
                                    try {
                                        const idUsuario = alumno?.data?.id_usuario ?? alumno?.data?.id_user ?? alumno?.id_user ?? alumno?.id_usuario ?? null;
                                        setUploadingImage(true);

                                        // Try to resize image (avatar) to smaller width to reduce upload size
                                        let dataUrl: string;
                                        try {
                                            dataUrl = await resizeImageFileToDataUrl(file, 400, 0.8);
                                        } catch (err) {
                                            dataUrl = await fileToDataUrl(file);
                                        }
                                        // dataUrl is like: data:<mime>;base64,<base64data>
                                        const base64 = dataUrl.split(',')[1] ?? dataUrl;

                                        const payload: Record<string, any> = { imagenB: base64 };
                                        if (idUsuario) payload.id_usuario = idUsuario;

                                        // Use service which posts JSON to /imagenes
                                        const res = await crearimagen(payload);
                                        console.log('Upload response', res);
                                        if (res?.success) {
                                            alert('Imagen subida correctamente.');
                                            // Optionally, if backend returns a URL, update preview
                                            const returned = res.data?.data ?? res.data ?? res;
                                            const url = returned?.url ?? returned?.data?.url ?? returned?.imagen_url ?? null;
                                            if (url) setImageSrc(url);
                                            setHasImageLinked(true);
                                        } else {
                                            console.error('Error subiendo imagen:', res?.error ?? res);
                                            alert('Error subiendo imagen. Revisa la consola.');
                                        }
                                    } catch (err:any) {
                                        console.error('Error subiendo imagen', err);
                                        alert('Error subiendo imagen. Revisa la consola.');
                                    } finally {
                                        setUploadingImage(false);
                                    }
                                }}
                            />
                        </div>
                    </div>
                    {/* Column 2 */}
                    <div className="col-md-8 d-flex flex-column justify-content-center align-items-start border">
                        <h3 className="text-center w-100">ALUMNO</h3>
                        <div>
                            <div className="mb-2 d-flex justify-content-start">
                                <h5 className="me-2">Rut:</h5>
                                <p>{alumno.data.rut}</p>
                            </div>
                            <div className="mb-2 d-flex justify-content-start">
                                <h5 className="me-2">Rut Apoderado:</h5>
                                    {alumno?.data?.id_apoderado ? (
                                        <p>
                                            <Link to={`/apoderados/Detalle/${encodeURIComponent(String(alumno.data.id_apoderado))}`}>
                                                {apoderadoRut ?? alumno.data.rut_apoderado ?? 'Ver Apoderado'}
                                            </Link>
                                        </p>
                                    ) : (
                                        <p>{alumno.data.rut_apoderado}</p>
                                    )}
                            </div>
                            <div className="mb-2 d-flex justify-content-start">
                                <h5 className="me-2">Nombre:</h5>
                                <p>{alumno.data.nombre}</p>
                            </div>
                            <div className="mb-2 d-flex justify-content-start">
                                <h5 className="me-2">Apellido Paterno:</h5>
                                <p>{alumno.data.apellido_paterno}</p>
                            </div>
                            <div className="mb-2 d-flex justify-content-start">
                                <h5 className="me-2">Apellido Materno:</h5>
                                <p>{alumno.data.apellido_materno}</p>
                            </div>
                            <div className="mb-2 d-flex justify-content-start">
                                <h5 className="me-2">Teléfono:</h5>
                                <p>{alumno.data.telefono}</p>
                            </div>
                            <div className="mb-2 d-flex justify-content-start">
                                <h5 className="me-2">Correo:</h5>
                                <p>{alumno.data.correo}</p>
                            </div>
                            <div className="mb-2 d-flex justify-content-start">
                                <h5 className="me-2">Dirección:</h5>
                                <p>{alumno.data.direccion}</p>
                            </div>
                            <div className="mb-2 d-flex justify-content-start">
                                <h5 className="me-2">Diagnóstico Necesidades Especiales:</h5>
                                <p>{alumno.data.diagnostico_ne}</p>
                            </div>
                            <div className="mb-2 d-flex justify-content-start">
                                <h5 className="me-2">Grupo Teoria: </h5>
                                <p>{grupoNombre ?? alumno.data.grupo_teoria ?? '-'}</p>
                            </div>
                            <div className="mb-2 d-flex justify-content-start">
                                <h5 className="me-2">Fecha de Ingreso a la Orquesta:</h5>
                                <p>{alumno.data.fecha_ingreso}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container mt-4">
                <h3 className="text-center mb-3">Desempeño Teoria Musical</h3>
                        <table className="table table-bordered text-center">
                    <thead className="table-primary">
                        <tr>
                            <th>Nota 1</th>
                            <th>Nota 2</th>
                            <th>Nota 3</th>
                            <th>Nota Final</th>
                            <th>Asistencia %</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{notas[0]?.nota ?? '-'}</td>
                            <td>{notas[1]?.nota ?? '-'}</td>
                            <td>{notas[2]?.nota ?? '-'}</td>
                            <td>{(notas[0]?.nota + notas[1]?.nota + notas[2]?.nota) / 3}</td>
                            <td>{notas[3]?.nota ?? '-'}</td>
                        </tr>
                    </tbody>
                </table>
                        <div className="d-flex justify-content-center mt-3">
                            {canEditNotas ? (
                                <Link to={`/alumno/notas/${encodeURIComponent(String(alumnoId))}`} className="btn btn-warning me-2">Editar Notas</Link>
                            ) : (
                                <button className="btn btn-warning me-2" disabled title="Se requieren 4 notas enlazadas para editar">Editar Notas</button>
                            )}

                            {canCreateNotas ? (
                                <button className="btn btn-success" onClick={() => createMissingNotas()}>Crear notas faltantes</button>
                            ) : (
                                <button className="btn btn-success" disabled title="No se pueden crear más notas">Crear notas faltantes</button>
                            )}
                        </div>
            </div>

            <div className="container mt-4">
                <h3 className="text-center mb-3">Préstamos Instrumentos/Insumos</h3>
                {loadingPrestamos ? (
                    <p>Cargando préstamos...</p>
                ) : (
                    <>
                        <h5>Instrumentos</h5>
                        <table className="table table-bordered text-center mb-4">
                            <thead className="table-primary">
                                <tr>
                                    <th>Instrumento</th>
                                    <th>Fecha de Inicio</th>
                                    <th>Fecha de Devolución</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {prestamosInstrumento.length === 0 ? (
                                    <tr><td colSpan={5}>No hay préstamos de instrumento</td></tr>
                                ) : (
                                    prestamosInstrumento.map((p: any) => (
                                        <tr key={p.cod_prestamo ?? `${p.cod_instrumento}-${p.id_usuario}`}>                                            
                                            <td>
                                                <Link to={`/Instrumentos/Detalle/${encodeURIComponent(String(p.instrumento?.cod_instrumento ?? p.cod_instrumento ?? ''))}`}>
                                                    {p.instrumento?.nombre_instrumento ?? p.cod_instrumento}
                                                </Link>
                                            </td>
                                            <td>{p.fecha_prestamo ?? '-'}</td>
                                            <td>{p.fecha_devolucion ?? '-'}</td>
                                            <td>
                                                {(() => {
                                                    const raw = (p.estado ?? '').toString();
                                                    const key = raw.toLowerCase();
                                                    let cls = 'secondary';
                                                    if (key.includes('devuelto atrasado')) cls = 'warning';
                                                    else if (key.includes('devuelto')) cls = 'success';
                                                    else if (key.includes('atrasado')) cls = 'danger';
                                                    else if (key.includes('pendiente')) cls = 'secondary';
                                                    const textColor = cls === 'warning' ? 'text-dark' : 'text-white';
                                                    return (
                                                        <span className={`badge bg-${cls} ${textColor}`}>{raw || '-'}</span>
                                                    );
                                                })()}
                                            </td>
                                            <td>
                                                <a className="btn btn-sm btn-secondary me-2" href={`/Prestamo/EditarInstrumento/${encodeURIComponent(String(p.cod_prestamo ?? p.cod))}`}>Editar</a>
                                                <button className="btn btn-sm btn-success" disabled={Boolean(actionLoading[p.cod_prestamo ?? p.cod]) || String(p.estado ?? '').toLowerCase().includes('devuelto')} onClick={() => handleEntregarPrestamo(p, 'instrumento')}>
                                                    {actionLoading[p.cod_prestamo ?? p.cod] ? '...' : 'Entregar'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        <h5>Insumos</h5>
                        <table className="table table-bordered text-center">
                            <thead className="table-primary">
                                <tr>
                                    <th>Insumo</th>
                                    <th>Fecha de Inicio</th>
                                    <th>Fecha de Devolución</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {prestamosInsumo.length === 0 ? (
                                    <tr><td colSpan={5}>No hay préstamos de insumo</td></tr>
                                ) : (
                                    prestamosInsumo.map((p: any) => (
                                        <tr key={p.cod_prestamo ?? `${p.cod_insumo}-${p.id_usuario}`}>
                                            <td>
                                                <Link to={`/Insumos/Detalle/${encodeURIComponent(String(p.insumo?.cod_insumo ?? p.cod_insumo ?? ''))}`}>
                                                    {p.insumo?.nombre_insumo ?? p.cod_insumo}
                                                </Link>
                                            </td>
                                            <td>{p.fecha_prestamo ?? '-'}</td>
                                            <td>{p.fecha_devolucion ?? '-'}</td>
                                            <td>
                                                {(() => {
                                                    const raw = (p.estado ?? '').toString();
                                                    const key = raw.toLowerCase();
                                                    let cls = 'secondary';
                                                    if (key.includes('devuelto atrasado')) cls = 'warning';
                                                    else if (key.includes('devuelto')) cls = 'success';
                                                    else if (key.includes('atrasado')) cls = 'danger';
                                                    else if (key.includes('pendiente')) cls = 'secondary';
                                                    const textColor = cls === 'warning' ? 'text-dark' : 'text-white';
                                                    return (
                                                        <span className={`badge bg-${cls} ${textColor}`}>{raw || '-'}</span>
                                                    );
                                                })()}
                                            </td>
                                            <td>
                                                <a className="btn btn-sm btn-secondary me-2" href={`/Prestamo/EditarInsumo/${encodeURIComponent(String(p.cod_prestamo ?? p.cod))}`}>Editar</a>
                                                <button className="btn btn-sm btn-success" disabled={Boolean(actionLoading[p.cod_prestamo ?? p.cod]) || String(p.estado ?? '').toLowerCase().includes('devuelto')} onClick={() => handleEntregarPrestamo(p, 'insumo')}>
                                                    {actionLoading[p.cod_prestamo ?? p.cod] ? '...' : 'Entregar'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </>
                )}
            </div>
            <div className="container mt-4">
                <h3 className="text-center mb-3">Alergias</h3>
                <div className="d-flex justify-content-center mb-3">
                    <select className="form-select w-50 me-2" value={selectedAlergia} onChange={(e) => setSelectedAlergia(e.target.value)}>
                        <option value="">Seleccione una alergia</option>
                        {allAlergias.map((a) => (
                            <option key={a.cod_alergia} value={a.cod_alergia}>{a.nombre_alergia ?? a.cod_alergia}</option>
                        ))}
                    </select>
                    <button className="btn btn-primary" onClick={() => handleAddAlergia()} disabled={addingAlergia || !selectedAlergia}>
                        {addingAlergia ? 'Agregando...' : 'Agregar Alergia'}
                    </button>
                </div>

                <table className="table table-bordered text-center">
                    <thead className="table-primary">
                        <tr>
                            <th>Código</th>
                            <th>Nombre</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appliedAlergias.length === 0 ? (
                            <tr><td colSpan={3}>No hay alergias registradas</td></tr>
                        ) : (
                            appliedAlergias.map((a) => (
                                <tr key={a.cod_alergia}>
                                    <td>{a.cod_alergia}</td>
                                    <td>{a.nombre_alergia}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleRemoveAlergia(a.cod_alergia)}
                                            disabled={removingAlergia === a.cod_alergia}
                                        >
                                            {removingAlergia === a.cod_alergia ? 'Eliminando...' : 'Eliminar'}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            </div>
        </>
    );
}