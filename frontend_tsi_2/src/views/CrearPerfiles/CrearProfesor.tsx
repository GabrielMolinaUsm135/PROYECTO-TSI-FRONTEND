import { useState } from 'react';
import { crearProfesor } from '../../services/ProfesorService';

export default function CrearProfesor() {
    const [form, setForm] = useState({
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        telefono: '',
        direccion: '',
        asignatura: '',
        correo: '',
        password: '',
        id_rol: 2,
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setMessage(null);
        setError(null);

        // minimal validation
        if (!form.nombre || !form.correo || !form.password) {
            setError('Nombre, correo y contraseña son obligatorios.');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                nombre: form.nombre,
                apellido_paterno: form.apellido_paterno,
                apellido_materno: form.apellido_materno,
                telefono: form.telefono,
                direccion: form.direccion,
                asignatura: form.asignatura,
                correo: form.correo,
                password: form.password,
                id_rol: 2,
            };

            const res = await crearProfesor(payload);
            if (res.success) {
                setMessage('Profesor creado correctamente.');
                setForm({ nombre: '', apellido_paterno: '', apellido_materno: '', telefono: '', direccion: '', asignatura: '', correo: '', password: '', id_rol: 2 });
            } else {
                setError(res.error || 'Error al crear profesor');
            }
        } catch (err: any) {
            setError(err.message ?? 'Error al crear profesor');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container py-4">
            <h2 className="mb-4">Crear Profesor</h2>

            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="row">
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
                    <label className="form-label">Asignatura</label>
                    <input name="asignatura" className="form-control" value={form.asignatura} onChange={handleChange} />
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

                <div className="d-flex justify-content-end">
                    <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Creando...' : 'Crear profesor'}</button>
                </div>
            </form>
        </div>
    );
}