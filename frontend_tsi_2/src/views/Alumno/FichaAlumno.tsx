import { Link, useLoaderData, type LoaderFunctionArgs } from "react-router-dom";
import axios from "axios";

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

        return alumno;
    } catch (error) {
        throw new Response("Alumno not found", { status: 404 });
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

export default function FichaAlumno() {
    const alumno = useLoaderData() as AlumnoData;
    console.log(alumno);

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
                            <th>Prueba Final</th>
                            <th>Asistencia %</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>6.5</td>
                            <td>5.8</td>
                            <td>6.0</td>
                            <td>6.2</td>
                            <td>95%</td>
                        </tr>
                    </tbody>
                </table>
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