import axios from "axios";
import { useState } from "react";
import { redirect, type ActionFunctionArgs, type LoaderFunctionArgs, useLoaderData, Form } from "react-router-dom";

export async function loader({ params }: LoaderFunctionArgs) {
    const { rut } = params;
    if (!rut) {
        throw new Response("Rut parameter is missing", { status: 400 });
    }

    const token = localStorage.getItem('token');
    if (!token) {
        throw new Response("Unauthorized", { status: 401 });
    }

    try {
        const url = `http://localhost:3000/api/alumno/${rut}`;
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data; // Return only the `data` property
    } catch (error) {
        throw new Response("Alumno not found", { status: 404 });
    }
}

export async function action({ request, params }: ActionFunctionArgs) {
    const { rut } = params;
    if (!rut) {
        throw new Response("Rut parameter is missing", { status: 400 });
    }

    const token = localStorage.getItem('token');
    if (!token) {
        throw new Response("Unauthorized", { status: 401 });
    }

    const FormData = Object.fromEntries(await request.formData());
    try {
        const url = `http://localhost:3000/api/alumno/${rut}`;
        await axios.put(url, FormData, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return redirect('/Alumno/ListaAlumnos'); // Redirect after successful update
    } catch (error) {
        console.error("Error updating alumno:", error);
        return new Response("Failed to update alumno", { status: 500 });
    }
}

export default function EditarAlumno() {
    const alumno = useLoaderData() as {
        data: {
            rut_alumno: string;
            rut_apoderado: string;
            nombre_alumno: string;
            apellido_paterno: string;
            apellido_materno: string;
            telefono_alumno: string;
            correo_alumno: string;
            direccion_alumno: string;
            diagnostico_ne: string;
            anio_ingreso_orquesta: string;
        };
    };

    const [rutApoderados] = useState(["12345678-9", "98765432-1", "11223344-5"]);

    return (
        <>
            <div className="row bg-primary text-white py-3 mb-5">
                <div className="col text-center">
                    <h1>Editar un alumno</h1>
                </div>
            </div>
            <div className="container mb-5">
                <Form method="post" className="row">
                    <div className="col-md-6">
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="rut_alumno" className="form-label">RUT Alumno: XX.XXX.XXX-X <span className="text-danger">*</span></label>
                            <input 
                                type="text" 
                                id="rut_alumno" 
                                name="rut_alumno" 
                                maxLength={12} 
                                required 
                                pattern="\d{2}\.\d{3}\.\d{3}-[\dkK]" 
                                title="El RUT debe tener el formato XX.XXX.XXX-X" 
                                className="form-control" 
                                readOnly 
                                defaultValue={alumno.data.rut_alumno}
                                style={{ backgroundColor: "#e9ecef" }}
                            />
                        </div>
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="rut_apoderado" className="form-label">RUT Apoderado:</label>
                            <select id="rut_apoderado" name="rut_apoderado" required className="form-select" defaultValue={alumno.data.rut_apoderado}>
                                <option value="">Seleccione un RUT</option>
                                {rutApoderados.map((rut, index) => (
                                    <option key={index} value={rut}>{rut}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="nombre_alumno" className="form-label">Nombre Alumno:</label>
                            <input type="text" id="nombre_alumno" name="nombre_alumno" maxLength={10} required className="form-control" defaultValue={alumno.data.nombre_alumno} />
                        </div>
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="apellido_paterno" className="form-label">Apellido Paterno:</label>
                            <input type="text" id="apellido_paterno" name="apellido_paterno" maxLength={10} required className="form-control" defaultValue={alumno.data.apellido_paterno} />
                        </div>
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="apellido_materno" className="form-label">Apellido Materno:</label>
                            <input type="text" id="apellido_materno" name="apellido_materno" maxLength={10} required className="form-control" defaultValue={alumno.data.apellido_materno} />
                        </div>
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="telefono_alumno" className="form-label">Teléfono Alumno:</label>
                            <input type="text" id="telefono_alumno" name="telefono_alumno" required className="form-control" defaultValue={alumno.data.telefono_alumno} />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="correo_alumno" className="form-label">Correo Alumno:</label>
                            <input type="email" id="correo_alumno" name="correo_alumno" maxLength={40} required className="form-control" defaultValue={alumno.data.correo_alumno} />
                        </div>
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="direccion_alumno" className="form-label">Dirección Alumno:</label>
                            <input type="text" id="direccion_alumno" name="direccion_alumno" maxLength={50} required className="form-control" defaultValue={alumno.data.direccion_alumno} />
                        </div>
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="anio_ingreso_orquesta" className="form-label">Año Ingreso Orquesta:</label>
                            <input type="number" id="anio_ingreso_orquesta" name="anio_ingreso_orquesta" min={1900} max={2100} required className="form-control" defaultValue={alumno.data.anio_ingreso_orquesta} />
                        </div>
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="diagnostico_ne" className="form-label">Diagnóstico NE:</label>
                            <textarea id="diagnostico_ne" name="diagnostico_ne" maxLength={100} className="form-control" style={{ height: "275px" }} defaultValue={alumno.data.diagnostico_ne}></textarea>
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