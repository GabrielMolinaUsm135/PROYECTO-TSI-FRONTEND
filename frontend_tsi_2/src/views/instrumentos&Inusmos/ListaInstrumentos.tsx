import { useEffect, useState } from 'react';
import { useLoaderData, useNavigate, Link } from 'react-router-dom';
import { getListaInstrumentos, instrumentoEliminar, getInsumosPorInstrumento, desasociarInsumoDeInstrumento } from '../../services/InstrumentoService';
import axiosInstance from '../../services/axiosinstance';
import type { ListaInstrumento } from '../../types/instrumento';

export async function loader() {
    const instrumentos = await getListaInstrumentos();
    return instrumentos;
}

export default function ListaInstrumentos() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCod, setSelectedCod] = useState<string | null>(null);
    const [nameOrder, setNameOrder] = useState<'none' | 'asc' | 'desc'>('none');
    const [modelOrder, setModelOrder] = useState<'none' | 'asc' | 'desc'>('none');
    const [letterFilter, setLetterFilter] = useState<string>('');
    const navigate = useNavigate();

    const openModal = (cod: string) => {
        setSelectedCod(cod);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCod(null);
    };

    const handleDelete = async () => {
        if (!selectedCod) return;
        try {
            const relaciones = await getInsumosPorInstrumento(selectedCod);
            if (Array.isArray(relaciones) && relaciones.length > 0) {
                for (const rel of relaciones) {
                    const codInsumo = (rel as any).cod_insumo ?? (rel as any).insumo_cod ?? (rel as any).codInsumo;
                    if (!codInsumo) continue;
                    const unlinkRes = await desasociarInsumoDeInstrumento(selectedCod, codInsumo);
                    if (!unlinkRes.success) {
                        console.warn('No se pudo desasociar insumo', codInsumo, 'del instrumento', selectedCod, unlinkRes.error);
                    }
                }
            }
        } catch (err:any) {
            console.error('Error al desasociar insumos antes de eliminar:', err);
        }
        const res = await instrumentoEliminar(selectedCod);
        if (!res.success) {
            alert('Error al eliminar instrumento: ' + (typeof res.error === 'string' ? res.error : JSON.stringify(res.error)));
            return;
        }
        closeModal();
        navigate('/Instrumentos/ListaInstrumentos');
    };

    // estado para marcar instrumentos que están vinculados a algún insumo
    const [linkedInstruments, setLinkedInstruments] = useState<Record<string, boolean>>({});

    useEffect(() => {
        let mounted = true;
        async function loadLinked() {
            try {
                const res = await axiosInstance.get('/instrumento_insumo');
                const rels = res.data?.data ?? res.data ?? [];
                const map: Record<string, boolean> = {};
                for (const r of Array.isArray(rels) ? rels : []) {
                    const instCode = r.cod_instrumento ?? r.instrumento_cod ?? r.codInstrumento ?? null;
                    if (instCode !== null && instCode !== undefined) map[String(instCode)] = true;
                }
                if (mounted) setLinkedInstruments(map);
            } catch (err) {
                console.warn('No se pudo cargar instrumento_insumo, asumiendo none linked', err);
            }
        }
        loadLinked();
        return () => { mounted = false; };
    }, []);

    const instrumentos = useLoaderData() as ListaInstrumento[];
    const instrumentosValidos = Array.isArray(instrumentos) ? instrumentos : [];

    // determine active sort field and order
    let activeField: 'nombre_instrumento' | 'modelo_instrumento' = 'nombre_instrumento';
    let activeOrder: 'asc' | 'desc' = 'asc';
    if (nameOrder !== 'none') {
        activeField = 'nombre_instrumento';
        activeOrder = nameOrder as 'asc' | 'desc';
    } else if (modelOrder !== 'none') {
        activeField = 'modelo_instrumento';
        activeOrder = modelOrder as 'asc' | 'desc';
    }

    // apply letter filter on nombre_instrumento
    const filteredInstrumentos = letterFilter && letterFilter.length === 1
        ? instrumentosValidos.filter(i => (i.nombre_instrumento ?? '').toString().toUpperCase().startsWith(letterFilter))
        : instrumentosValidos;

    const sortedInstrumentos = [...filteredInstrumentos].sort((a, b) => {
        const aVal = (a[activeField] ?? '').toString();
        const bVal = (b[activeField] ?? '').toString();
        const cmp = aVal.localeCompare(bVal, 'es', { sensitivity: 'base' });
        return activeOrder === 'asc' ? cmp : -cmp;
    });

    return (
        <>
            <div className="row bg-primary text-white py-3 mb-5">
                <div className="col text-center">
                    <h1>Lista de Instrumentos</h1>
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
                        <select id="nameOrder" className="form-select" value={nameOrder} onChange={e => { setNameOrder(e.target.value as 'none' | 'asc' | 'desc'); setModelOrder('none'); }}>
                            <option value="none">--</option>
                            <option value="asc">A - Z</option>
                            <option value="desc">Z - A</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="modelOrder" className="form-label">Ordenar por modelo</label>
                        <select id="modelOrder" className="form-select" value={modelOrder} onChange={e => { setModelOrder(e.target.value as 'none' | 'asc' | 'desc'); setNameOrder('none'); }}>
                            <option value="none">--</option>
                            <option value="asc">A - Z</option>
                            <option value="desc">Z - A</option>
                        </select>
                    </div>
                    <div className="col text-end">
                        <Link to="/Instrumentos/CrearInstrumento" className="btn btn-primary">Crear instrumento</Link>
                    </div>
                </div>
                <div className="row">
                    {sortedInstrumentos.length === 0 ? (
                        <div className="col-12 py-5 text-center text-muted">No hay instrumentos para mostrar.</div>
                    ) : (
                        <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Nombre</th>
                                <th>Modelo</th>
                                <th>Tamaño</th>
                                <th>Observación</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedInstrumentos.map((inst) => (
                                <tr key={inst.cod_instrumento}>
                                    <td>{inst.cod_instrumento}</td>
                                    <td>{inst.nombre_instrumento}</td>
                                    <td>{inst.modelo_instrumento}</td>
                                    <td>{inst.tamano}</td>
                                    <td>{inst.observacion}</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <Link className="btn btn-sm btn-outline-primary" to={`/Instrumentos/Detalle/${inst.cod_instrumento}`}>Ver</Link>
                                            <Link className="btn btn-sm btn-outline-secondary" to={`/Instrumentos/Editar/${inst.cod_instrumento}`}>Editar</Link>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => openModal(inst.cod_instrumento)}
                                                disabled={Boolean(linkedInstruments[String(inst.cod_instrumento)])}
                                                title={linkedInstruments[String(inst.cod_instrumento)] ? 'No se puede eliminar: tiene insumos relacionados' : 'Eliminar instrumento'}
                                            >Eliminar</button>
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
                <div
                    className="modal fade show d-block"
                    tabIndex={-1}
                    role="dialog"
                    aria-labelledby="deleteInstrumentoLabel"
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="deleteInstrumentoLabel">Confirmar eliminación</h5>
                                <button type="button" className="close" onClick={closeModal} aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                ¿Está seguro que desea eliminar el instrumento con código {selectedCod}?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cerrar</button>
                                <button type="button" className="btn btn-danger" onClick={handleDelete}>Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
