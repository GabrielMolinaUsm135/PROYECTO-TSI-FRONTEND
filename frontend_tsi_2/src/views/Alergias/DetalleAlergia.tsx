import { useLoaderData, Link } from 'react-router-dom';
import { getAlergia } from '../../services/AlergiaService';
import type { ListaAlergia } from '../../types/alergia';

export async function loader({ params }: any) {
    const id = params?.id;
    if (!id) return null;
    const a = await getAlergia(id);
    return a;
}

export default function DetalleAlergia(){
    const a = useLoaderData() as ListaAlergia | null;
    if (!a) return (<div className="container py-5"><div className="alert alert-warning">Alergia no encontrada.</div></div>);

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Detalle Alergia</h2>
                <Link to="/Alergias/ListaAlergias" className="btn btn-outline-secondary">Volver</Link>
            </div>

            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">{a.nombre_alergia}</h5>
                    <p className="text-muted">Código: <strong>{a.cod_alergia}</strong></p>
                    <div className="mt-3">
                        <Link to={`/Alergias/Editar/${a.cod_alergia}`} className="btn btn-secondary me-2">Editar</Link>
                        <Link to="/Alergias/ListaAlergias" className="btn btn-outline-secondary">Volver a la lista</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
