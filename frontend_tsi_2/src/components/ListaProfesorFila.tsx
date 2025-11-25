import type { ListaProfesor } from '../types/profesor';

type ListaProfesorFilaProps = {
    profesor: ListaProfesor;
    openModal: (profesor: ListaProfesor) => void;
}

export default function ListaProfesorFila({profesor, openModal}: ListaProfesorFilaProps) {
    return (
        <tr>
            <td>{profesor.rut}</td>
            <td>{profesor.nombre}</td>
            <td>{profesor.apellido_paterno}</td>
            <td>{profesor.apellido_materno}</td>
            <td>
                <div className="d-flex gap-2">
                    {/* prefer linking by primary id if available, fall back to rut */}
                    <a href={`/Profesor/Ficha/${(profesor as any).id_profesor ?? profesor.rut}`} className="btn btn-secondary btn-sm">Ver</a>
                    <a href={`/Profesor/EditarProfesor/${profesor.rut}`} className="btn btn-primary btn-sm">Editar</a>
                    <button 
                        type="button" 
                        className="btn btn-sm btn-danger" 
                        onClick={() => openModal(profesor)}
                    >
                        Eliminar
                    </button>
                </div>
            </td>
        </tr>
    )
        
}