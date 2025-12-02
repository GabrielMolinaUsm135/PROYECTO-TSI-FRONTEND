import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearApoderado } from '../../services/ApoderadoService';

export default function CrearApoderado(){
    const [rut, setRut] = useState('');
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [telefono, setTelefono] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nombre.trim()) { alert('Nombre requerido'); return; }
        const payload = { rut, nombre, correo, telefono };
        const res = await crearApoderado(payload);
        if (!res.success) { alert('Error creando apoderado'); return; }
        navigate('/Apoderados/ListaApoderados');
    };

    return (
        <div className="container py-4">
            <h2>Crear Apoderado</h2>
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
                    <button className="btn btn-primary" type="submit">Crear</button>
                </div>
            </form>
        </div>
    );
}
