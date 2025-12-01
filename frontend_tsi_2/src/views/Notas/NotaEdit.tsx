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

    // This route currently only displays notas. If you need to support editing/submitting notas,
    // implement the appropriate payload and endpoint here. For now, keep the action as a safe no-op.
    return redirect(`/Notas/Editar/${id}`);
}
export default function NotaEdit() {
    const loaderData = useLoaderData() as any;
    // loader returns either { data: [...] } or an array directly
    const notas = loaderData?.data ?? loaderData ?? [];

    return (
        <>
            <div className="row bg-primary text-white py-3 mb-4">
                <div className="col text-center">
                    <h1>Notas</h1>
                </div>
            </div>

            <div className="container">
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
                            notas.map((n: any, idx: number) => (
                                <tr key={idx}>
                                    <td>{n.fecha_evaluacion ? new Date(n.fecha_evaluacion).toLocaleDateString() : (n.fecha ? new Date(n.fecha).toLocaleDateString() : '-')}</td>
                                    <td>{n.nombre_evaluacion ?? n.nombre ?? n.titulo ?? '-'}</td>
                                    <td>{n.nota ?? n.score ?? n.valor ?? '-'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="text-center">No hay notas disponibles</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}
