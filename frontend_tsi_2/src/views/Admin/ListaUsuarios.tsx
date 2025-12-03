import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import type { ListaUsuario } from '../../types/usuario';
import { getListausuarios } from '../../services/UsuarioService';

export async function loader() {
    const items = await getListausuarios();
    return items;
}

export default function ListaUsuarios(){
    const [roleFilter, setRoleFilter] = useState<string>('');
    const usuarios = useLoaderData() as ListaUsuario[];
    const lista = Array.isArray(usuarios) ? usuarios : [];

    const filteredLista = roleFilter && roleFilter !== ''
        ? lista.filter(u => String((u as any).id_rol ?? '') === roleFilter)
        : lista;

    return (
        <>
            <div className="row bg-primary text-white py-3 mb-5">
                <div className="col text-center">
                    <h1>Lista de Usuarios</h1>
                </div>
            </div>
            <div className="container py-4">
                <div className="row mb-3">
                    <div className="col-md-3">
                        <label htmlFor="roleFilter" className="form-label">Filtrar por rol</label>
                        <select id="roleFilter" className="form-select" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
                            <option value="">Todos</option>
                            <option value="1">1 - Administrador</option>
                            <option value="2">2 - Profesor</option>
                            <option value="3">3 - Alumno</option>
                        </select>
                    </div>
                </div>
                {filteredLista.length === 0 ? (
                    <div className="text-muted">No hay usuarios.</div>
                ) : (
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Correo</th>
                                <th>Rol (id_rol)</th>
                                <th>Rol (nombre)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLista.map((u, idx) => (
                                <tr key={u.correo ?? idx}>
                                    <td>{u.correo}</td>
                                    <td>{String((u as any).id_rol ?? '')}</td>
                                    <td>{( {1: 'Administrador', 2: 'Profesor', 3: 'Alumno'} as any)[(u as any).id_rol] ?? (u as any).rol_nombre ?? ''}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}
