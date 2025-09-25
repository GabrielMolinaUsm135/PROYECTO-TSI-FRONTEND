import { useState } from "react";
import { Form, redirect, useActionData, type ActionFunctionArgs } from "react-router-dom";
import { alumnoCrear } from "../../services/AlumnoService";
import axios from "axios";

export async function action({ request }: ActionFunctionArgs) {
    const FormData = Object.fromEntries(await request.formData());
    const rut = FormData.rut_alumno as string;

    try {
        // Check if the RUT already exists in the database using the provided endpoint
        const checkUrl = `http://localhost:3000/alumno/${rut}`;
        const checkResponse = await axios.get(checkUrl);

        if (checkResponse.data) {
            return { error: "El RUT ya está registrado en la base de datos" };
        }

        // Proceed to create the alumno if the RUT does not exist
        const resultado = await alumnoCrear(FormData);

        if (resultado?.success) {
            return redirect('/Alumno/ListaAlumnos');
        }

        return { error: "rut no valido." };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            // If the RUT does not exist (404), proceed to create the alumno
            try {
                const resultado = await alumnoCrear(FormData);

                if (resultado?.success) {
                    return redirect('/Alumno/ListaAlumnos');
                }

                return { error: "No se pudo crear el alumno. Por favor, intente nuevamente." };
            } catch (createError) {
                console.error("Error creating alumno:", createError);
                return { error: "Ocurrió un error al crear el alumno. Por favor, intente más tarde." };
            }
        }

        console.error("Error checking alumno by RUT:", error);
        return { error: "Ocurrió un error al verificar el RUT. Por favor, intente más tarde." };
    }
}

export default function CrearAlumno() {
    const actionData = useActionData() as { error?: string };
    const [rutApoderados] = useState([
        "12345678-9", 
        "98765432-1", 
        "11223344-5"
    ]);

    const currentYear = new Date().getFullYear();

    return(
        <>
            <div className="row bg-primary text-white py-3 mb-5">
                <div className="col text-center">
                    <h1>Crear un alumno</h1>
                </div>
            </div>
            <div className="container mb-5">
                {actionData?.error && (
                    <div className="alert alert-danger" role="alert">
                        {actionData.error}
                    </div>
                )}
                <Form method="POST" className="row">
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
                            />
                        </div>
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="rut_apoderado" className="form-label">RUT Apoderado: <span className="text-danger">*</span></label>
                            <select id="rut_apoderado" name="rut_apoderado" required className="form-select">
                                <option value="">Seleccione un RUT</option>
                                {rutApoderados.map((rut, index) => (
                                    <option key={index} value={rut}>{rut}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="nombre_alumno" className="form-label">Nombre Alumno: <span className="text-danger">*</span></label>
                            <input type="text" id="nombre_alumno" name="nombre_alumno" maxLength={10} required className="form-control" />
                        </div>
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="apellido_paterno" className="form-label">Apellido Paterno: <span className="text-danger">*</span></label>
                            <input type="text" id="apellido_paterno" name="apellido_paterno" maxLength={10} required className="form-control" />
                        </div>
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="apellido_materno" className="form-label">Apellido Materno: <span className="text-danger">*</span></label>
                            <input type="text" id="apellido_materno" name="apellido_materno" maxLength={10} required className="form-control" />
                        </div>
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="telefono_alumno" className="form-label">Teléfono Alumno: <span className="text-danger">*</span></label>
                            <input
                                type="tel"
                                id="telefono_alumno"
                                name="telefono_alumno"
                                maxLength={9}
                                minLength={9}
                                required
                                pattern="\d{9}"
                                title="El teléfono debe contener exactamente 9 dígitos"
                                className="form-control"
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="correo_alumno" className="form-label">Correo Alumno: <span className="text-danger">*</span></label>
                            <input 
                                type="email" 
                                id="correo_alumno" 
                                name="correo_alumno" 
                                maxLength={40} 
                                required 
                                pattern="^[^@\s]+@[^@\s]+\.[^@\s]+$" 
                                title="Ingrese un correo válido (e.g., usuario@dominio.com)" 
                                className="form-control" 
                            />
                        </div>
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="direccion_alumno" className="form-label">Dirección Alumno: <span className="text-danger">*</span></label>
                            <input type="text" id="direccion_alumno" name="direccion_alumno" maxLength={50} required className="form-control" />
                        </div>
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="anio_ingreso_orquesta" className="form-label">Año Ingreso Orquesta: <span className="text-danger">*</span></label>
                            <input 
                                type="number" 
                                id="anio_ingreso_orquesta" 
                                name="anio_ingreso_orquesta" 
                                min={1900} 
                                max={currentYear} 
                                required 
                                className="form-control" 
                            />
                        </div>
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="diagnostico_ne" className="form-label">Diagnóstico NE:</label>
                            <textarea id="diagnostico_ne" name="diagnostico_ne" maxLength={100} className="form-control" style={{ height: "275px" }}></textarea>
                        </div>
                    </div>
                    <div className="col-12 text-center">
                        <button type="submit" className="btn btn-primary">Confirmar</button>
                    </div>
                </Form>
            </div>
        </>
    )
}