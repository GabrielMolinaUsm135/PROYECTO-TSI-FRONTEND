import {useState} from 'react';
import { getListaProfesor, ProfesorEliminar } from '../../services/ProfesorService';
import { useLoaderData, useNavigate } from 'react-router';
import type { ListaProfesor } from '../../types/profesor';
import ListaProfesorFila from '../../components/ListaProfesorFila';
import { Link } from 'react-router-dom';

export async function loader() { 
    const profesores = await getListaProfesor();
    return profesores;
}



export default function ListaProfesores() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProfesor, setSelectedProfesor] = useState<ListaProfesor | null>(null); // store selected profesor object
    const [nameOrder, setNameOrder] = useState<'none' | 'asc' | 'desc'>('none');
    const [apellidoOrder, setApellidoOrder] = useState<'none' | 'asc' | 'desc'>('none');
    const [letterFilter, setLetterFilter] = useState<string>('');
    const navigate = useNavigate(); // React Router's navigation hook

    const openModal = (profesor: ListaProfesor) => {
        setSelectedProfesor(profesor);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProfesor(null);
    };

    const handleDelete = async () => {
        if (!selectedProfesor) return;
        // prefer deleting by primary id if available
        const idToDelete = (selectedProfesor as any).id_profesor ?? (selectedProfesor.rut as string);
        const idUsuario = (selectedProfesor as any).id_usuario ?? undefined;
        console.debug('Eliminar: selectedProfesor=', selectedProfesor, 'idToDelete=', idToDelete, 'idUsuario=', idUsuario);
        try {
            let targetId: string | number = idToDelete;

            // if idToDelete looks like a non-numeric rut, try to resolve real id_profesor from the server
            if (typeof targetId === 'string' && !/^\d+$/.test(targetId)) {
                try {
                    const listaActual = await getListaProfesor();
                    const encontrado = (listaActual as any[]).find(p => p.rut === targetId || String(p.rut) === String(targetId));
                    if (encontrado && (encontrado as any).id_profesor) {
                        console.debug('Resolved id_profesor from rut:', (encontrado as any).id_profesor);
                        targetId = (encontrado as any).id_profesor;
                    }
                } catch (resolveErr) {
                    console.warn('No se pudo resolver id_profesor desde listaActual', resolveErr);
                }
            }

            const result = await ProfesorEliminar(targetId, idUsuario);
            console.debug('ProfesorEliminar result=', result);
            if (result && (result as any).success === false) {
                // fatal error
                const err = (result as any).error;
                alert('Error al eliminar profesor: ' + (typeof err === 'object' ? JSON.stringify(err) : String(err)));
                return;
            }

            // if professor deleted but user deletion failed, show warning but continue
            if (result && (result as any).success === true && (result as any).userDeleted === false) {
                const warning = (result as any).warning ?? 'Profesor eliminado, pero fallo al eliminar usuario asociado.';
                const details = (result as any).details;
                let detailsText = '';
                try {
                    if (Array.isArray(details)) {
                        detailsText = details.map((d:any) => `\n- ${d.url} (status: ${d.status ?? 'unknown'}) -> ${d.error}`).join('');
                    } else if (typeof details === 'string') detailsText = '\n' + details;
                } catch(e) { detailsText = '' }
                alert(warning + detailsText);
            }

            // success (or partial success) — close modal and refresh
            closeModal(); // Close the modal after deletion
            navigate('/Profesor/ListaProfesores'); // Redirect to the same page to refresh the list
        } catch (err:any) {
            console.error('Error in handleDelete:', err);
            alert('Error inesperado al eliminar profesor. Revisa la consola.');
        }
    };

    const Profesores = useLoaderData() as ListaProfesor[];
    console.log('👥 Datos de profesores recibidos en componente:', Profesores);
    
    // Validación defensiva para asegurar que profesores sea un array
    const profesoresValidos = Array.isArray(Profesores) ? Profesores : [];
    console.log('✅ Profesores válidos para mostrar:', profesoresValidos, 'Cantidad:', profesoresValidos.length);
    
    // determine active sort field and order
    let activeField: 'nombre' | 'apellido_paterno' = 'nombre';
    let activeOrder: 'asc' | 'desc' = 'asc';
    if (nameOrder !== 'none') {
        activeField = 'nombre';
        activeOrder = nameOrder as 'asc' | 'desc';
    } else if (apellidoOrder !== 'none') {
        activeField = 'apellido_paterno';
        activeOrder = apellidoOrder as 'asc' | 'desc';
    }

    // apply letter filter on nombre
    const filteredProfesores = letterFilter && letterFilter.length === 1
        ? profesoresValidos.filter(p => (p.nombre ?? '').toString().toUpperCase().startsWith(letterFilter))
        : profesoresValidos;

    const sortedProfesores = [...filteredProfesores].sort((a, b) => {
        const aVal = (a[activeField] ?? '').toString();
        const bVal = (b[activeField] ?? '').toString();
        const cmp = aVal.localeCompare(bVal, 'es', { sensitivity: 'base' });
        return activeOrder === 'asc' ? cmp : -cmp;
    });
    
    return (
        <>
            <div className="row bg-primary text-white py-3 mb-5">
                <div className="col text-center">
                    <h1>Lista de Profesores</h1>
                </div>
            </div>
            <div className="container">
                <div className="row mb-3">
                    <div className="col-md-3">
                        <label htmlFor="letterFilter" className="form-label">Filtrar por inicial (nombre)</label>
                        <select id="letterFilter" className="form-select" value={letterFilter} onChange={e => setLetterFilter(e.target.value)}>
                            <option value="">Todos</option>
                            {Array.from({ length: 26 }).map((_, i) => {
                                const letter = String.fromCharCode(65 + i);
                                return <option key={letter} value={letter}>{letter}</option>;
                            })}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="nameOrder" className="form-label">Ordenar por nombre</label>
                        <select id="nameOrder" className="form-select" value={nameOrder} onChange={e => { setNameOrder(e.target.value as 'none' | 'asc' | 'desc'); setApellidoOrder('none'); }}>
                            <option value="none">--</option>
                            <option value="asc">A - Z</option>
                            <option value="desc">Z - A</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="apellidoOrder" className="form-label">Ordenar por apellido</label>
                        <select id="apellidoOrder" className="form-select" value={apellidoOrder} onChange={e => { setApellidoOrder(e.target.value as 'none' | 'asc' | 'desc'); setNameOrder('none'); }}>
                            <option value="none">--</option>
                            <option value="asc">A - Z</option>
                            <option value="desc">Z - A</option>
                        </select>
                    </div>
                    <div className="col text-end">
                        <Link to="/CrearProfesor" className="btn btn-primary">Crear profesor</Link>
                    </div>
                </div>
                <div className="row">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Rut</th>
                                <th>Nombre</th>
                                <th>Apellido Paterno</th>
                                <th>Apellido Materno</th>
                                <th>Asignatura</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedProfesores.map((profesor) => (
                                <ListaProfesorFila
                                    key={profesor.rut}
                                    profesor={profesor}
                                    openModal={() => openModal(profesor)}
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
                                    {(selectedProfesor as any)?.rut}?
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