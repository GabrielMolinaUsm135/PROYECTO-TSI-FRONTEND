import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    getPrestamosInstrumento,
    getPrestamosInsumo,
    eliminarPrestamoInstrumento,
    eliminarPrestamoInsumo,
} from '../../services/PrestamoService';
import { actualizarPrestamoInstrumento, actualizarPrestamoInsumo } from '../../services/PrestamoService';
import axiosInstance from '../../services/axiosinstance';

export default function ListaPrestamos() {
    const [type, setType] = useState<'instrumento' | 'insumo'>('instrumento');
    const [items, setItems] = useState<any[]>([]);
    const [alumnoRuts, setAlumnoRuts] = useState<Record<string | number, string>>({});
    const [alumnoNames, setAlumnoNames] = useState<Record<string | number, string>>({});
    const [instrumentoNames, setInstrumentoNames] = useState<Record<string, string>>({});
    const [insumoNames, setInsumoNames] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState<Record<string | number, boolean>>({});

    useEffect(() => {
        load();
    }, [type]);

    async function load() {
        setLoading(true);
        try {
            if (type === 'instrumento') {
                const data = await getPrestamosInstrumento();
                const list = Array.isArray(data) ? data : [];
                setItems(list);
                // fetch instrument names for the item codes shown
                const codes = Array.from(new Set(list.map((it: any) => it.cod_instrumento).filter(Boolean)));
                const missing = codes.filter((c: string) => !instrumentoNames[c]);
                if (missing.length > 0) {
                    try {
                        const pairs = await Promise.all(missing.map(async (c: string) => {
                            try {
                                const res = await axiosInstance.get(`/instrumentos/${encodeURIComponent(String(c))}`);
                                const d = res.data?.data ?? res.data ?? null;
                                const name = d?.nombre_instrumento ?? d?.nombre ?? '';
                                return [c, name || ''];
                            } catch (e) {
                                return [c, ''];
                            }
                        }));
                        setInstrumentoNames(prev => ({ ...prev, ...Object.fromEntries(pairs) }));
                    } catch (e) {
                        console.warn('Failed fetching instrumento names', e);
                    }
                }
                // auto-mark overdue prestamos as 'atrasado'
                checkAndMarkAtrasados(list);
            } else {
                const data = await getPrestamosInsumo();
                const list = Array.isArray(data) ? data : [];
                setItems(list);
                // fetch insumo names for the item codes shown
                const codes = Array.from(new Set(list.map((it: any) => it.cod_insumo).filter(Boolean)));
                const missing = codes.filter((c: string) => !insumoNames[c]);
                if (missing.length > 0) {
                    try {
                        const pairs = await Promise.all(missing.map(async (c: string) => {
                            try {
                                const res = await axiosInstance.get(`/insumos/${encodeURIComponent(String(c))}`);
                                const d = res.data?.data ?? res.data ?? null;
                                const name = d?.nombre_insumo ?? d?.nombre ?? '';
                                return [c, name || ''];
                            } catch (e) {
                                return [c, ''];
                            }
                        }));
                        setInsumoNames(prev => ({ ...prev, ...Object.fromEntries(pairs) }));
                    } catch (e) {
                        console.warn('Failed fetching insumo names', e);
                    }
                }
                // auto-mark overdue prestamos as 'atrasado'
                checkAndMarkAtrasados(list);
            }
        } catch (err) {
            console.error('Error loading prestamos', err);
        } finally {
            setLoading(false);
        }
    }

    async function checkAndMarkAtrasados(list: any[]) {
        if (!Array.isArray(list) || list.length === 0) return;
        const today = new Date();
        const todayYMD = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));

        const updates: Array<Promise<any>> = [];
        const updatedMap: Record<string | number, string> = {};

        for (const it of list) {
            const estado: string = (it.estado ?? '').toString().toLowerCase();
            if (estado.includes('devuelto') || estado.includes('atrasado')) continue;
            const fechaDevRaw = it.fecha_devolucion ?? null;
            if (!fechaDevRaw) continue;
            const fechaDev = new Date(String(fechaDevRaw).slice(0,10));
            if (fechaDev < todayYMD) {
                const idParam = it.cod_prestamo ?? it.cod ?? (Number(it.cod_prestamo ?? it.cod) || null);
                if (!idParam) continue;
                // mark as atrasado
                const promise = (type === 'instrumento')
                    ? actualizarPrestamoInstrumento(idParam, { estado: 'atrasado' })
                    : actualizarPrestamoInsumo(idParam, { estado: 'atrasado' });
                updates.push(promise.then(res => {
                    if (res?.success) updatedMap[idParam] = 'atrasado';
                    return res;
                }).catch(err => { console.warn('Failed marking atrasado for', idParam, err); }));
            }
        }

        if (updates.length === 0) return;
        try {
            await Promise.allSettled(updates);
            // locally update items state to reflect nuevo estado without reloading
            setItems(prev => prev.map(it => {
                const idParam = it.cod_prestamo ?? it.cod ?? (Number(it.cod_prestamo ?? it.cod) || null);
                if (idParam && updatedMap[idParam]) {
                    return { ...it, estado: updatedMap[idParam] };
                }
                return it;
            }));
        } catch (err) {
            console.error('Error marking atrasados', err);
        }
    }

    // When items change, fetch alumno RUTs for the unique id_usuario values
    useEffect(() => {
        let mounted = true;
        async function loadRuts() {
            const ids = Array.from(new Set(items.map(i => i.id_usuario).filter(Boolean)));
            if (ids.length === 0) {
                if (mounted) setAlumnoRuts({});
                return;
            }
            try {
                const pairs = await Promise.all(ids.map(async (id) => {
                    try {
                        const res = await axiosInstance.get(`/alumno/usuario/${encodeURIComponent(String(id))}`);
                        const a = res.data?.data ?? res.data ?? null;
                        const rut = a?.rut ?? a?.alumno_rut ?? a?.rut_alumno ?? null;
                        const nombre = [a?.nombre ?? a?.nombre_alumno, a?.apellido_paterno, a?.apellido_materno].filter(Boolean).join(' ').trim() || null;
                        return [id, { rut: rut ?? String(id), nombre }];
                    } catch (err) {
                        console.warn('Failed to fetch alumno for usuario', id, err);
                        return [id, { rut: String(id), nombre: '' }];
                    }
                }));
                const rutMap: Record<string | number, string> = {};
                const nameMap: Record<string | number, string> = {};
                for (const [id, info] of pairs) {
                    const obj = info as any;
                    rutMap[id as any] = obj.rut;
                    nameMap[id as any] = obj.nombre ?? '';
                }
                if (mounted) {
                    setAlumnoRuts(rutMap);
                    setAlumnoNames(nameMap);
                }
            } catch (err) {
                console.error('Error fetching alumno ruts', err);
            }
        }
        loadRuts();
        return () => { mounted = false; };
    }, [items]);

    async function handleDelete(id: number) {
        const ok = window.confirm('¿Eliminar este préstamo?');
        if (!ok) return;
        try {
            let res;
            if (type === 'instrumento') {
                res = await eliminarPrestamoInstrumento(id);
            } else {
                res = await eliminarPrestamoInsumo(id);
            }
            if (res?.success) {
                load();
            } else {
                alert('Error al eliminar préstamo');
            }
        } catch (err) {
            console.error('Delete error', err);
            alert('Error al eliminar préstamo');
        }
    }

    async function handleEntregar(it: any) {
        const idParam = it.cod_prestamo ?? it.cod ?? (Number(it.cod_prestamo ?? it.cod) || null);
        if (!idParam) return;
        const estadoActual: string = (it.estado ?? '').toString().toLowerCase();
        if (estadoActual.includes('devuelto')) return; // already delivered

        const fechaDev = it.fecha_devolucion ? new Date(String(it.fecha_devolucion).slice(0,10)) : null;
        const today = new Date();
        // normalize dates to yyyy-mm-dd
        const todayYMD = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
        let nuevoEstado = 'devuelto';
        if (fechaDev && fechaDev < todayYMD) nuevoEstado = 'devuelto atrasado';

        setActionLoading(prev => ({ ...prev, [idParam]: true }));
        try {
            let res;
            if (type === 'instrumento') {
                res = await actualizarPrestamoInstrumento(idParam, { estado: nuevoEstado });
            } else {
                res = await actualizarPrestamoInsumo(idParam, { estado: nuevoEstado });
            }
            if (res?.success) {
                load();
            } else {
                alert('Error al marcar como entregado');
            }
        } catch (err) {
            console.error('Entregar error', err);
            alert('Error al marcar como entregado');
        } finally {
            setActionLoading(prev => ({ ...prev, [idParam]: false }));
        }
    }

    return (
        <>
        <div className="row bg-primary text-white py-3 mb-5">
                <div className="col text-center">
                    <h1>Lista de Prestamos</h1>
                </div>
            </div>
        <div className="container py-4">
            <div className="mb-3">
                <label className="me-3">
                    <input type="radio" name="tipo" value="instrumento" checked={type === 'instrumento'} onChange={() => setType('instrumento')} />{' '}
                    Instrumentos
                </label>
                <label className="ms-3">
                    <input type="radio" name="tipo" value="insumo" checked={type === 'insumo'} onChange={() => setType('insumo')} />{' '}
                    Insumos
                </label>
            </div>

            <div className="mb-3 text-end">
                <Link to="/Prestamo/CrearPrestamo" className="btn btn-primary">Crear Préstamo</Link>
            </div>

            {loading ? (
                <p>Cargando...</p>
            ) : (
                <table className="table table-bordered">
                    <thead className="table-light">
                        <tr>
                            <th>Código</th>
                            <th>Item</th>
                            <th>Rut</th>
                            <th>Alumno</th>
                            <th>Fecha Prestamo</th>
                            <th>Fecha Devolución</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length === 0 ? (
                            <tr><td colSpan={7} className="text-center">No hay préstamos</td></tr>
                        ) : (
                            items.map((it: any) => {
                                const code = Number(it.cod_prestamo ?? it.cod ?? NaN);
                                return (
                                    <tr key={code}>
                                        <td>{Number.isNaN(code) ? it.cod_prestamo ?? it.cod : code}</td>
                                        <td>
                                            {(() => {
                                                const itemCode = (type === 'instrumento' ? it.cod_instrumento : it.cod_insumo) ?? '-';
                                                const name = type === 'instrumento' ? instrumentoNames[String(itemCode)] : insumoNames[String(itemCode)];
                                                return (
                                                    <>
                                                        <div>{itemCode}</div>
                                                        {name ? <small className="text-muted">{name}</small> : null}
                                                    </>
                                                );
                                            })()}
                                        </td>
                                        <td>{(it.id_usuario !== undefined && it.id_usuario !== null) ? (alumnoRuts[it.id_usuario] ?? it.id_usuario) : '-'}</td>
                                        <td>{(it.id_usuario !== undefined && it.id_usuario !== null) ? (alumnoNames[it.id_usuario] ?? '-') : '-'}</td>
                                        <td>{it.fecha_prestamo ?? '-'}</td>
                                        <td>{it.fecha_devolucion ?? '-'}</td>
                                        <td>
                                            {(() => {
                                                const raw = (it.estado ?? '').toString();
                                                const key = raw.toLowerCase();
                                                let cls = 'secondary';
                                                if (key.includes('devuelto atrasado')) cls = 'warning';
                                                else if (key.includes('devuelto')) cls = 'success';
                                                else if (key.includes('atrasado')) cls = 'danger';
                                                else if (key.includes('pendiente')) cls = 'secondary';
                                                const textColor = cls === 'warning' ? 'text-dark' : 'text-white';
                                                return (
                                                    <span className={`badge bg-${cls} ${textColor}`}>{raw || '-'}</span>
                                                );
                                            })()}
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-success me-2"
                                                onClick={() => handleEntregar(it)}
                                                disabled={Boolean(actionLoading[it.cod_prestamo ?? it.cod ?? code]) || String(it.estado ?? '').toLowerCase().includes('devuelto')}
                                            >
                                                {actionLoading[it.cod_prestamo ?? it.cod ?? code] ? '...' : 'Entregar'}
                                            </button>
                                            {type === 'instrumento' ? (
                                                <Link className="btn btn-sm btn-secondary me-2" to={`/Prestamo/EditarInstrumento/${encodeURIComponent(String(it.cod_prestamo ?? it.cod ?? code))}`}>Editar</Link>
                                            ) : (
                                                <Link className="btn btn-sm btn-secondary me-2" to={`/Prestamo/EditarInsumo/${encodeURIComponent(String(it.cod_prestamo ?? it.cod ?? code))}`}>Editar</Link>
                                            )}
                                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(code)}>Eliminar</button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            )}
        </div>
        </>
    );
}
