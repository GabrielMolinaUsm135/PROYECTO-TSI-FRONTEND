import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../services/axiosinstance';
import {
  getPrestamoInstrumentoById,
  getPrestamoInsumoById,
  actualizarPrestamoInstrumento,
  actualizarPrestamoInsumo,
} from '../../services/PrestamoService';
import { getListaInstrumentos } from '../../services/InstrumentoService';
import { getListaInsumos } from '../../services/InsumoService';

export default function EditarPrestamo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<'instrumento' | 'insumo'>('instrumento');
  const [instrumentos, setInstrumentos] = useState<any[]>([]);
  const [insumos, setInsumos] = useState<any[]>([]);
  const [form, setForm] = useState({
    cod_prestamo: '',
    cod_item: '',
    id_usuario: '',
    alumno_rut: '',
    fecha_prestamo: '',
    fecha_devolucion: '',
    estado: 'pendiente',
  });

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!id) return;
      setLoading(true);
      try {
        // Try instrumento first
        const pInst = await getPrestamoInstrumentoById(id);
        if (pInst) {
          if (!mounted) return;
          setType('instrumento');
          setForm({
            cod_prestamo: pInst.cod_prestamo ?? pInst.cod ?? '',
            cod_item: pInst.cod_instrumento ?? '',
            id_usuario: pInst.id_usuario ?? '',
            alumno_rut: '',
            fecha_prestamo: pInst.fecha_prestamo ? pInst.fecha_prestamo.slice(0,10) : '',
            fecha_devolucion: pInst.fecha_devolucion ? pInst.fecha_devolucion.slice(0,10) : '',
            estado: pInst.estado ?? 'pendiente',
          });
        } else {
          const pIns = await getPrestamoInsumoById(id);
          if (pIns) {
            if (!mounted) return;
            setType('insumo');
            setForm({
              cod_prestamo: pIns.cod_prestamo ?? pIns.cod ?? '',
              cod_item: pIns.cod_insumo ?? '',
              id_usuario: pIns.id_usuario ?? '',
              alumno_rut: '',
              fecha_prestamo: pIns.fecha_prestamo ? pIns.fecha_prestamo.slice(0,10) : '',
              fecha_devolucion: pIns.fecha_devolucion ? pIns.fecha_devolucion.slice(0,10) : '',
              estado: pIns.estado ?? 'pendiente',
            });
          }
        }

        // load lists for selects
        const [listaInst, listaIns] = await Promise.all([getListaInstrumentos(), getListaInsumos()]);
        if (!mounted) return;
        setInstrumentos(Array.isArray(listaInst) ? listaInst : []);
        setInsumos(Array.isArray(listaIns) ? listaIns : []);

        // try to fetch alumno rut for display
        if (form.id_usuario) {
          try {
            const res = await axiosInstance.get(`/alumno/usuario/${encodeURIComponent(String(form.id_usuario))}`);
            const a = res.data?.data ?? res.data ?? null;
            const rut = a?.rut ?? a?.alumno_rut ?? a?.rut_alumno ?? '';
            setForm(prev => ({ ...prev, alumno_rut: rut || prev.alumno_rut }));
          } catch (err) {
            // ignore
          }
        }
      } catch (err) {
        console.error('Error loading prestamo', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      // Resolve alumno rut to id_usuario if provided
      let resolvedUsuarioId = form.id_usuario;
      if (form.alumno_rut && (!form.id_usuario || String(form.id_usuario).length === 0)) {
        try {
          const r = await axiosInstance.get(`/alumno/${encodeURIComponent(String(form.alumno_rut))}`);
          const a = r.data?.data ?? r.data ?? null;
          resolvedUsuarioId = a?.id_usuario ?? a?.id_user ?? a?.id ?? a?.id_alumno ?? resolvedUsuarioId;
        } catch (err) {
          alert('No se encontró alumno con ese RUT');
          setLoading(false);
          return;
        }
      }

      const payload: Record<string, any> = {
        cod_prestamo: form.cod_prestamo,
        id_usuario: resolvedUsuarioId,
        fecha_prestamo: form.fecha_prestamo || null,
        fecha_devolucion: form.fecha_devolucion || null,
        estado: form.estado || null,
      };
      if (type === 'instrumento') payload.cod_instrumento = form.cod_item;
      else payload.cod_insumo = form.cod_item;

      let res;
      if (type === 'instrumento') res = await actualizarPrestamoInstrumento(form.cod_prestamo, payload);
      else res = await actualizarPrestamoInsumo(form.cod_prestamo, payload);

      if (res?.success) {
        navigate('/Prestamo/ListaPrestamos');
      } else {
        alert('Error actualizando préstamo');
      }
    } catch (err) {
      console.error('Error updating prestamo', err);
      alert('Error actualizando préstamo');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="container py-4"><p>Cargando...</p></div>;

  return (
    <div className="container py-4">
      <h2>Editar Préstamo</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label className="me-3">
            <input type="radio" name="tipo" value="instrumento" checked={type === 'instrumento'} onChange={() => setType('instrumento')} /> Instrumento
          </label>
          <label className="ms-3">
            <input type="radio" name="tipo" value="insumo" checked={type === 'insumo'} onChange={() => setType('insumo')} /> Insumo
          </label>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Código Préstamo</label>
            <input name="cod_prestamo" className="form-control" value={form.cod_prestamo} readOnly />
          </div>
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
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Actualizando...' : 'Actualizar'}</button>
        </div>
      </form>
    </div>
  );
}
