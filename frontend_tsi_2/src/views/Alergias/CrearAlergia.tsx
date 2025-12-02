import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { crearAlergia } from '../../services/AlergiaService';

export default function CrearAlergia(){
    const navigate = useNavigate();
    const [nombre, setNombre] = useState('');
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nombre.trim()) { alert('Nombre es requerido'); return; }
        setSaving(true);
        const res = await crearAlergia({ nombre_alergia: nombre });
        setSaving(false);
        if (!res.success) { alert('Error al crear: ' + (typeof res.error === 'string' ? res.error : JSON.stringify(res.error))); return; }
        navigate('/Alergias/ListaAlergias');
    };

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Crear Alergia</h2>
                <Link to="/Alergias/ListaAlergias" className="btn btn-outline-secondary">Volver</Link>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input className="form-control" value={nombre} onChange={e => setNombre(e.target.value)} />
                </div>

                <div className="d-flex gap-2">
                    <button className="btn btn-primary" disabled={saving}>{saving ? 'Creando...' : 'Crear'}</button>
                    <Link to="/Alergias/ListaAlergias" className="btn btn-secondary">Cancelar</Link>
                </div>
            </form>
        </div>
    );
}
