import { useState } from 'react';
import { useLoaderData, useNavigate, Link } from 'react-router-dom';
import { getInsumo, actualizarInsumo } from '../../services/InsumoService';
import type { Insumo } from '../../types/insumo';

export async function loader({ params }: any) {
    const id = params?.id;
    if (!id) return null;
    const insumo = await getInsumo(id);
    return insumo;
}

export default function EditarInsumo() {
    const insumo = useLoaderData() as Insumo | null;
    const navigate = useNavigate();

    const [nombre, setNombre] = useState(insumo?.nombre_insumo ?? '');
    const [observacion, setObservacion] = useState(insumo?.observacion ?? '');
    const [saving, setSaving] = useState(false);

    if (!insumo) {
        return (
            <div className="container py-5">
                <div className="alert alert-warning">Insumo no encontrado.</div>
                <Link to="/ListaInsumos" className="btn btn-secondary">Volver a lista</Link>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const res = await actualizarInsumo(insumo.cod_insumo, {
            nombre_insumo: nombre,
            observacion,
        });
        setSaving(false);
        if (!res.success) {
            const msg = typeof res.error === 'string' ? res.error : JSON.stringify(res.error);
            alert('Error al actualizar insumo: ' + msg);
            return;
        }
        navigate(`/Insumos/Detalle/${insumo.cod_insumo}`);
    };

    return (
        <div className="container py-4">
            <div className="row mb-3">
                <div className="col">
                    <h2>Editar Insumo</h2>
                    <small className="text-muted">Código: <strong>{insumo.cod_insumo}</strong></small>
                </div>
                <div className="col-auto">
                    <Link to={`/Insumos/Detalle/${insumo.cod_insumo}`} className="btn btn-outline-secondary">Ver</Link>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                </div>

                <div className="mb-3">
                    <label className="form-label">Observación</label>
                    <textarea className="form-control" rows={4} value={observacion} onChange={(e) => setObservacion(e.target.value)} />
                </div>

                <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Guardando...' : 'Guardar cambios'}</button>
                    <Link to="/ListaInsumos" className="btn btn-secondary">Cancelar</Link>
                </div>
            </form>
        </div>
    );
}
