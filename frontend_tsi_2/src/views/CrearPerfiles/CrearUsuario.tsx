import { useState } from 'react';
import { crearUsuario } from '../../services/UsuarioService';

export default function CrearUsuario() {
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        if (!correo || !password) {
            setError('Correo y contraseña son obligatorios.');
            return;
        }

        setLoading(true);
        try {
            const svcPayload: Record<string, FormDataEntryValue> = { correo, password, id_rol: 3 } as any;
            const res = await crearUsuario(svcPayload);
            if (res.success) {
                setMessage('Usuario creado correctamente.');
                setCorreo('');
                setPassword('');
            } else {
                if (res.error === 'validation') {
                    setError('Datos inválidos: ' + JSON.stringify(res.detalle));
                } else {
                    setError(res.error || 'Error al crear usuario');
                }
            }
        } catch (err: any) {
            console.error('Error creating usuario', err);
            setError(err.message ?? 'Error al crear usuario');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-4">
            <h2 className="mb-4">Crear Administrador</h2>

            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Correo</label>
                        <input
                            name="correo"
                            type="email"
                            className="form-control"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            required
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label className="form-label">Contraseña</label>
                        <input
                            name="password"
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="d-flex justify-content-end">
                    <button className="btn btn-primary" type="submit" disabled={loading}>
                        {loading ? 'Creando...' : 'Crear'}
                    </button>
                </div>
            </form>
        </div>
    );
}