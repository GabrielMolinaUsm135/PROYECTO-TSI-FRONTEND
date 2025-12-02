import axios from "axios";
import { redirect, type ActionFunctionArgs, type LoaderFunctionArgs, useLoaderData, Form } from "react-router-dom";

export async function loader({ params }: LoaderFunctionArgs) {
    const { id } = params;
    if (!id) {
        throw new Response("ID de Alumno no encontrado", { status: 400 });
    }

    const token = localStorage.getItem('token');
    if (!token) {
        throw new Response("Unauthorized", { status: 401 });
    }

    try {
        const url = `http://localhost:3000/api/Tnotas/${id}`;
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const resultado = response.data;
        const notasData = resultado?.data ?? resultado;
        return resultado; // enriched resultado
    } catch (error) {
        throw new Response("Notas no encontradas", { status: 404 });
    }
}

export async function action({ request, params }: ActionFunctionArgs) {
    const { id } = params;
    if (!id) {
        throw new Response("ID de profesor parameter is missing", { status: 400 });
    }

    const token = localStorage.getItem('token');
    if (!token) {
        throw new Response("Unauthorized", { status: 401 });
    }

    // Parse form and update each nota individually
    const form = await request.formData();
    const entries: Record<string, any> = {};
    for (const [k, v] of form.entries()) {
        entries[k] = v;
    }

    // collect note groups by index: fields named like id_nota_0, nota_0, nombre_0, fecha_0
    const updates: Array<{ id_nota: string; nota?: number; nombre_evaluacion?: string; fecha_evaluacion?: string }> = [];
    const idKeys = Object.keys(entries).filter(k => k.startsWith('id_nota_'));
    for (const idKey of idKeys) {
        const idx = idKey.replace('id_nota_', '');
        const id_nota = String(entries[idKey]);
        const notaVal = entries[`nota_${idx}`];
        const nombreVal = entries[`nombre_${idx}`];
        const fechaVal = entries[`fecha_${idx}`];
        updates.push({ id_nota, nota: notaVal !== undefined ? Number(notaVal) : undefined, nombre_evaluacion: nombreVal ? String(nombreVal) : undefined, fecha_evaluacion: fechaVal ? String(fechaVal) : undefined });
    }

    try {
        for (const u of updates) {
            if (!u.id_nota) continue;
            const payload: Record<string, any> = {};
            if (u.nota !== undefined && !Number.isNaN(u.nota)) payload.nota = u.nota;
            if (u.nombre_evaluacion) payload.nombre_evaluacion = u.nombre_evaluacion;
            if (u.fecha_evaluacion) payload.fecha_evaluacion = u.fecha_evaluacion;
            if (Object.keys(payload).length === 0) continue;
            const url = `http://localhost:3000/api/notas/${encodeURIComponent(String(u.id_nota))}`;
            await axios.put(url, payload, { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } });
        }
        return redirect(`/alumno/notas/${id}`);
    } catch (err:any) {
        console.error('Error updating notas:', err?.response ?? err);
        const msg = err?.response?.data ?? err?.message ?? 'Failed to update notas';
        return new Response(typeof msg === 'string' ? msg : JSON.stringify(msg), { status: 500 });
    }
}
export default function NotaEdit() {
    const loaderData = useLoaderData() as any;
    // loader returns either { data: [...] } or an array directly
    const notas = loaderData?.data ?? loaderData ?? [];

    return (
        <>
            <div className="row bg-primary text-white py-3 mb-4">
                <div className="col text-center">
                    <h1>Editar Notas</h1>
                </div>
            </div>

            <div className="container">
                <Form method="post">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Evaluación</th>
                                <th>Nota</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(notas) && notas.length > 0 ? (
                                notas.map((n: any, idx: number) => {
                                    const idKey = `id_nota_${idx}`;
                                    const notaKey = `nota_${idx}`;
                                    const nombreKey = `nombre_${idx}`;
                                    const fechaKey = `fecha_${idx}`;
                                    // format date for input[type=date]
                                    let fechaVal = '';
                                    const rawFecha = n.fecha_evaluacion ?? n.fecha ?? n.fecha_eval ?? n.created_at;
                                    if (rawFecha) {
                                        const d = new Date(rawFecha);
                                        if (!isNaN(d.getTime())) {
                                            const yyyy = d.getFullYear();
                                            const mm = String(d.getMonth() + 1).padStart(2, '0');
                                            const dd = String(d.getDate()).padStart(2, '0');
                                            fechaVal = `${yyyy}-${mm}-${dd}`;
                                        }
                                    }

                                    return (
                                        <tr key={idx}>
                                            <td>
                                                <input type="date" name={fechaKey} defaultValue={fechaVal} className="form-control" />
                                            </td>
                                            <td>
                                                <input type="text" name={nombreKey} defaultValue={n.nombre_evaluacion ?? n.nombre ?? n.titulo ?? ''} className="form-control" />
                                            </td>
                                            <td>
                                                <input type="number" step="0.1" min="0" max="100" name={notaKey} defaultValue={n.nota ?? n.score ?? n.valor ?? ''} className="form-control" />
                                            </td>
                                                <td>
                                                    <input type="hidden" name={idKey} defaultValue={n.id_nota ?? n.id ?? ''} />
                                                </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={3} className="text-center">No hay notas disponibles</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className="d-flex justify-content-center">
                        <button type="submit" className="btn btn-primary">Guardar notas</button>
                    </div>
                </Form>
            </div>
        </>
    );
}
