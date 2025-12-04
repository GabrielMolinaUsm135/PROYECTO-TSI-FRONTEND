import axios from "axios";
import { useState, useEffect } from "react";
import { redirect, type ActionFunctionArgs, type LoaderFunctionArgs, useLoaderData, Form } from "react-router-dom";
import axiosInstance from '../../services/axiosinstance';

// helper to normalize group id fields
function getGrupoIdFromAlumno(alumnoData: any) {
    return alumnoData?.id_grupo_teoria ?? alumnoData?.id_grupo ?? alumnoData?.grupo_teoria ?? '';
}

export async function loader({ params }: LoaderFunctionArgs) {
    const { rut } = params;
    if (!rut) {
        throw new Response("Rut parameter is missing", { status: 400 });
    }

    const token = localStorage.getItem('token');
    if (!token) {
        throw new Response("Unauthorized", { status: 401 });
    }

    try {
        const url = `http://localhost:3000/api/alumno/${rut}`;
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data; // Return only the `data` property
    } catch (error) {
        throw new Response("Alumno not found", { status: 404 });
    }
}

export async function action({ request, params }: ActionFunctionArgs) {
    const { rut } = params;
    if (!rut) {
        throw new Response("Rut parameter is missing", { status: 400 });
    }

    const token = localStorage.getItem('token');
    if (!token) {
        throw new Response("Unauthorized", { status: 401 });
    }

    const FormData = Object.fromEntries(await request.formData()) as Record<string, any>;
    // If the user selected the special option to remove the apoderado, normalize it here
    if (FormData.rut_apoderado === '__SIN_APODERADO__') {
        FormData.rut_apoderado = '';
        FormData.id_apoderado = null;
    }
    try {
        // Resolve id_apoderado from rut_apoderado if provided
        let resolved_id_apoderado: number | null = null;
        if (FormData.rut_apoderado) {
            try {
                const res = await axiosInstance.get(`/apoderados/rut/${encodeURIComponent(String(FormData.rut_apoderado))}`);
                const apodata = res.data?.data ?? res.data ?? null;
                resolved_id_apoderado = apodata?.id_apoderado ?? apodata?.id ?? null;
            } catch (err) {
                console.warn('Could not resolve apoderado by rut:', err);
                resolved_id_apoderado = FormData.id_apoderado ?? null;
            }
        } else {
            resolved_id_apoderado = FormData.id_apoderado ?? null;
        }

        // coerce id_grupo_teoria
        let grupoId: number | null = null;
        if (FormData.id_grupo_teoria !== undefined && FormData.id_grupo_teoria !== '') {
            grupoId = Number(FormData.id_grupo_teoria) || null;
        }

        // Build normalized payload with all relevant fields
        const payload: Record<string, any> = {
            rut: FormData.rut_alumno ?? FormData.rut ?? null,
            rut_alumno: FormData.rut_alumno ?? FormData.rut ?? null,
            rut_apoderado: FormData.rut_apoderado ?? null,
            id_apoderado: resolved_id_apoderado,
            id_grupo_teoria: grupoId,
            nombre: FormData.nombre_alumno ?? FormData.nombre ?? null,
            apellido_paterno: FormData.apellido_paterno ?? FormData.apellidoPaterno ?? null,
            apellido_materno: FormData.apellido_materno ?? FormData.apellidoMaterno ?? null,
            telefono: (function(){
                const t = FormData.telefono_alumno ?? FormData.telefono ?? null;
                if (!t) return null;
                const s = String(t);
                return s.startsWith('+') ? s : `+569${s}`;
            })(),
            direccion: FormData.direccion_alumno ?? FormData.direccion ?? null,
            diagnostico_ne: FormData.diagnostico_ne ?? FormData.diagnosticoNe ?? null,
            correo: FormData.correo_alumno ?? FormData.correo ?? null,
            fecha_ingreso: FormData.fecha_ingreso ?? null,
        };

        await axiosInstance.put(`/alumno/${encodeURIComponent(String(rut))}`, payload, { headers: { 'Content-Type': 'application/json' } });
        return redirect('/Alumno/ListaAlumnos');
    } catch (error) {
        console.error("Error updating alumno:", error);
        return new Response("Failed to update alumno", { status: 500 });
    }
}

export default function EditarAlumno() {
    const loaderData = useLoaderData() as any;
    const alumnoData = loaderData?.data ?? loaderData ?? {};

    // Normalizar nombres de campos que pueden venir con distintas claves desde la API
    const rutAlumno = alumnoData.rut_alumno ?? alumnoData.rut ?? alumnoData.rutAlumno ?? '';
    const rutApoderadoVal = alumnoData.rut_apoderado ?? alumnoData.rutApoderado ?? alumnoData.rut_apoderado ?? '';
    const nombreAlumno = alumnoData.nombre_alumno ?? alumnoData.nombre ?? alumnoData.nombre_alumno ?? '';
    const apellidoPaterno = alumnoData.apellido_paterno ?? alumnoData.apellidoPaterno ?? alumnoData.apellido_paterno ?? '';
    const apellidoMaterno = alumnoData.apellido_materno ?? alumnoData.apellidoMaterno ?? alumnoData.apellido_materno ?? '';
    const telefonoAlumno = alumnoData.telefono_alumno ?? alumnoData.telefono ?? alumnoData.telefono_alumno ?? '';
    const correoAlumno = alumnoData.correo_alumno ?? alumnoData.correo ?? alumnoData.correo_alumno ?? '';
    const direccionAlumno = alumnoData.direccion_alumno ?? alumnoData.direccion ?? alumnoData.direccion_alumno ?? '';
    const diagnosticoNe = alumnoData.diagnostico_ne ?? alumnoData.diagnosticoNe ?? alumnoData.diagnostico_ne ?? '';
    

    const [rutApoderados, setRutApoderados] = useState<string[]>([]);
    const [grupos, setGrupos] = useState<Array<{id_grupo_teoria: number; nombre_grupo: string}>>([]);
    const [gruposLoading, setGruposLoading] = useState(false);

    useEffect(() => {
        let mounted = true;
        async function loadApoderados() {
            try {
                const list = await (await import('../../services/ApoderadoService')).getListaApoderados();
                const data = Array.isArray(list) ? list : [];
                if (mounted) setRutApoderados(data.map((a: any) => `${a.rut ?? ''}${a.nombre ? ' - ' + a.nombre : ''}`));
            } catch (err) {
                console.warn('Could not fetch apoderados list', err);
            }
        }
        loadApoderados();
        return () => { mounted = false; };
    }, []);

    // fetch grupos for the select
    useEffect(() => {
        let mounted = true;
        async function loadGrupos() {
            setGruposLoading(true);
            try {
                // prefer listado endpoint; fall back to nombre endpoint
                const tryEndpoints = ['/grupos', '/grupos/nombre'];
                let data: any = null;
                for (const ep of tryEndpoints) {
                    try {
                        const res = await axiosInstance.get(ep);
                        data = res.data?.data ?? res.data ?? null;
                        if (data) break;
                    } catch (e) {
                        // continue
                    }
                }
                if (!data) {
                    if (mounted) setGrupos([]);
                    return;
                }
                const arr = Array.isArray(data) ? data : (data.items ?? []);
                const normalized = arr.map((g: any) => ({ id_grupo_teoria: Number(g.id_grupo_teoria ?? g.id ?? 0), nombre_grupo: g.nombre_grupo ?? g.nombre ?? String(g) }));
                if (mounted) setGrupos(normalized);
            } catch (err) {
                console.warn('Could not fetch grupos', err);
                if (mounted) setGrupos([]);
            } finally {
                if (mounted) setGruposLoading(false);
            }
        }
        loadGrupos();
        return () => { mounted = false; };
    }, []);

    return (
        <>
            <div className="row bg-primary text-white py-3 mb-5">
                <div className="col text-center">
                    <h1>Editar un alumno</h1>
                </div>
            </div>
            <div className="container mb-5">
                <Form method="post" className="row">
                    <div className="col-md-6">
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="rut_alumno" className="form-label">RUT (Sin puntos con guion) - 00000000-0 <span className="text-danger">*</span></label>
                            <input 
                                type="text" 
                                id="rut_alumno" 
                                name="rut_alumno" 
                                maxLength={10} 
                                required                                 
                                title="El RUT (SIN PUNTOS Y CON GUION)" 
                                className="form-control" 
                                defaultValue={rutAlumno}                                
                            />
                        </div>
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="rut_apoderado" className="form-label">RUT Apoderado:</label>
                            <select id="rut_apoderado" name="rut_apoderado" required className="form-select" defaultValue={rutApoderadoVal}>
                                <option value="">Seleccione un RUT</option>
                                <option value="__SIN_APODERADO__">Quitar apoderado (ninguno)</option>
                                {rutApoderados.map((rut, index) => (
                                    <option key={index} value={rut}>{rut}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="id_grupo_teoria" className="form-label">Grupo Teoría:</label>
                            <select id="id_grupo_teoria" name="id_grupo_teoria" className="form-select" defaultValue={getGrupoIdFromAlumno(alumnoData)}>
                                <option value="">-- Seleccione grupo --</option>
                                {gruposLoading ? (
                                    <option disabled>Cargando...</option>
                                ) : (
                                    grupos.map(g => (
                                        <option key={g.id_grupo_teoria} value={g.id_grupo_teoria}>{g.nombre_grupo}</option>
                                    ))
                                )}
                            </select>
                        </div>
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="nombre_alumno" className="form-label">Nombre Alumno:</label>
                            <input type="text" id="nombre_alumno" name="nombre_alumno" maxLength={10} required className="form-control" defaultValue={nombreAlumno} />
                        </div>
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="apellido_paterno" className="form-label">Apellido Paterno:</label>
                            <input type="text" id="apellido_paterno" name="apellido_paterno" maxLength={10} required className="form-control" defaultValue={apellidoPaterno} />
                        </div>
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="apellido_materno" className="form-label">Apellido Materno:</label>
                            <input type="text" id="apellido_materno" name="apellido_materno" maxLength={10} required className="form-control" defaultValue={apellidoMaterno} />
                        </div>
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="telefono_alumno" className="form-label">Teléfono Alumno:</label>
                            <div className="input-group">
                                <span className="input-group-text">+569</span>
                                <input type="text" id="telefono_alumno" name="telefono_alumno" required className="form-control" defaultValue={String(telefonoAlumno ?? '').replace(/^\+569/, '')} />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="correo_alumno" className="form-label">Correo Alumno:</label>
                            <input type="email" id="correo_alumno" name="correo_alumno" maxLength={40} required className="form-control" defaultValue={correoAlumno} />
                        </div>
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="direccion_alumno" className="form-label">Dirección Alumno:</label>
                            <input type="text" id="direccion_alumno" name="direccion_alumno" maxLength={50} required className="form-control" defaultValue={direccionAlumno} />
                        </div>
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="fecha_ingreso" className="form-label">Fecha Ingreso a la Orquesta:</label>
                            <input
                                type="date"
                                id="fecha_ingreso"
                                name="fecha_ingreso"
                                required
                                className="form-control"
                                defaultValue={(() => {
                                    const raw = alumnoData.fecha_ingreso ?? alumnoData.anio_ingreso_orquesta ?? alumnoData.anio_ingreso ?? '';
                                    if (!raw) return '';
                                    // If it's a 4-digit year, return YYYY-01-01
                                    if (/^\d{4}$/.test(String(raw))) return `${raw}-01-01`;
                                    // If it's an ISO or date-like string, normalize to YYYY-MM-DD
                                    try {
                                        const d = new Date(String(raw));
                                        if (isNaN(d.getTime())) return '';
                                        const yyyy = d.getFullYear();
                                        const mm = String(d.getMonth() + 1).padStart(2, '0');
                                        const dd = String(d.getDate()).padStart(2, '0');
                                        return `${yyyy}-${mm}-${dd}`;
                                    } catch (e) {
                                        return '';
                                    }
                                })()}
                            />
                        </div>
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="diagnostico_ne" className="form-label">Diagnóstico Necesidades Especiales:</label>
                            <textarea id="diagnostico_ne" name="diagnostico_ne" maxLength={100} className="form-control" style={{ height: "275px" }} defaultValue={diagnosticoNe}></textarea>
                        </div>
                    </div>
                    <div className="col-12 text-center">
                        <button type="submit" className="btn btn-primary">Confirmar</button>
                    </div>
                </Form>
            </div>
        </>
    );
}