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
    const [nameOrder, setNameOrder] = useState<'none' | 'asc' | 'desc'>('none');
    const [codeOrder, setCodeOrder] = useState<'none' | 'asc' | 'desc'>('none');
    const [letterFilter, setLetterFilter] = useState<string>('');
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
        navigate('/Insumos/ListaInsumos');
    };

    const insumos = useLoaderData() as ListaInsumo[];
    const insumosValidos = Array.isArray(insumos) ? insumos : [];

    // determine active sort field and order
    let activeField: 'nombre_insumo' | 'cod_insumo' = 'nombre_insumo';
    let activeOrder: 'asc' | 'desc' = 'asc';
    if (nameOrder !== 'none') {
        activeField = 'nombre_insumo';
        activeOrder = nameOrder as 'asc' | 'desc';
    } else if (codeOrder !== 'none') {
        activeField = 'cod_insumo';
        activeOrder = codeOrder as 'asc' | 'desc';
    }

    // apply letter filter on nombre_insumo
    const filteredInsumos = letterFilter && letterFilter.length === 1
        ? insumosValidos.filter(i => (i.nombre_insumo ?? '').toString().toUpperCase().startsWith(letterFilter))
        : insumosValidos;

    const sortedInsumos = [...filteredInsumos].sort((a, b) => {
        const aVal = (a[activeField] ?? '').toString();
        const bVal = (b[activeField] ?? '').toString();
        const cmp = aVal.localeCompare(bVal, 'es', { sensitivity: 'base' });
        return activeOrder === 'asc' ? cmp : -cmp;
    });

    return(
        <>
            <div className="row bg-primary text-white py-3 mb-5">
                <div className="col text-center">
                    <h1>Lista de Insumos</h1>
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
                        <select id="nameOrder" className="form-select" value={nameOrder} onChange={e => { setNameOrder(e.target.value as 'none' | 'asc' | 'desc'); setCodeOrder('none'); }}>
                            <option value="none">--</option>
                            <option value="asc">A - Z</option>
                            <option value="desc">Z - A</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="codeOrder" className="form-label">Ordenar por código</label>
                        <select id="codeOrder" className="form-select" value={codeOrder} onChange={e => { setCodeOrder(e.target.value as 'none' | 'asc' | 'desc'); setNameOrder('none'); }}>
                            <option value="none">--</option>
                            <option value="asc">A - Z</option>
                            <option value="desc">Z - A</option>
                        </select>
                    </div>
                    <div className="col text-end">
                        <Link to="/Insumos/CrearInsumo" className="btn btn-primary">Crear insumo</Link>
                    </div>
                </div>
                <div className="row">
                    {sortedInsumos.length === 0 ? (
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
                                {sortedInsumos.map((it) => (
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