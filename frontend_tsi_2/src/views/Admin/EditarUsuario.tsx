import axios from 'axios';
import { Form, redirect, type LoaderFunctionArgs, type ActionFunctionArgs, useLoaderData } from 'react-router-dom';

export async function loader({ params }: LoaderFunctionArgs) {
    const { id } = params;
    if (!id) throw new Response('Falta identificador de usuario', { status: 400 });

    const token = localStorage.getItem('token');
    if (!token) throw new Response('Unauthorized', { status: 401 });

    try {
        const url = `http://localhost:3000/api/usuarios/${encodeURIComponent(id)}`;
        const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
        const data = res.data?.data ?? res.data;
        return data;
    } catch (err:any) {
        console.warn('No se pudo obtener usuario por id, intentando lista por correo', err?.response?.status);
        // Try to fetch from /usuarios and find by correo
        try {
            const listRes = await axios.get('http://localhost:3000/api/usuarios', { headers: { Authorization: `Bearer ${token}` } });
            const list = listRes.data?.data ?? listRes.data ?? [];
            const found = (list as any[]).find(u => String(u.correo) === decodeURIComponent(id));
            if (found) return found;
        } catch (listErr:any) {
            console.error('Error fetching usuarios list', listErr);
        }
        throw new Response('Usuario no encontrado', { status: 404 });
    }
}

export async function action({ request, params }: ActionFunctionArgs) {
    const { id } = params;
    if (!id) throw new Response('Falta identificador de usuario', { status: 400 });

    const token = localStorage.getItem('token');
    if (!token) throw new Response('Unauthorized', { status: 401 });

    const formData = Object.fromEntries(await request.formData());
    // Build payload: allow updating correo and id_rol; password optional
    const payload: any = {};
    if (formData.correo) payload.correo = formData.correo as string;
    if (formData.id_rol) payload.id_rol = Number(formData.id_rol);
    if (formData.password) payload.password = String(formData.password);

    try {
        const url = `http://localhost:3000/api/user/${encodeURIComponent(id)}`;
        await axios.put(url, payload, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } });
        return redirect('/Usuario/ListaUsuarios');
    } catch (err:any) {
        console.error('Error updating usuario', err);
        return new Response(err?.response?.data ?? err?.message ?? 'Error', { status: 500 });
    }
}

export default function EditarUsuario() {
    const data = useLoaderData() as any;
    const usuario = data?.data ?? data ?? {};

    return (
        <>
            <div className="row bg-primary text-white py-3 mb-5">
                <div className="col text-center">
                    <h1>Editar Usuario</h1>
                </div>
            </div>
            <div className="container mb-5">
                <Form method="post" className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="correo" className="form-label">Correo</label>
                        <input id="correo" name="correo" type="email" className="form-control" defaultValue={usuario.correo ?? ''} required />
                    </div>
                    <div className="col-md-3 mb-3">
                        <label htmlFor="id_rol" className="form-label">Rol</label>
                        <select id="id_rol" name="id_rol" className="form-select" defaultValue={String(usuario.id_rol ?? '')}>
                            <option value="">--</option>
                            <option value="1">1 - Administrador</option>
                            <option value="2">2 - Profesor</option>
                            <option value="3">3 - Alumno</option>
                        </select>
                    </div>
                    <div className="col-md-3 mb-3">
                        <label htmlFor="password" className="form-label">Nueva contraseña (opcional)</label>
                        <input id="password" name="password" type="password" className="form-control" />
                    </div>
                    <div className="col-12 text-center mt-3">
                        <button type="submit" className="btn btn-primary">Guardar cambios</button>
                    </div>
                </Form>
            </div>
        </>
    );
}
