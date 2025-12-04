import type { ListaAlumno } from "../types/alumno"

type ListaAlumnoFilaProps = {
    alumno: ListaAlumno
    openModal: () => void
    canDelete?: boolean
}

export default function ListaAlumnoFila({alumno, openModal, canDelete = true}: ListaAlumnoFilaProps) {
    return (
        <tr>
            <td>{alumno.rut}</td>
            <td>{alumno.nombre}</td>
            <td>{alumno.apellido_paterno}</td>
            <td>{alumno.apellido_materno}</td>
            <td>
                <div className="d-flex gap-2">
                    {/* prefer linking by primary id if available, fall back to rut */}
                    <a href={`/Alumno/Ficha/${(alumno as any).id_alumno ?? alumno.rut}`} className="btn btn-secondary btn-sm">Ver</a>
                    <a href={`/Alumno/EditarAlumno/${alumno.rut}`} className="btn btn-primary btn-sm">Editar</a>
                    <button 
                        type="button" 
                        className="btn btn-sm btn-danger" 
                        onClick={openModal}
                        disabled={!canDelete}
                        title={canDelete ? 'Eliminar alumno' : 'No se puede eliminar: tiene préstamos pendientes'}
                    >
                        Eliminar
                    </button>
                </div>
            </td>
        </tr>
    )
        
}