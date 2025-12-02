import { useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import type { Apoderado } from '../../types/apoderado';
import { getApoderado, actualizarApoderado } from '../../services/ApoderadoService';

export async function loader({ params }: any) {
    const id = params.id;
    const res = await getApoderado(id);
    return res;
}

export default function EditarApoderado(){
    const data = useLoaderData() as { success: boolean, data?: Apoderado };
    const ap = data?.data;
    const navigate = useNavigate();
    const [rut, setRut] = useState(ap?.rut ?? '');
    const [nombre, setNombre] = useState(ap?.nombre ?? '');
    const [correo, setCorreo] = useState(ap?.correo ?? '');
    const [telefono, setTelefono] = useState(ap?.telefono ?? '');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ap) return;
        const payload = { rut, nombre, correo, telefono };
        const res = await actualizarApoderado(ap.id_apoderado!, payload);
        if (!res.success) { alert('Error actualizando apoderado'); return; }
        navigate('/Apoderados/ListaApoderados');
    };

    if (!ap) return <div className="container py-4">No se encontró apoderado.</div>;

    return (
        <div className="container py-4">
            <h2>Editar Apoderado</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">RUT</label>
                    <input className="form-control" value={rut} onChange={e => setRut(e.target.value)} />
                </div>

                <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input className="form-control" value={nombre} onChange={e => setNombre(e.target.value)} />
                </div>

                <div className="mb-3">
                    <label className="form-label">Correo</label>
                    <input className="form-control" value={correo} onChange={e => setCorreo(e.target.value)} />
                </div>

                <div className="mb-3">
                    <label className="form-label">Teléfono</label>
                    <input className="form-control" value={telefono} onChange={e => setTelefono(e.target.value)} />
                </div>

                <div>
                    <button className="btn btn-primary" type="submit">Guardar</button>
                </div>
            </form>
        </div>
    );
}
