import { Link, useLoaderData, type LoaderFunctionArgs, useNavigate } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../services/axiosinstance";

export async function loader({ params }: LoaderFunctionArgs) {
    const idOrRut = params.id;
    if (!idOrRut) {
        throw new Response("Alumno identifier is missing", { status: 400 });
    }

    const token = localStorage.getItem('token');
    if (!token) {
        throw new Response("Unauthorized", { status: 401 });
    }

    try {
        // backend seems to accept the same endpoint for id or rut; try directly
        const url = `http://localhost:3000/api/alumno/${encodeURIComponent(idOrRut)}`;
        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const alumno = response.data; // expected shape: { data: { ... } }

        // if correo is missing, but there's an associated user id, fetch the user to obtain correo
        const alumnoData = alumno?.data ?? alumno;
        if ((alumnoData && !alumnoData.correo) && (alumnoData?.id_usuario || alumnoData?.id_user)) {
            const userId = alumnoData.id_usuario ?? alumnoData.id_user;
            try {
                const userUrl = `http://localhost:3000/api/user/${encodeURIComponent(userId)}`;
                const userRes = await axios.get(userUrl, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const userData = userRes.data?.data ?? userRes.data;
                if (userData?.correo) {
                    // attach correo to the alumno data so the component can display it
                    if (alumno.data) alumno.data.correo = userData.correo;
                    else alumno.correo = userData.correo;
                }
            } catch (userErr) {
                // if user lookup fails, continue returning alumno (no correo)
                console.warn('Could not fetch associated user for correo:', userErr);
            }
        }

        // attempt to fetch notas for this alumno (Tnotas/:id_alumno)
        const alumnoDataForNotas = alumno?.data ?? alumno;
        let notas = [];
        if (alumnoDataForNotas?.id_alumno) {
            try {
                const notasRes = await getNotasAlumno(alumnoDataForNotas.id_alumno);
                notas = notasRes?.data ?? notasRes ?? [];
            } catch (notaErr) {
                console.warn('No se pudieron obtener las notas del alumno:', notaErr);
                notas = [];
            }
        }

        // return combined payload: { alumno: <original>, notas: [...] }
        return { alumno: alumno, notas };
    } catch (error) {
        throw new Response("Alumno not found", { status: 404 });
    }
}

export async function getNotasAlumno(id_alumno: number | string) {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Response("Unauthorized", { status: 401 });
    }
    try{   
        const url = `http://localhost:3000/api/Tnotas/${encodeURIComponent(id_alumno)}`;
        const notaResponse = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return notaResponse.data;
     }
    catch (error) {
        throw new Response("Notas no encontradas", { status: 404 });
    }
}

type AlumnoData = {
    data: {
        id_alumno?: number | string;
        id_usuario?: number | string;
        rut?: string;
        rut_apoderado?: string;
        nombre?: string;
        apellido_paterno?: string;
        apellido_materno?: string;
        telefono?: string;
        correo: string;
        direccion?: string;
        diagnostico_ne?: string;
        anio_ingreso_orquesta?: string;
    };
    
};

type NotasData = {
    data: {
        id_nota?: number | string;
        id_alumno?: number | string;
        fecha_evaluacion?: Date;
        nombre_evaluacion?: string;
        nota?: number;
    }
}

export default function FichaAlumno() {
    const loader = useLoaderData() as any;
    const alumno = loader?.alumno ?? loader;
    const notas: any[] = loader?.notas ?? [];
    const navigate = useNavigate();
    console.log('alumno loader:', alumno);
    console.log('notas loader:', notas);
    const alumnoId = alumno?.data?.id_alumno ?? alumno?.data?.id ?? alumno?.id_alumno ?? alumno?.id ?? null;
    const canEditNotas = !!alumnoId && Array.isArray(notas) && notas.length >= 4;
    const canCreateNotas = !!alumnoId && Array.isArray(notas) && notas.length < 4;

    async function createMissingNotas() {
        if (!alumnoId) return;
        const missing = 4 - (Array.isArray(notas) ? notas.length : 0);
        if (missing <= 0) return;

        const token = localStorage.getItem('token');
        if (!token) {
            alert('No autorizado');
            return;
        }

        // attempt to get alumno info (id_alumno/id_usuario)
        let id_alumno = alumno?.data?.id_alumno ?? alumno?.data?.id ?? alumno?.id_alumno ?? alumno?.id ?? null;
        let id_usuario = alumno?.data?.id_usuario ?? alumno?.data?.id_user ?? null;

        try {
            // if id_alumno not present, fetch alumno by route id
            if (!id_alumno) {
                const res = await axios.get(`http://localhost:3000/api/alumno/${encodeURIComponent(String(alumnoId))}`, { headers: { Authorization: `Bearer ${token}` } });
                const a = res.data?.data ?? res.data ?? null;
                id_alumno = a?.id_alumno ?? a?.id ?? null;
                id_usuario = id_usuario ?? a?.id_usuario ?? a?.id_user ?? null;
            }

            if (!id_alumno) {
                alert('No se pudo obtener id_alumno para crear notas');
                return;
            }

            const today = new Date().toISOString().split('T')[0];
            for (let i = 1; i <= missing; i++) {
                const payload: Record<string, any> = {
                    id_alumno,
                    fecha_evaluacion: today,
                    nombre_evaluacion: `Evaluación ${ (Array.isArray(notas) ? notas.length : 0) + i }`,
                    nota: null,
                };
                if (id_usuario) payload.id_usuario = id_usuario;
                try {
                    await axiosInstance.post('/notas', payload);
                } catch (err) {
                    console.warn('Error creando nota por defecto', err);
                }
            }

            // refresh the ficha after creation
            navigate(0);
        } catch (err) {
            console.error('Error al crear notas faltantes:', err);
            alert('Error creando notas. Revisa la consola.');
        }
    }

    return (
        <>
            <div className="row bg-primary text-white py-3 mb-5">
                <div className="col text-center">
                    <h1>Ficha "{alumno.data.nombre} {alumno.data.apellido_paterno} {alumno.data.apellido_materno}"</h1>
                </div>
            </div>
            <div className="container mt-5 mb-5">
                <div className="row h-100 align-items-stretch">
                    {/* Column 1 */}
                    <div className="col-md-3 d-flex flex-column justify-content-center align-items-center border bg-primary bg-opacity-50">
                        <div className="text-center">
                            <img
                                src="https://t4.ftcdn.net/jpg/05/42/36/11/360_F_542361185_VFRJWpR2FH5OiAEVveWO7oZnfSccZfD3.jpg"
                                alt="Foto del alumno"
                                className="img-fluid border"
                            />
                        </div>
                    </div>
                    {/* Column 2 */}
                    <div className="col-md-8 d-flex flex-column justify-content-center align-items-start border">
                        <h3 className="text-center w-100">ALUMNO</h3>
                        <div>
                            <div className="mb-2 d-flex justify-content-start">
                                <h5 className="me-2">Rut:</h5>
                                <p>{alumno.data.rut}</p>
                            </div>
                            <div className="mb-2 d-flex justify-content-start">
                                <h5 className="me-2">Rut Apoderado:</h5>
                                <p>{alumno.data.rut_apoderado}</p>
                            </div>
                            <div className="mb-2 d-flex justify-content-start">
                                <h5 className="me-2">Nombre:</h5>
                                <p>{alumno.data.nombre}</p>
                            </div>
                            <div className="mb-2 d-flex justify-content-start">
                                <h5 className="me-2">Apellido Paterno:</h5>
                                <p>{alumno.data.apellido_paterno}</p>
                            </div>
                            <div className="mb-2 d-flex justify-content-start">
                                <h5 className="me-2">Apellido Materno:</h5>
                                <p>{alumno.data.apellido_materno}</p>
                            </div>
                            <div className="mb-2 d-flex justify-content-start">
                                <h5 className="me-2">Teléfono:</h5>
                                <p>{alumno.data.telefono}</p>
                            </div>
                            <div className="mb-2 d-flex justify-content-start">
                                <h5 className="me-2">Correo:</h5>
                                <p>{alumno.data.correo}</p>
                            </div>
                            <div className="mb-2 d-flex justify-content-start">
                                <h5 className="me-2">Dirección:</h5>
                                <p>{alumno.data.direccion}</p>
                            </div>
                            <div className="mb-2 d-flex justify-content-start">
                                <h5 className="me-2">Diagnóstico NE:</h5>
                                <p>{alumno.data.diagnostico_ne}</p>
                            </div>
                            <div className="mb-2 d-flex justify-content-start">
                                <h5 className="me-2">Año de Ingreso a la Orquesta:</h5>
                                <p>{alumno.data.anio_ingreso_orquesta}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container mt-4">
                <h3 className="text-center mb-3">Desempeño Teoria Musical</h3>
                        <table className="table table-bordered text-center">
                    <thead className="table-primary">
                        <tr>
                            <th>Nota 1</th>
                            <th>Nota 2</th>
                            <th>Nota 3</th>
                            <th>Nota Final</th>
                            <th>Asistencia %</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{notas[0]?.nota ?? '-'}</td>
                            <td>{notas[1]?.nota ?? '-'}</td>
                            <td>{notas[2]?.nota ?? '-'}</td>
                            <td>{(notas[0]?.nota + notas[1]?.nota + notas[2]?.nota) / 3}</td>
                            <td>{notas[3]?.nota ?? '-'}</td>
                        </tr>
                    </tbody>
                </table>
                        <div className="d-flex justify-content-center mt-3">
                            {canEditNotas ? (
                                <Link to={`/alumno/notas/${encodeURIComponent(String(alumnoId))}`} className="btn btn-warning me-2">Editar Notas</Link>
                            ) : (
                                <button className="btn btn-warning me-2" disabled title="Se requieren 4 notas enlazadas para editar">Editar Notas</button>
                            )}

                            {canCreateNotas ? (
                                <button className="btn btn-success" onClick={() => createMissingNotas()}>Crear notas faltantes</button>
                            ) : (
                                <button className="btn btn-success" disabled title="No se pueden crear más notas">Crear notas faltantes</button>
                            )}
                        </div>
            </div>

            <div className="container mt-4">
                <h3 className="text-center mb-3">Préstamos Instrumentos/Insumos</h3>
                <table className="table table-bordered text-center">
                    <thead className="table-primary">
                        <tr>
                            <th>Item</th>
                            <th>Fecha de Inicio</th>
                            <th>Fecha de Devolución</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><Link to="/DetalleInstrumento">Violin</Link></td>
                            <td>01-03-2025</td>
                            <td>15-05-2025</td>
                            <td>En uso</td>
                        </tr>
                        <tr>
                            <td><Link to="/DetalleInsumo">Pecastilla</Link></td>
                            <td>05-03-2025</td>
                            <td>20-03-2025</td>
                            <td>Atrasado</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            </div>
        </>
    );
}