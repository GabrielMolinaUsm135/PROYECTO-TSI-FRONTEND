import type { ListaAlumno } from "../types/alumno"

type ListaAlumnoFilaProps = {
    alumno: ListaAlumno
    openModal: (alumno: ListaAlumno) => void
}

export default function ListaAlumnoFila({alumno, openModal}: ListaAlumnoFilaProps) {
    return (
        <tr>
            <td>{alumno.rut_alumno}</td>
            <td>{alumno.nombre_alumno}</td>
            <td>{alumno.apellido_paterno}</td>
            <td>{alumno.apellido_materno}</td>
            <td>
                <div className="d-flex gap-2">
                    <a href="/Alumno/EditarAlumno" className="btn btn-primary btn-sm">Editar</a>
                    <button 
                        type="button" 
                        className="btn btn-sm btn-danger" 
                        onClick={() => openModal(alumno)}
                    >
                        Eliminar
                    </button>
                    <a href={`/Alumno/Ficha/${alumno.rut_alumno}`} className="btn btn-secondary btn-sm">Ver</a>
                </div>
            </td>
        </tr>
    )
        
}