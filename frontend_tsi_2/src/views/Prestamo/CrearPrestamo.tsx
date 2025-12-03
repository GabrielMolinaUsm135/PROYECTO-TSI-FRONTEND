import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearPrestamoInstrumento, crearPrestamoInsumo, getPrestamosInstrumento, getPrestamosInsumo } from '../../services/PrestamoService';
import axiosInstance from '../../services/axiosinstance';
import { getListaInstrumentos } from '../../services/InstrumentoService';
import { getListaInsumos } from '../../services/InsumoService';

export default function CrearPrestamo() {
    const [type, setType] = useState<'instrumento' | 'insumo'>('instrumento');
    const [form, setForm] = useState({
        cod_item: '',
        alumno_rut: '',
        fecha_prestamo: new Date().toISOString().slice(0,10),
        fecha_devolucion: '',
        estado: 'pendiente',
    });
    const [instrumentos, setInstrumentos] = useState<any[]>([]);
    const [insumos, setInsumos] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
            try {
            // resolve alumno rut to user id via API
            let resolvedUsuarioId: number | string | null = null;
            if (form.alumno_rut) {
                try {
                    const res = await axiosInstance.get(`/alumno/${encodeURIComponent(String(form.alumno_rut))}`);
                    const a = res.data?.data ?? res.data ?? null;
                    resolvedUsuarioId = a?.id_usuario ?? a?.id_user ?? a?.id ?? a?.id_alumno ?? null;
                    if (!resolvedUsuarioId) {
                        alert('No se pudo obtener el id del alumno a partir del RUT seleccionado');
                        setLoading(false);
                        return;
                    }
                } catch (err) {
                    console.warn('Alumno lookup failed', err);
                    alert('No se encontró alumno con ese RUT');
                    setLoading(false);
                    return;
                }
            }

            const payload: Record<string, any> = {
                id_usuario: resolvedUsuarioId,
                fecha_prestamo: form.fecha_prestamo || null,
                fecha_devolucion: form.fecha_devolucion || null,
                estado: form.estado || null,
            };
            // compute next numeric cod_prestamo by counting existing prestamos (instrumento + insumo)
            if (!payload.cod_prestamo) {
                try {
                    const [instList, insList] = await Promise.all([getPrestamosInstrumento(), getPrestamosInsumo()]);
                    const nInst = Array.isArray(instList) ? instList.length : 0;
                    const nIns = Array.isArray(insList) ? insList.length : 0;
                    const total = nInst + nIns;
                    payload.cod_prestamo = total + 1 || 1;
                } catch (err) {
                    console.warn('Failed to fetch prestamos lists, falling back to timestamp', err);
                    payload.cod_prestamo = Date.now();
                }
            }
            if (type === 'instrumento') payload.cod_instrumento = form.cod_item;
            else payload.cod_insumo = form.cod_item;

            let res;
            if (type === 'instrumento') res = await crearPrestamoInstrumento(payload);
            else res = await crearPrestamoInsumo(payload);

            if (res?.success) {
                navigate('/Prestamo/ListaPrestamos');
            } else {
                alert('Error creando préstamo');
            }
        } catch (err) {
            console.error('Error creating prestamo', err);
            alert('Error creando préstamo');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        let mounted = true;
        async function loadItems() {
            try {
                if (type === 'instrumento') {
                    const list = await getListaInstrumentos();
                    if (mounted) {
                        // For each instrumento, check if it's currently in use and filter those out
                        const checks = await Promise.all((Array.isArray(list) ? list : []).map(async (it: any) => {
                            const code = it.cod_instrumento ?? it.codigo ?? it.id;
                            try {
                                const r = await axiosInstance.get(`/prestamos_instrumento/ocupado/${encodeURIComponent(String(code))}`);
                                const info = r.data?.data ?? r.data ?? null;
                                return { it, ocupado: Boolean(info?.enUso) };
                            } catch (err) {
                                // If check fails, assume not ocupado to avoid hiding items because of transient errors
                                console.warn('ocupado check failed for', code, err);
                                return { it, ocupado: false };
                            }
                        }));
                        const available = checks.filter((c: any) => !c.ocupado).map((c: any) => c.it);
                        setInstrumentos(available);
                    }
                } else {
                    const list = await getListaInsumos();
                    if (mounted) {
                        const arr = Array.isArray(list) ? list : [];
                        try {
                            // fetch instrumento_insumo relations and build set of insumos linked to instrumentos
                            const relRes = await axiosInstance.get('/instrumento_insumo');
                            const rels = relRes.data?.data ?? relRes.data ?? [];
                            const linked = new Set((Array.isArray(rels) ? rels : []).map((r: any) => r.cod_insumo ?? r.cod_instrumento ?? null).filter(Boolean));

                            // For each insumo, check if it's occupied in prestamos_insumo/ocupado/:id
                            const checks = await Promise.all(arr.map(async (it: any) => {
                                const code = it.cod_insumo ?? it.codigo ?? it.id;
                                // if linked to an instrument, mark as excluded
                                if (linked.has(code)) return { it, exclude: true };
                                try {
                                    const r = await axiosInstance.get(`/prestamos_insumo/ocupado/${encodeURIComponent(String(code))}`);
                                    const info = r.data?.data ?? r.data ?? null;
                                    const ocupado = Boolean(info?.enUso);
                                    const pendientes = Number(info?.pendientes ?? 0);
                                    return { it, exclude: ocupado || pendientes > 0 };
                                } catch (err) {
                                    console.warn('ocupado check failed for insumo', code, err);
                                    // if the ocupado check fails, assume available
                                    return { it, exclude: false };
                                }
                            }));

                            const available = checks.filter((c: any) => !c.exclude).map((c: any) => c.it);
                            setInsumos(available);
                        } catch (err) {
                            console.warn('Error checking instrumento_insumo or ocupado, using full list', err);
                            setInsumos(arr);
                        }
                    }
                }
            } catch (err) {
                console.error('Error loading items for prestamo form', err);
            }
        }
        loadItems();
        return () => { mounted = false; };
    }, [type]);

    return (
        <div className="container py-4">
            <h1>Crear Préstamo</h1>
            <form onSubmit={handleSubmit} className="mt-3">
                <div className="mb-3">
                    <label className="me-3">
                        <input type="radio" name="tipo" value="instrumento" checked={type === 'instrumento'} onChange={() => { setType('instrumento'); setForm(prev => ({ ...prev, cod_item: '' })); }} /> Instrumento
                    </label>
                    <label className="ms-3">
                        <input type="radio" name="tipo" value="insumo" checked={type === 'insumo'} onChange={() => { setType('insumo'); setForm(prev => ({ ...prev, cod_item: '' })); }} /> Insumo
                    </label>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Código {type === 'instrumento' ? 'Instrumento' : 'Insumo'}</label>
                        <select name="cod_item" className="form-select" value={form.cod_item} onChange={handleChange} required>
                            <option value="">Selecciona un código...</option>
                            {type === 'instrumento' ? (
                                instrumentos.map((it: any) => (
                                    <option key={it.cod_instrumento ?? it.codigo ?? it.id} value={it.cod_instrumento ?? it.codigo ?? it.id}>
                                        {it.cod_instrumento ?? it.codigo ?? `${it.id} - ${it.nombre ?? ''}`}
                                    </option>
                                ))
                            ) : (
                                insumos.map((it: any) => (
                                    <option key={it.cod_insumo ?? it.codigo ?? it.id} value={it.cod_insumo ?? it.codigo ?? it.id}>
                                        {it.cod_insumo ?? it.codigo ?? `${it.id} - ${it.nombre ?? ''}`}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Alumno (RUT)</label>
                        <input name="alumno_rut" className="form-control" value={form.alumno_rut} onChange={handleChange} placeholder="12345678-9" />                        
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Fecha Prestamo</label>
                        <input name="fecha_prestamo" type="date" className="form-control" value={form.fecha_prestamo} onChange={handleChange} />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Fecha Devolución</label>
                        <input name="fecha_devolucion" type="date" className="form-control" value={form.fecha_devolucion} onChange={handleChange} />
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label">Estado</label>
                    <select name="estado" className="form-select" value={form.estado} onChange={handleChange}>
                        <option value="pendiente">pendiente</option>
                        <option value="enviado">enviado</option>
                        <option value="devuelto">devuelto</option>
                    </select>
                </div>

                <div className="d-flex justify-content-end">
                    <button className="btn btn-secondary me-2" type="button" onClick={() => navigate('/Prestamo/ListaPrestamos')}>Cancelar</button>
                    <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Creando...' : 'Crear'}</button>
                </div>
            </form>
        </div>
    );
}
