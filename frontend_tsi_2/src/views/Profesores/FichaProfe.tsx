import axios from "axios";
import { useLoaderData, type LoaderFunctionArgs } from "react-router";

export async function loader({ params }: LoaderFunctionArgs) {
    const idOrRut = params.id;
    if (!idOrRut) {
        throw new Response("Profesor identifier is missing", { status: 400 });
    }

    const token = localStorage.getItem('token');
    if (!token) {
        throw new Response("Unauthorized", { status: 401 });
    }

    try {
        // backend seems to accept the same endpoint for id or rut; try directly
        const url = `http://localhost:3000/api/profesores/${encodeURIComponent(idOrRut)}`;
        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const profesor = response.data; 


        const profesorData = profesor?.data ?? profesor;
        if ((profesorData && !profesorData.correo) && (profesorData?.id_usuario || profesorData?.id_user)) {
            const userId = profesorData.id_usuario ?? profesorData.id_user;
            try {
                const userUrl = `http://localhost:3000/api/user/${encodeURIComponent(userId)}`;
                const userRes = await axios.get(userUrl, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const userData = userRes.data?.data ?? userRes.data;
                if (userData?.correo) {
                    // attach correo to the profesor data so the component can display it
                    if (profesor.data) profesor.data.correo = userData.correo;
                    else profesor.correo = userData.correo;
                }
            } catch (userErr) {
                // if user lookup fails, continue returning profesor (no correo)
                console.warn('Could not fetch associated user for correo:', userErr);
            }
        }

        return profesor;
    } catch (error) {
        throw new Response("Profesor not found", { status: 404 });
    }
}
type ProfesorData = {
    data: {
        id_profesor?: number | string;
        id_usuario?: number | string;
        rut?: string;
        nombre?: string;
        apellido_paterno?: string;
        apellido_materno?: string;
        telefono?: string;
        asignatura?: string;
        direccion?: string;
        correo?: string;
    };
};


export default function FichaProfesor() {
    const profesor = useLoaderData() as ProfesorData;
    console.log(profesor);

    return (
        <>
            <div className="row bg-primary text-white py-3 mb-5">
                <div className="col text-center">
                    <h1>Ficha "{profesor.data.nombre} {profesor.data.apellido_paterno} {profesor.data.apellido_materno}"</h1>
                </div>
            </div>
            <div className="container mt-5 mb-5">
                <div className="row h-100 align-items-stretch">                    
                    {/* Column 2 */}
                    <div className="col-md-8 d-flex flex-column justify-content-center align-items-start border">
                        <h3 className="text-center w-100">PROFESOR</h3>
                        <div>
                            <div className="mb-2 d-flex justify-content-start">
                                <h5 className="me-2">Rut:</h5>
                                <p>{profesor.data.rut}</p>
                            </div>
                            <div className="mb-2 d-flex justify-content-start">
                                <h5 className="me-2">Nombre:</h5>
                                <p>{profesor.data.nombre}</p>
                            </div>
                            <div className="mb-2 d-flex justify-content-start">
                                <h5 className="me-2">Apellido Paterno:</h5>
                                <p>{profesor.data.apellido_paterno}</p>
                            </div>
                            <div className="mb-2 d-flex justify-content-start">
                                <h5 className="me-2">Apellido Materno:</h5>
                                <p>{profesor.data.apellido_materno}</p>
                            </div>
                            <div className="mb-2 d-flex justify-content-start">
                                <h5 className="me-2">Teléfono:</h5>
                                <p>{profesor.data.telefono}</p>
                            </div>
                            <div className="mb-2 d-flex justify-content-start">
                                <h5 className="me-2">Correo:</h5>
                                <p>{profesor.data.correo}</p>
                            </div>
                            <div className="mb-2 d-flex justify-content-start">
                                <h5 className="me-2">Dirección:</h5>
                                <p>{profesor.data.direccion}</p>
                            </div>
                            <div className="mb-2 d-flex justify-content-start">
                                <h5 className="me-2">Materia:</h5>
                                <p>{profesor.data.asignatura}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

