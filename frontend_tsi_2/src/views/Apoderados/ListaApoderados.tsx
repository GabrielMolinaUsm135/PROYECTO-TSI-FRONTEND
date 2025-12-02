import { useState } from 'react';
import { useLoaderData, Link, useNavigate } from 'react-router-dom';
import type { ListaApoderado } from '../../types/apoderado';
import { getListaApoderados, eliminarApoderado } from '../../services/ApoderadoService';

export async function loader() {
    const items = await getListaApoderados();
    return items;
}

export default function ListaApoderados(){
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | string | null>(null);
    const navigate = useNavigate();

    const openModal = (id: number | string) => { setSelectedId(id); setIsModalOpen(true); };
    const closeModal = () => { setSelectedId(null); setIsModalOpen(false); };

    const handleDelete = async () => {
        if (!selectedId) return;
        const res = await eliminarApoderado(selectedId);
        if (!res.success) {
            alert('Error al eliminar apoderado: ' + (typeof res.error === 'string' ? res.error : JSON.stringify(res.error)));
            return;
        }
        closeModal();
        navigate('/Apoderados/ListaApoderados');
    };

    const items = useLoaderData() as ListaApoderado[];
    const valid = Array.isArray(items) ? items : [];

    return (
        <><div className="row bg-primary text-white py-3 mb-5">
                <div className="col text-center">
                    <h1>Lista de Apoderados</h1>
                </div>
            </div>
        <div className="container py-4">
            <div className="row mb-3">
                <div className="col text-end">
                    <Link to="/Apoderados/CrearApoderado" className="btn btn-primary">Crear apoderado</Link>
                </div>
            </div>

            {valid.length === 0 ? (
                <div className="text-muted">No hay apoderados.</div>
            ) : (
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>RUT</th>
                            <th>Nombre</th>
                            <th>Teléfono</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {valid.map((it, idx) => (
                            <tr key={it.id_apoderado ?? it.rut ?? `ap-${idx}`}>
                                <td>{it.rut ?? '-'}</td>
                                <td>{it.nombre}</td>
                                <td>{it.telefono ?? '-'}</td>
                                <td>
                                    <div className="d-flex gap-2">
                                        <Link to={`/Apoderados/Detalle/${it.id_apoderado}`} className="btn btn-sm btn-outline-primary">Ver</Link>
                                        <Link to={`/Apoderados/Editar/${it.id_apoderado}`} className="btn btn-sm btn-outline-secondary">Editar</Link>
                                        <button className="btn btn-sm btn-danger" onClick={() => openModal(it.id_apoderado ?? '')}>Eliminar</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {isModalOpen && (
                <div className="modal fade show d-block" tabIndex={-1} role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirmar eliminación</h5>
                                <button type="button" className="close" onClick={closeModal} aria-label="Close"><span aria-hidden="true">×</span></button>
                            </div>
                            <div className="modal-body">¿Está seguro que desea eliminar el apoderado con código {selectedId}?</div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cerrar</button>
                                <button type="button" className="btn btn-danger" onClick={handleDelete}>Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </>
    );
}
