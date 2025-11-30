import { useState } from 'react';
import { useLoaderData, useNavigate, Link } from 'react-router-dom';
import { getListaInstrumentos, instrumentoEliminar } from '../../services/InstrumentoService';
import type { ListaInstrumento } from '../../types/instrumento';

export async function loader() {
    const instrumentos = await getListaInstrumentos();
    return instrumentos;
}

export default function ListaInstrumentos() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCod, setSelectedCod] = useState<string | null>(null);
    const navigate = useNavigate();

    const openModal = (cod: string) => {
        setSelectedCod(cod);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCod(null);
    };

    const handleDelete = async () => {
        if (!selectedCod) return;
        const res = await instrumentoEliminar(selectedCod);
        if (!res.success) {
            alert('Error al eliminar instrumento: ' + (typeof res.error === 'string' ? res.error : JSON.stringify(res.error)));
            return;
        }
        closeModal();
        navigate('/Instrumentos/ListaInstrumentos');
    };

    const instrumentos = useLoaderData() as ListaInstrumento[];
    const instrumentosValidos = Array.isArray(instrumentos) ? instrumentos : [];

    return (
        <>
            <div className="row bg-primary text-white py-3 mb-5">
                <div className="col text-center">
                    <h1>Lista de Instrumentos</h1>
                </div>
            </div>

            <div className="container">
                <div className="row">
                    {instrumentosValidos.length === 0 ? (
                        <div className="col-12 py-5 text-center text-muted">No hay instrumentos para mostrar.</div>
                    ) : (
                        <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Nombre</th>
                                <th>Modelo</th>
                                <th>Tamaño</th>
                                <th>Observación</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {instrumentosValidos.map((inst) => (
                                <tr key={inst.cod_instrumento}>
                                    <td>{inst.cod_instrumento}</td>
                                    <td>{inst.nombre_instrumento}</td>
                                    <td>{inst.modelo_instrumento}</td>
                                    <td>{inst.tamano}</td>
                                    <td>{inst.observacion}</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <Link className="btn btn-sm btn-outline-primary" to={`/Instrumentos/Detalle/${inst.cod_instrumento}`}>Ver</Link>
                                            <Link className="btn btn-sm btn-outline-secondary" to={`/Instrumentos/Editar/${inst.cod_instrumento}`}>Editar</Link>
                                            <button className="btn btn-sm btn-danger" onClick={() => openModal(inst.cod_instrumento)}>Eliminar</button>
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
                <div
                    className="modal fade show d-block"
                    tabIndex={-1}
                    role="dialog"
                    aria-labelledby="deleteInstrumentoLabel"
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="deleteInstrumentoLabel">Confirmar eliminación</h5>
                                <button type="button" className="close" onClick={closeModal} aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                ¿Está seguro que desea eliminar el instrumento con código {selectedCod}?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cerrar</button>
                                <button type="button" className="btn btn-danger" onClick={handleDelete}>Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
