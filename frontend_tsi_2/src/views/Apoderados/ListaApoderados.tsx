import { useState, useEffect } from 'react';
import { useLoaderData, Link, useNavigate } from 'react-router-dom';
import type { ListaApoderado } from '../../types/apoderado';
import { getListaApoderados, eliminarApoderado } from '../../services/ApoderadoService';
import axiosInstance from '../../services/axiosinstance';

export async function loader() {
    const items = await getListaApoderados();
    return items;
}

export default function ListaApoderados(){
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | string | null>(null);
    const [nameOrder, setNameOrder] = useState<'none' | 'asc' | 'desc'>('none');
    const [rutOrder, setRutOrder] = useState<'none' | 'asc' | 'desc'>('none');
    const [letterFilter, setLetterFilter] = useState<string>('');
    const navigate = useNavigate();

    const openModal = (id: number | string) => { setSelectedId(id); setIsModalOpen(true); };
    const closeModal = () => { setSelectedId(null); setIsModalOpen(false); };

    const handleDelete = async () => {
        if (!selectedId) return;
        const res = await eliminarApoderado(selectedId);
        if (!res.success) {
            alert('Error al eliminar apoderado: ' + (typeof res.error === 'string' ? res.error : JSON.stringify(res.error)));
            return;
        }
        closeModal();
        navigate('/Apoderados/ListaApoderados');
    };

    const items = useLoaderData() as ListaApoderado[];
    const valid = Array.isArray(items) ? items : [];
    const [apoderadoHasKid, setApoderadoHasKid] = useState<Record<string | number, { hasKid: boolean; count: number }>>({});

    // when apoderado list changes, check which apoderados have hijos and cache the result
    useEffect(() => {
        let mounted = true;
        async function fetchHasKids() {
            const ids = Array.from(new Set(valid.map(a => a.id_apoderado).filter(Boolean)));
            if (ids.length === 0) {
                if (mounted) setApoderadoHasKid({});
                return;
            }
            const map: Record<string | number, { hasKid: boolean; count: number }> = {};
            await Promise.all(ids.map(async (id) => {
                try {
                    const res = await axiosInstance.get(`/apoderados/${encodeURIComponent(String(id))}/tiene-hijo`);
                    const data = res.data?.data ?? res.data ?? null;
                    const hasKid = data?.hasKid ?? data?.has_kid ?? false;
                    const count = Number(data?.count ?? 0) || 0;
                    map[id] = { hasKid: Boolean(hasKid), count };
                } catch (err) {
                    console.warn('Could not fetch tiene-hijo for apoderado', id, err);
                    map[id] = { hasKid: false, count: 0 };
                }
            }));
            if (mounted) setApoderadoHasKid(map);
        }
        fetchHasKids();
        return () => { mounted = false; };
    }, [valid]);

    // determine active sort field and order
    let activeField: 'nombre' | 'rut' = 'nombre';
    let activeOrder: 'asc' | 'desc' = 'asc';
    if (nameOrder !== 'none') {
        activeField = 'nombre';
        activeOrder = nameOrder as 'asc' | 'desc';
    } else if (rutOrder !== 'none') {
        activeField = 'rut';
        activeOrder = rutOrder as 'asc' | 'desc';
    }

    const filteredApoderados = letterFilter && letterFilter.length === 1
        ? valid.filter(a => (a.nombre ?? '').toString().toUpperCase().startsWith(letterFilter))
        : valid;

    const sortedApoderados = [...filteredApoderados].sort((a, b) => {
        const aVal = (a[activeField] ?? '').toString();
        const bVal = (b[activeField] ?? '').toString();
        const cmp = aVal.localeCompare(bVal, 'es', { sensitivity: 'base' });
        return activeOrder === 'asc' ? cmp : -cmp;
    });

    return (
        <><div className="row bg-primary text-white py-3 mb-5">
                <div className="col text-center">
                    <h1>Lista de Apoderados</h1>
                </div>
            </div>
        <div className="container py-4">
            <div className="row mb-3">
                <div className="col-md-3">
                    <label htmlFor="letterFilter" className="form-label">Filtrar por inicial</label>
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
                    <select id="nameOrder" className="form-select" value={nameOrder} onChange={e => { setNameOrder(e.target.value as 'none' | 'asc' | 'desc'); setRutOrder('none'); }}>
                        <option value="none">--</option>
                        <option value="asc">A - Z</option>
                        <option value="desc">Z - A</option>
                    </select>
                </div>
                <div className="col text-end">
                    <Link to="/Apoderados/CrearApoderado" className="btn btn-primary">Crear apoderado</Link>
                </div>
            </div>

            {sortedApoderados.length === 0 ? (
                <div className="text-muted">No hay apoderados.</div>
            ) : (
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>RUT</th>
                            <th>Nombre</th>
                            <th>Teléfono</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedApoderados.map((it, idx) => (
                        <tr key={it.id_apoderado ?? it.rut ?? `ap-${idx}`}>
                                <td>{it.rut ?? '-'}</td>
                                <td>{it.nombre}</td>
                                <td>{it.telefono ?? '-'}</td>
                                <td>
                                    <div className="d-flex gap-2">
                                        <Link to={`/Apoderados/Detalle/${it.id_apoderado}`} className="btn btn-sm btn-outline-primary">Ver</Link>
                                        <Link to={`/Apoderados/Editar/${it.id_apoderado}`} className="btn btn-sm btn-outline-secondary">Editar</Link>
                                        { (apoderadoHasKid[it.id_apoderado ?? '']?.hasKid) ? (
                                            <button className="btn btn-sm btn-danger" disabled title="No se puede eliminar: tiene estudiantes asociados">Eliminar</button>
                                        ) : (
                                            <button className="btn btn-sm btn-danger" onClick={() => openModal(it.id_apoderado ?? '')}>Eliminar</button>
                                        ) }
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {isModalOpen && (
                <div className="modal fade show d-block" tabIndex={-1} role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirmar eliminación</h5>
                                <button type="button" className="close" onClick={closeModal} aria-label="Close"><span aria-hidden="true">×</span></button>
                            </div>
                            <div className="modal-body">¿Está seguro que desea eliminar el apoderado con código {selectedId}?</div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cerrar</button>
                                <button type="button" className="btn btn-danger" onClick={handleDelete}>Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </>
    );
}
