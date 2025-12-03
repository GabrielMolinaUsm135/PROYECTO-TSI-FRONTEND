import { useState, useEffect } from 'react';
import { crearAlumno, existeRut } from '../../services/AlumnoService';
import axiosInstance from '../../services/axiosinstance';
import { getListaApoderados } from '../../services/ApoderadoService';

export default function CrearAlumno() {
    const [form, setForm] = useState({
        rut: '',
        apoderado_rut: '',
        id_grupo_teoria: 1,
        fecha_ingreso: new Date().toISOString().slice(0, 10),
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        telefono: '',
        direccion: '',
        diagnostico_ne: '',
        correo: '',
        password: '',        
        id_rol: 3,
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [apoderados, setApoderados] = useState<Array<{id_apoderado?: number; rut?: string; nombre?: string}>>([]);
    const [apoderadosLoading, setApoderadosLoading] = useState(false);
    const [grupos, setGrupos] = useState<Array<{id_grupo_teoria: number; nombre_grupo: string}>>([]);
    const [gruposLoading, setGruposLoading] = useState(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    }

    useEffect(() => {
        // fetch apoderados list for the select (show rut + name)
        let mounted = true;
        async function fetchApoderados() {
            setApoderadosLoading(true);
            try {
                const list = await getListaApoderados();
                const data = Array.isArray(list) ? list : [];
                if (mounted) setApoderados(data.map((a: any) => ({ id_apoderado: a.id_apoderado ?? a.id, rut: a.rut, nombre: a.nombre })));
            } catch (err) {
                console.warn('No se pudieron obtener los apoderados', err);
            } finally {
                if (mounted) setApoderadosLoading(false);
            }
        }
        fetchApoderados();
        return () => { mounted = false; };
    }, []);

    // fetch grupos (try a few endpoints for compatibility)
    useEffect(() => {
        let mounted = true;
        async function fetchGrupos() {
            setGruposLoading(true);
            try {
                const tryEndpoints = ['/grupos', '/grupos/nombre', '/grupos/nombre/1'];
                let data: any = null;
                for (const ep of tryEndpoints) {
                    try {
                        const res = await axiosInstance.get(ep);
                        data = res.data?.data ?? res.data ?? null;
                        if (data) break;
                    } catch (e) {
                        // try next
                    }
                }
                if (!data) {
                    if (mounted) setGrupos([]);
                    return;
                }
                // ensure array of { id_grupo_teoria, nombre_grupo }
                const arr = Array.isArray(data) ? data : (data.items ?? []);
                const normalized = arr.map((g: any) => ({ id_grupo_teoria: Number(g.id_grupo_teoria ?? g.id ?? g.id_grupo ?? 0), nombre_grupo: g.nombre_grupo ?? g.nombre ?? String(g) }));
                if (mounted) setGrupos(normalized);
            } catch (err) {
                console.warn('Could not fetch grupos list', err);
                if (mounted) setGrupos([]);
            } finally {
                if (mounted) setGruposLoading(false);
            }
        }
        fetchGrupos();
        return () => { mounted = false; };
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setMessage(null);
        setError(null);

        // basic validation
        if (!form.rut || !form.nombre || !form.correo || !form.password) {
            setError('RUT, nombre, correo y contraseña son obligatorios.');
            return;
        }

        setLoading(true);
        try {
            // check rut uniqueness
            const check = await existeRut(String(form.rut).trim());
            if (check.exists) {
                setError('El RUT ya está registrado. Verifique o use otro RUT.');
                setLoading(false);
                return;
            }
            // determine id_apoderado if a rut was selected
            let resolved_id_apoderado: number | string | null = null;
            if (form.apoderado_rut) {
                try {
                    const resp = await axiosInstance.get(`/apoderados/rut/${encodeURIComponent(String(form.apoderado_rut))}`);
                    const apodata = resp.data?.data ?? resp.data ?? null;
                    // backend may return object with id_apoderado or id
                    resolved_id_apoderado = apodata?.id_apoderado ?? apodata?.id ?? null;
                } catch (err) {
                    console.warn('No se encontró apoderado por RUT seleccionado', err);
                    // leave resolved_id_apoderado as null; backend may accept rut_apoderado only
                }
            }

            // prepare payload matching backend shape (convert empty id_apoderado to null, numeric fields)
            const payload: Record<string, any> = {
                // include both keys to be compatible with different backend expectations
                rut: form.rut,
                rut_alumno: form.rut,
                // backend may accept rut_apoderado; also include the resolved numeric id if found
                rut_apoderado: form.apoderado_rut || null,
                id_apoderado: resolved_id_apoderado,
                id_grupo_teoria: Number(form.id_grupo_teoria),
                fecha_ingreso: form.fecha_ingreso,
                nombre: form.nombre,
                apellido_paterno: form.apellido_paterno,
                apellido_materno: form.apellido_materno,
                telefono: form.telefono,
                direccion: form.direccion,
                diagnostico_ne: form.diagnostico_ne,
                correo: form.correo,
                password: form.password,
                id_rol: 3,
            };

            // ensure telefono has +569 prefix
            if (payload.telefono && !String(payload.telefono).startsWith('+')) payload.telefono = `+569${payload.telefono}`;
            const res = await crearAlumno(payload);
            if (res.success) {
                setMessage('Alumno creado correctamente.');
                setForm(prev => ({ ...prev, rut: '', nombre: '', apellido_paterno: '', apellido_materno: '', telefono: '', direccion: '', diagnostico_ne: '', correo: '', password: '' }));
            } else {
                setError(res.error || 'Error al crear alumno');
            }
        } catch (err: any) {
            setError(err.message ?? 'Error al crear alumno');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container py-4">
            <h2 className="mb-4">Crear Alumno</h2>

            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-4 mb-3">
                        <label className="form-label">RUT apoderado (Sin puntos con guión) - 0000000-0</label>
                        <select name="apoderado_rut" className="form-select" value={form.apoderado_rut} onChange={handleChange}>
                            <option value="">-- Ninguno --</option>
                            {apoderadosLoading ? (
                                <option disabled>Loading...</option>
                            ) : (
                                apoderados.map(a => (
                                    <option key={a.rut ?? a.id_apoderado} value={a.rut ?? ''}>{`${a.rut ?? ''}${a.nombre ? ' - ' + a.nombre : ''}`}</option>
                                ))
                            )}
                        </select>
                    </div>

                    <div className="col-md-4 mb-3">
                        <label className="form-label">Grupo teoría</label>
                        <select name="id_grupo_teoria" className="form-select" value={form.id_grupo_teoria} onChange={handleChange}>
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

                    <div className="col-md-4 mb-3">
                        <label className="form-label">Fecha ingreso</label>
                        <input name="fecha_ingreso" type="date" className="form-control" value={form.fecha_ingreso} onChange={handleChange} />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-4 mb-3">
                        <label className="form-label">RUT (Sin puntos con guion) - 00000000-0</label>
                        <input name="rut" className="form-control" value={form.rut} onChange={handleChange} placeholder="12345678-9" required />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Nombre</label>
                        <input name="nombre" className="form-control" value={form.nombre} onChange={handleChange} required />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Apellido paterno</label>
                        <input name="apellido_paterno" className="form-control" value={form.apellido_paterno} onChange={handleChange} />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Apellido materno</label>
                        <input name="apellido_materno" className="form-control" value={form.apellido_materno} onChange={handleChange} />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Teléfono</label>
                        <div className="input-group">
                            <span className="input-group-text">+569</span>
                            <input name="telefono" className="form-control" value={form.telefono} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Dirección</label>
                        <input name="direccion" className="form-control" value={form.direccion} onChange={handleChange} />
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label">Diagnóstico NE</label>
                    <input name="diagnostico_ne" className="form-control" value={form.diagnostico_ne} onChange={handleChange} />
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Correo</label>
                        <input name="correo" type="email" className="form-control" value={form.correo} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Contraseña</label>
                        <input name="password" type="password" className="form-control" value={form.password} onChange={handleChange} required />
                    </div>
                </div>

                {/* id_rol is fixed to 3 for alumnos */}

                <div className="d-flex justify-content-end">
                    <button className="btn btn-primary" type="submit" disabled={loading}>
                        {loading ? 'Creando...' : 'Crear alumno'}
                    </button>
                </div>
            </form>
        </div>
    );
}