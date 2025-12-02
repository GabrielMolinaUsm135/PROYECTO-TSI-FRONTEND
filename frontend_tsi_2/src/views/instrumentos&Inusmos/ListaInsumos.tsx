import { useState } from 'react';
import { useLoaderData, useNavigate, Link } from 'react-router-dom';
import type { ListaInsumo } from '../../types/insumo';
import { getListaInsumos, insumoEliminar } from '../../services/InsumoService';

export async function loader() {
    const insumos = await getListaInsumos();
    return insumos;
}

export default function ListaInsumos(){
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCod, setSelectedCod] = useState<string | null>(null);
    const navigate = useNavigate();

    const openModal = (cod: string) => { setSelectedCod(cod); setIsModalOpen(true); };
    const closeModal = () => { setIsModalOpen(false); setSelectedCod(null); };

    const handleDelete = async () => {
        if (!selectedCod) return;
        const res = await insumoEliminar(selectedCod);
        if (!res.success) {
            alert('Error al eliminar insumo: ' + (typeof res.error === 'string' ? res.error : JSON.stringify(res.error)));
            return;
        }
        closeModal();
        navigate('/ListaInsumos');
    };

    const insumos = useLoaderData() as ListaInsumo[];
    const insumosValidos = Array.isArray(insumos) ? insumos : [];

    return(
        <>
            <div className="row bg-primary text-white py-3 mb-5">
                <div className="col text-center">
                    <h1>Lista de Insumos</h1>
                </div>
            </div>

            <div className="container">
                <div className="row">
                    {insumosValidos.length === 0 ? (
                        <div className="col-12 py-5 text-center text-muted">No hay insumos para mostrar.</div>
                    ) : (
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Nombre</th>
                                    <th>Observación</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {insumosValidos.map((it) => (
                                        <tr key={it.cod_insumo}>
                                        <td>{it.cod_insumo}</td>
                                        <td>
                                            {it.nombre_insumo}                                            
                                        </td>
                                        <td>{it.observacion}</td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <Link to={`/Insumos/Detalle/${it.cod_insumo}`} className="btn btn-sm btn-outline-primary">Ver</Link>
                                                <Link to={`/Insumos/Editar/${it.cod_insumo}`} className="btn btn-sm btn-outline-secondary">Editar</Link>
                                                <button className="btn btn-sm btn-danger" onClick={() => openModal(it.cod_insumo)}>Eliminar</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div className="modal fade show d-block" tabIndex={-1} role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirmar eliminación</h5>
                                <button type="button" className="close" onClick={closeModal} aria-label="Close"><span aria-hidden="true">×</span></button>
                            </div>
                            <div className="modal-body">¿Está seguro que desea eliminar el insumo con código {selectedCod}?</div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cerrar</button>
                                <button type="button" className="btn btn-danger" onClick={handleDelete}>Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}