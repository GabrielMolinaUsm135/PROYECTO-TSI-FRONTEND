import { useLoaderData, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { getAlergia, actualizarAlergia } from '../../services/AlergiaService';
import type { ListaAlergia } from '../../types/alergia';

export async function loader({ params }: any) {
    const id = params?.id;
    if (!id) return null;
    const a = await getAlergia(id);
    return a;
}

export default function EditarAlergia(){
    const a = useLoaderData() as ListaAlergia | null;
    const navigate = useNavigate();
    const [nombre, setNombre] = useState(a?.nombre_alergia ?? '');
    const [saving, setSaving] = useState(false);

    if (!a) return (<div className="container py-5"><div className="alert alert-warning">Alergia no encontrada.</div></div>);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const res = await actualizarAlergia(a.cod_alergia, { nombre_alergia: nombre });
        setSaving(false);
        if (!res.success) { alert('Error al actualizar: ' + (typeof res.error === 'string' ? res.error : JSON.stringify(res.error))); return; }
        navigate(`/Alergias/Detalle/${a.cod_alergia}`);
    };

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Editar Alergia</h2>
                <Link to={`/Alergias/Detalle/${a.cod_alergia}`} className="btn btn-outline-secondary">Ver</Link>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input className="form-control" value={nombre} onChange={e => setNombre(e.target.value)} />
                </div>

                <div className="d-flex gap-2">
                    <button className="btn btn-primary" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
                    <Link to="/Alergias/ListaAlergias" className="btn btn-secondary">Cancelar</Link>
                </div>
            </form>
        </div>
    );
}
