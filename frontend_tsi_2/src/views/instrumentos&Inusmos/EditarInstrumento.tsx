import { useState } from 'react';
import { useLoaderData, useNavigate, Link } from 'react-router-dom';
import { getInstrumento, actualizarInstrumento } from '../../services/InstrumentoService';
import type { Instrumento } from '../../types/instrumento';

export async function loader({ params }: any) {
    const id = params?.id;
    if (!id) return null;
    const instrumento = await getInstrumento(id);
    return instrumento;
}

export default function EditarInstrumento() {
    const instrumento = useLoaderData() as Instrumento | null;
    const navigate = useNavigate();

    const [nombre, setNombre] = useState(instrumento?.nombre_instrumento ?? '');
    const [modelo, setModelo] = useState(instrumento?.modelo_instrumento ?? '');
    const [tamano, setTamano] = useState(instrumento?.tamano ?? '');
    const [observacion, setObservacion] = useState(instrumento?.observacion ?? '');
    const [saving, setSaving] = useState(false);

    if (!instrumento) {
        return (
            <div className="container py-5">
                <div className="alert alert-warning">Instrumento no encontrado.</div>
                <Link to="/Instrumentos/ListaInstrumentos" className="btn btn-secondary">Volver a lista</Link>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const res = await actualizarInstrumento(instrumento.cod_instrumento, {
            nombre_instrumento: nombre,
            modelo_instrumento: modelo,
            tamano,
            observacion,
        });
        setSaving(false);
        if (!res.success) {
            const msg = typeof res.error === 'string' ? res.error : JSON.stringify(res.error);
            alert('Error al actualizar instrumento: ' + msg);
            return;
        }
        // navigate to detail view after successful update
        navigate(`/Instrumentos/Detalle/${instrumento.cod_instrumento}`);
    };

    return (
        <div className="container py-4">
            <div className="row mb-3">
                <div className="col">
                    <h2>Editar Instrumento</h2>
                    <small className="text-muted">Código: <strong>{instrumento.cod_instrumento}</strong></small>
                </div>
                <div className="col-auto">
                    <Link to={`/Instrumentos/Detalle/${instrumento.cod_instrumento}`} className="btn btn-outline-secondary">Ver</Link>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                </div>

                <div className="mb-3">
                    <label className="form-label">Modelo</label>
                    <input className="form-control" value={modelo} onChange={(e) => setModelo(e.target.value)} />
                </div>

                <div className="mb-3">
                    <label className="form-label">Tamaño</label>
                    <input className="form-control" value={tamano} onChange={(e) => setTamano(e.target.value)} />
                </div>

                <div className="mb-3">
                    <label className="form-label">Observación</label>
                    <textarea className="form-control" rows={4} value={observacion} onChange={(e) => setObservacion(e.target.value)} />
                </div>

                <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Guardando...' : 'Guardar cambios'}</button>
                    <Link to="/Instrumentos/ListaInstrumentos" className="btn btn-secondary">Cancelar</Link>
                </div>
            </form>
        </div>
    );
}
