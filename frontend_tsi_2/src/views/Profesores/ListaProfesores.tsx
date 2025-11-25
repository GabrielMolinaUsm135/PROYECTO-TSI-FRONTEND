import {useState} from 'react';
import { getListaProfesor, profesorEliminar } from '../../services/ProfesorService';
import { useLoaderData, useNavigate } from 'react-router';
import type { ListaProfesor } from '../../types/profesor';
import ListaProfesorFila from '../../components/ListaProfesorFila';

export async function loader() { 
    const profesores = await getListaProfesor();
    return profesores;
}



export default function ListaProfesores() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRut, setSelectedRut] = useState<string | null>(null); // State to store the selected rut
    const navigate = useNavigate(); // React Router's navigation hook

    const openModal = (rut: string) => {
        setSelectedRut(rut); // Set the selected rut
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRut(null); // Clear the selected rut
    };

    const handleDelete = async () => {
        if (selectedRut) {
            await profesorEliminar(selectedRut); // Delete the alumno with the selected rut
            closeModal(); // Close the modal after deletion
            navigate('/Profesores/ListaProfesores'); // Redirect to the same page to refresh the list
        }
    };

    const Profesores = useLoaderData() as ListaProfesor[];
    console.log('👥 Datos de profesores recibidos en componente:', Profesores);
    
    // Validación defensiva para asegurar que profesores sea un array
    const profesoresValidos = Array.isArray(Profesores) ? Profesores : [];
    console.log('✅ Profesores válidos para mostrar:', profesoresValidos, 'Cantidad:', profesoresValidos.length);
    
    return (
        <>
            <div className="row bg-primary text-white py-3 mb-5">
                <div className="col text-center">
                    <h1>Lista de Profesores</h1>
                </div>
            </div>
            <div className="container">
                <div className="row">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Rut</th>
                                <th>Nombre</th>
                                <th>Apellido Paterno</th>
                                <th>Apellido Materno</th>
                                <th>Asignatura</th>
                            </tr>
                        </thead>
                        <tbody>
                            {profesoresValidos.map((profesor) => (
                                <ListaProfesorFila
                                    key={profesor.rut}
                                    profesor={profesor}
                                    openModal={() => openModal(profesor.rut)} // Pass the rut to openModal
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div
                    className="modal fade show d-block"
                    tabIndex={-1}
                    role="dialog"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                    ALERTA
                                </h5>
                                <button
                                    type="button"
                                    className="close"
                                    onClick={closeModal}
                                    aria-label="Close"
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                ¿Está seguro que desea eliminar este Profesor con rut{" "}
                                {selectedRut}?
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={closeModal}
                                >
                                    Cerrar
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={handleDelete} // Call handleDelete to delete and redirect
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}