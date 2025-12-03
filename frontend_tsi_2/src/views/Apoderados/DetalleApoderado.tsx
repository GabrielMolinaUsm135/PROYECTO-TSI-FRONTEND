import { useLoaderData, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getApoderado } from '../../services/ApoderadoService';
import axiosInstance from '../../services/axiosinstance';
import type { Apoderado } from '../../types/apoderado';

export async function loader({ params }: any) {
    const res = await getApoderado(params.id);
    return res;
}

export default function DetalleApoderado(){
    const data = useLoaderData() as { success: boolean, data?: Apoderado };
    const ap = data?.data;
    const [alumnos, setAlumnos] = useState<Array<any>>([]);
    const [loadingAlumnos, setLoadingAlumnos] = useState(false);

    useEffect(() => {
        let mounted = true;
        async function loadAlumnos() {
            if (!ap?.id_apoderado) {
                if (mounted) setAlumnos([]);
                return;
            }
            setLoadingAlumnos(true);
            try {
                const res = await axiosInstance.get(`/apoderados/${encodeURIComponent(String(ap.id_apoderado))}/alumnos`);
                const list = res.data?.data ?? res.data ?? [];
                if (mounted) setAlumnos(Array.isArray(list) ? list : []);
            } catch (err) {
                console.warn('Could not load alumnos for apoderado', err);
                if (mounted) setAlumnos([]);
            } finally {
                if (mounted) setLoadingAlumnos(false);
            }
        }
        loadAlumnos();
        return () => { mounted = false; };
    }, [ap?.id_apoderado]);

    if (!ap) return <div className="container py-4">Apoderado no encontrado.</div>;

    return (
        <div className="container py-4">
            <div className="card">
                <div className="card-body">
                    <h3 className="card-title">{ap.nombre}</h3>
                    <p><strong>ID:</strong> {ap.id_apoderado}</p>
                    <p><strong>RUT:</strong> {ap.rut ?? '-'}</p>
                    <p><strong>Teléfono:</strong> {ap.telefono ?? '-'}</p>
                    <p><strong>Correo:</strong> {ap.correo ?? '-'}</p>

                    <hr />
                    <h5>Alumnos asociados</h5>
                    {loadingAlumnos ? (
                        <p>Cargando alumnos...</p>
                    ) : (
                        <div>
                            {alumnos.length === 0 ? (
                                <div className="text-muted">No hay alumnos asociados a este apoderado.</div>
                            ) : (
                                <table className="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>RUT</th>
                                            <th>Nombre</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {alumnos.map((al: any) => (
                                            <tr key={al.id_alumno ?? al.id_usuario ?? al.rut}>
                                                <td>{al.rut ?? '-'}</td>
                                                <td>{`${al.nombre ?? ''} ${al.apellido_paterno ?? ''} ${al.apellido_materno ?? ''}`.trim()}</td>
                                                <td>
                                                    <Link to={`/Alumno/Detalle/${encodeURIComponent(String(al.id_alumno ?? al.id_usuario ?? al.rut))}`} className="btn btn-sm btn-outline-primary">Ver ficha</Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                    <div className="mt-3">
                        <Link to={`/Apoderados/Editar/${ap.id_apoderado}`} className="btn btn-secondary me-2">Editar</Link>
                        <Link to="/Apoderados/ListaApoderados" className="btn btn-outline-primary">Volver a la lista</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
