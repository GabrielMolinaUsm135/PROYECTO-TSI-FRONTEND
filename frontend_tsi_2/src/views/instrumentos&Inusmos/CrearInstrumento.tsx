import { Form, redirect, useActionData, type ActionFunctionArgs } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../services/axiosinstance";

export async function action({ request }: ActionFunctionArgs) {
    const FormData = Object.fromEntries(await request.formData());
    const cod_instrumento = FormData.cod_instrumento as string;

    try {
        // Check via axiosInstance (relative to baseURL '/api')
        const checkRes = await axiosInstance.get(`/instrumentos/${encodeURIComponent(cod_instrumento)}`);
        if (checkRes?.data) {
            return { error: "El Instrumento ya está registrado en la base de datos" };
        }

        // If check returned falsy data, proceed to create
        const { data } = await axiosInstance.post('/instrumentos', FormData, { headers: { 'Content-Type': 'application/json' } });
        if (data) return redirect('/Instrumentos/ListaInstrumentos');
        return { error: "cod_instrumento no valido." };
    } catch (error) {
        // If GET returned 404, create the instrument
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            try {
                const { data } = await axiosInstance.post('/instrumentos', FormData, { headers: { 'Content-Type': 'application/json' } });
                if (data) return redirect('/Instrumentos/ListaInstrumentos');
                return { error: "cod_instrumento no valido, ya existe este instrumento." };
            } catch (createError) {
                console.error("Error creating instrumento:", createError);
                return { error: "Ocurrió un error al crear el instrumento. Por favor, intente más tarde." };
            }
        }

        console.error("Error checking instrumento by code:", error);
        return { error: "Ocurrió un error al verificar el código. Por favor, intente más tarde." };
    }
}

export default function CrearInstrumento() {
    const actionData = useActionData() as { error?: string };

    return (
        <>
            <div className="row bg-primary text-white py-3 mb-5">
                <div className="col text-center">
                    <h1>Crear Instrumento</h1>
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
                            <label htmlFor="cod_instrumento" className="form-label">Código Instrumento: <span className="text-danger">*</span></label>
                            <input type="text" id="cod_instrumento" name="cod_instrumento" maxLength={30} required className="form-control" />
                        </div>
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="nombre_instrumento" className="form-label">Nombre Instrumento: <span className="text-danger">*</span></label>
                            <input type="text" id="nombre_instrumento" name="nombre_instrumento" maxLength={60} required className="form-control" />
                        </div>
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="modelo_instrumento" className="form-label">Modelo</label>
                            <input type="text" id="modelo_instrumento" name="modelo_instrumento" maxLength={60} className="form-control" />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="tamano" className="form-label">Tamaño</label>
                            <input type="text" id="tamano" name="tamano" maxLength={30} className="form-control" />
                        </div>
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="observacion" className="form-label">Observación</label>
                            <textarea id="observacion" name="observacion" maxLength={200} className="form-control" style={{ height: "140px" }}></textarea>
                        </div>
                    </div>
                    <div className="col-12 text-center">
                        <button type="submit" className="btn btn-primary">Crear Instrumento</button>
                    </div>
                </Form>
            </div>
        </>
    );
}