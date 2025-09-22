import { useLoaderData, type LoaderFunctionArgs } from "react-router-dom";
import axios from "axios";

export async function loader({ params }: LoaderFunctionArgs) {
    const { rut } = params;
    if (!rut) {
        throw new Response("Rut parameter is missing", { status: 400 });
    }

    try {
        const url = `http://localhost:3000/api/alumno/${rut}`;
        const response = await axios.get(url);
        return response.data; // Return only the `data` property
    } catch (error) {
        throw new Response("Alumno not found", { status: 404 });
    }
}

export default function FichaAlumno() {
    const alumno = useLoaderData();
    console.log(alumno);

    return (
        <>
            <div className="row bg-primary text-white py-3 mb-5">
                <div className="col text-center">
                    <h1>Ficha {alumno.data.nombre_alumno} {alumno.data.apellido_paterno} {alumno.data.apellido_materno}</h1>
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
                                <p>{alumno.data.rut_alumno}</p>
                            </div>
                            <div className="mb-2 d-flex justify-content-start">
                                <h5 className="me-2">Rut Apoderado:</h5>
                                <p>{alumno.data.rut_apoderado}</p>
                            </div>
                            <div className="mb-2 d-flex justify-content-start">
                                <h5 className="me-2">Nombre:</h5>
                                <p>{alumno.data.nombre_alumno}</p>
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
                                <p>{alumno.data.telefono_alumno}</p>
                            </div>
                            <div className="mb-2 d-flex justify-content-start">
                                <h5 className="me-2">Correo:</h5>
                                <p>{alumno.data.correo_alumno}</p>
                            </div>
                            <div className="mb-2 d-flex justify-content-start">
                                <h5 className="me-2">Dirección:</h5>
                                <p>{alumno.data.direccion_alumno}</p>
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
            </div>
        </>
    );
}