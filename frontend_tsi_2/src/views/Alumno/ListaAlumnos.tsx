import { useState } from "react"
import { getListaAlumnos } from "../../services/AlumnoService"
import { useLoaderData } from "react-router-dom"
import type { ListaAlumno } from "../../types/alumno"
import ListaAlumnoFila from "../../components/ListaAlumnoFila"

export async function loader() {
    const alumnos = await getListaAlumnos()
    return alumnos
    
}

export default function ListaAlumnos() {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const openModal = () => setIsModalOpen(true)
    const closeModal = () => setIsModalOpen(false)

    const alumnos = useLoaderData() as ListaAlumno[]
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
                                <ListaAlumnoFila key={alumno.rut_alumno} alumno={alumno} openModal={openModal} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal fade show d-block" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">ALERTA</h5>
                                <button type="button" className="close" onClick={closeModal} aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                ¿Está seguro que desea eliminar este alumno?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cerrar</button>
                                <button type="button" className="btn btn-danger">Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}