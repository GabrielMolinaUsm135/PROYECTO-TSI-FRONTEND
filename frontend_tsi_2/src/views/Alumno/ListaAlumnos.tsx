import { useState } from "react";
import { alumnoEliminar, getListaAlumnos } from "../../services/AlumnoService";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import type { ListaAlumno } from "../../types/alumno";
import ListaAlumnoFila from "../../components/ListaAlumnoFila";

export async function loader() {
    const alumnos = await getListaAlumnos();
    return alumnos;
}

export default function ListaAlumnos() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRut, setSelectedRut] = useState<string | null>(null); // State to store the selected rut
    const [nameOrder, setNameOrder] = useState<'none' | 'asc' | 'desc'>('asc');
    const [apellidoOrder, setApellidoOrder] = useState<'none' | 'asc' | 'desc'>('none');
    const [letterFilter, setLetterFilter] = useState<string>('');
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
    console.log('👥 Datos de alumnos recibidos en componente:', alumnos);
    
    // Validación defensiva para asegurar que alumnos sea un array
    const alumnosValidos = Array.isArray(alumnos) ? alumnos : [];
    console.log('✅ Alumnos válidos para mostrar:', alumnosValidos, 'Cantidad:', alumnosValidos.length);
    
    let activeField: 'nombre' | 'apellido_paterno' = 'nombre';
    let activeOrder: 'asc' | 'desc' = 'asc';
    if (nameOrder !== 'none') {
        activeField = 'nombre';
        activeOrder = nameOrder as 'asc' | 'desc';
    } else if (apellidoOrder !== 'none') {
        activeField = 'apellido_paterno';
        activeOrder = apellidoOrder as 'asc' | 'desc';
    } else {
        activeField = 'nombre';
        activeOrder = 'asc';
    }

    const filteredAlumnos = letterFilter && letterFilter.length === 1
        ? alumnosValidos.filter(a => (a.nombre ?? '').toString().toUpperCase().startsWith(letterFilter))
        : alumnosValidos;

    const sortedAlumnos = [...filteredAlumnos].sort((a, b) => {
        const aVal = (a[activeField] ?? '').toString();
        const bVal = (b[activeField] ?? '').toString();
        const cmp = aVal.localeCompare(bVal, 'es', { sensitivity: 'base' });
        return activeOrder === 'asc' ? cmp : -cmp;
    });

    return (
        <>
            <div className="row bg-primary text-white py-3 mb-5">
                <div className="col text-center">
                    <h1>Lista de Alumnos</h1>
                </div>
            </div>
            <div className="container">
                <div className="row mb-3">
                    <div className="col-md-3">
                      <label htmlFor="letterFilter" className="form-label">Filtrar por inicial</label>
                        <select id="letterFilter" className="form-select" value={letterFilter} onChange={e => setLetterFilter(e.target.value)}>
                            <option value="">Todos</option>
                            {Array.from({ length: 26 }).map((_, i) => {
                             const letter = String.fromCharCode(65 + i); // A..Z
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
                        <Link to="/CrearAlumno" className="btn btn-primary">Crear alumno</Link>
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
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedAlumnos.map((alumno) => (
                                <ListaAlumnoFila
                                    key={alumno.rut}
                                    alumno={alumno}
                                    openModal={() => openModal(alumno.rut)} // Pass the rut to openModal
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