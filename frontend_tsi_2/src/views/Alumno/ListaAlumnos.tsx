import { useState } from "react";
import { alumnoEliminar, getListaAlumnos } from "../../services/AlumnoService";
import { useLoaderData, useNavigate } from "react-router-dom";
import type { ListaAlumno } from "../../types/alumno";
import ListaAlumnoFila from "../../components/ListaAlumnoFila";

export async function loader() {
    const alumnos = await getListaAlumnos();
    return alumnos;
}

export default function ListaAlumnos() {
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
            await alumnoEliminar(selectedRut); // Delete the alumno with the selected rut
            closeModal(); // Close the modal after deletion
            navigate('/Alumno/ListaAlumnos'); // Redirect to the same page to refresh the list
        }
    };

    const alumnos = useLoaderData() as ListaAlumno[];
    return (
        <>
            <div className="row bg-primary text-white py-3 mb-5">
                <div className="col text-center">
                    <h1>Lista de Alumnos</h1>
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
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {alumnos.map((alumno) => (
                                <ListaAlumnoFila
                                    key={alumno.rut_alumno}
                                    alumno={alumno}
                                    openModal={() => openModal(alumno.rut_alumno)} // Pass the rut to openModal
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
                                ¿Está seguro que desea eliminar este alumno con rut{" "}
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