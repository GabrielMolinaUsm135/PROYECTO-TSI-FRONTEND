import { useState, useEffect } from 'react';
import { crearAlumno, existeRut } from '../../services/AlumnoService';
import axiosInstance from '../../services/axiosinstance';

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
    const [apoderados, setApoderados] = useState<string[]>([]);
    const [apoderadosLoading, setApoderadosLoading] = useState(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    }

    useEffect(() => {
        // fetch apoderados ruts for the select
        let mounted = true;
        async function fetchRuts() {
            setApoderadosLoading(true);
            try {
                const res = await axiosInstance.get('/apoderados/ruts');
                const data = res.data?.data ?? res.data ?? [];
                // data may be array of strings or objects { rut }
                const ruts = (Array.isArray(data) ? data : []).map((it: any) => typeof it === 'string' ? it : it.rut ?? String(it));
                if (mounted) setApoderados(ruts);
            } catch (err) {
                console.warn('No se pudieron obtener los RUTs de apoderados', err);
            } finally {
                if (mounted) setApoderadosLoading(false);
            }
        }
        fetchRuts();
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
            // prepare payload matching backend shape (convert empty id_apoderado to null, numeric fields)
            const payload: Record<string, any> = {
                // include both keys to be compatible with different backend expectations
                rut: form.rut,
                rut_alumno: form.rut,
                // backend may accept rut_apoderado; keep id_apoderado=null to avoid mismatches
                rut_apoderado: form.apoderado_rut || null,
                id_apoderado: null,
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
                        <label className="form-label">Apoderado (RUT) (opcional)</label>
                        <select name="apoderado_rut" className="form-select" value={form.apoderado_rut} onChange={handleChange}>
                            <option value="">-- Ninguno --</option>
                            {apoderadosLoading ? (
                                <option disabled>Loading...</option>
                            ) : (
                                apoderados.map(r => <option key={r} value={r}>{r}</option>)
                            )}
                        </select>
                    </div>

                    <div className="col-md-4 mb-3">
                        <label className="form-label">Grupo teoría (id)</label>
                        <input name="id_grupo_teoria" type="number" className="form-control" value={form.id_grupo_teoria} onChange={handleChange} />
                    </div>

                    <div className="col-md-4 mb-3">
                        <label className="form-label">Fecha ingreso</label>
                        <input name="fecha_ingreso" type="date" className="form-control" value={form.fecha_ingreso} onChange={handleChange} />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-4 mb-3">
                        <label className="form-label">RUT</label>
                        <input name="rut" className="form-control" value={form.rut} onChange={handleChange} placeholder="12.345.678-9" required />
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
                        <input name="telefono" className="form-control" value={form.telefono} onChange={handleChange} />
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