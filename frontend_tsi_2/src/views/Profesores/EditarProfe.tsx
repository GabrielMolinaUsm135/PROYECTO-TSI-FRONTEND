import axios from "axios";
import { redirect, type ActionFunctionArgs, type LoaderFunctionArgs, useLoaderData, Form } from "react-router-dom";

export async function loader({ params }: LoaderFunctionArgs) {
    const { id } = params;
    if (!id) {
        throw new Response("ID de profesor no encontrado", { status: 400 });
    }

    const token = localStorage.getItem('token');
    if (!token) {
        throw new Response("Unauthorized", { status: 401 });
    }

    try {
        const url = `http://localhost:3000/api/profesores/${id}`;
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const resultado = response.data;
        const profesorData = resultado?.data ?? resultado;

        // If profesor has an associated usuario id, try to fetch the user to obtain correo
        const userId = profesorData?.id_usuario ?? profesorData?.id_user ?? profesorData?.usuario?.id ?? null;
        if (userId) {
            try {
                const userUrl = `http://localhost:3000/api/user/${encodeURIComponent(userId)}`;
                const userRes = await axios.get(userUrl, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const userData = userRes.data?.data ?? userRes.data;
                if (userData?.correo) {
                    if (resultado?.data) resultado.data.correo = userData.correo;
                    else resultado.correo = userData.correo;
                }
                // attach usuario payload to resultado for components expecting it
                resultado.usuario = userRes.data;
            } catch (userErr) {
                console.warn('Could not fetch associated user for correo:', userErr);
            }
        }

        return resultado; // enriched resultado
    } catch (error) {
        throw new Response("Profesor no encontrado", { status: 404 });
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

    const formEntries = Object.fromEntries(await request.formData());
    // map form field names to the API expected payload keys
    const payload = {
        rut: formEntries.rut_profesor ?? formEntries.rut ?? null,
        nombre: formEntries.nombre_profesor ?? formEntries.nombre ?? null,
        apellido_paterno: formEntries.apellido_paterno ?? null,
        apellido_materno: formEntries.apellido_materno ?? null,
        telefono: formEntries.telefono_profesor ?? formEntries.telefono ?? null,
        correo: formEntries.correo ?? null,
        direccion: formEntries.direccion ?? null,
        asignatura: formEntries.asignatura ?? null,
    };

    try {
        const url = `http://localhost:3000/api/profesores/${id}`;
        await axios.put(url, payload, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return redirect('/Profesor/ListaProfesores'); // Redirect after successful update
    } catch (error:any) {
        console.error("Error updating profesor:", error?.response ?? error);
        const msg = error?.response?.data ?? error?.message ?? 'Failed to update profesor';
        return new Response(typeof msg === 'string' ? msg : JSON.stringify(msg), { status: 500 });
    }
}

export default function EditarProfesor() {
    const loaderData = useLoaderData() as any;
    const profesorData = loaderData?.data ?? loaderData ?? {};
    const usuarioCorreo = loaderData?.usuario?.data?.correo ?? loaderData?.data?.correo ?? loaderData?.correo ?? '';
    return (
        <>
            <div className="row bg-primary text-white py-3 mb-5">
                <div className="col text-center">
                    <h1>Editar un profesor</h1>
                </div>
            </div>
            <div className="container mb-5">
                <Form method="post" className="row">
                    <div className="col-md-6">
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="rut_profesor" className="form-label">RUT Profesor: XX.XXX.XXX-X <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                id="rut_profesor"
                                name="rut_profesor"
                                maxLength={12}
                                required
                                pattern="\d{2}\.\d{3}\.\d{3}-[\dkK]"
                                title="El RUT debe tener el formato XX.XXX.XXX-X"
                                className="form-control"
                                readOnly
                                defaultValue={profesorData.rut}
                                style={{ backgroundColor: "#e9ecef" }}
                            />
                        </div>

                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="nombre_profesor" className="form-label">Nombre Profesor:</label>
                            <input type="text" id="nombre_profesor" name="nombre_profesor" maxLength={50} required className="form-control" defaultValue={profesorData.nombre} />
                        </div>
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="apellido_paterno" className="form-label">Apellido Paterno:</label>
                            <input type="text" id="apellido_paterno" name="apellido_paterno" maxLength={50} required className="form-control" defaultValue={profesorData.apellido_paterno} />
                        </div>
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="apellido_materno" className="form-label">Apellido Materno:</label>
                            <input type="text" id="apellido_materno" name="apellido_materno" maxLength={50} required className="form-control" defaultValue={profesorData.apellido_materno} />
                        </div>
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="telefono_profesor" className="form-label">Teléfono Profesor:</label>
                            <input type="text" id="telefono_profesor" name="telefono_profesor" required className="form-control" defaultValue={profesorData.telefono} />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="correo" className="form-label">Correo Profesor:</label>
                            <input type="email" id="correo" name="correo" maxLength={40} required className="form-control" defaultValue={usuarioCorreo} />
                        </div>
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="direccion" className="form-label">Dirección Profesor:</label>
                            <input type="text" id="direccion" name="direccion" maxLength={50} required className="form-control" defaultValue={profesorData.direccion} />
                        </div>
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="asignatura" className="form-label">Asignatura</label>
                            <input type="text" id="asignatura" name="asignatura" maxLength={50} required className="form-control" defaultValue={profesorData.asignatura} />
                        </div>
                    </div>
                    <div className="col-12 text-center">
                        <button type="submit" className="btn btn-primary">Confirmar</button>
                    </div>
                </Form>
            </div>
        </>
    );
}