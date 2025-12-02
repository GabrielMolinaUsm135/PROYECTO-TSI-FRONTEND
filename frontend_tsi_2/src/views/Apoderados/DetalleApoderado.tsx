import { useLoaderData, Link } from 'react-router-dom';
import { getApoderado } from '../../services/ApoderadoService';
import type { Apoderado } from '../../types/apoderado';

export async function loader({ params }: any) {
    const res = await getApoderado(params.id);
    return res;
}

export default function DetalleApoderado(){
    const data = useLoaderData() as { success: boolean, data?: Apoderado };
    const ap = data?.data;

    if (!ap) return <div className="container py-4">Apoderado no encontrado.</div>;

    return (
        <div className="container py-4">
            <div className="card">
                <div className="card-body">
                    <h3 className="card-title">{ap.nombre}</h3>
                    <p><strong>ID:</strong> {ap.id_apoderado}</p>
                    <p><strong>RUT:</strong> {ap.rut ?? '-'}</p>
                    <p><strong>Teléfono:</strong> {ap.telefono ?? '-'}</p>
                    <p><strong>Correo:</strong> {ap.correo ?? '-'}</p>

                    <div className="mt-3">
                        <Link to={`/Apoderados/Editar/${ap.id_apoderado}`} className="btn btn-secondary me-2">Editar</Link>
                        <Link to="/Apoderados/ListaApoderados" className="btn btn-outline-primary">Volver a la lista</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
