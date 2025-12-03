import { Form, redirect, useActionData, type ActionFunctionArgs } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../services/axiosinstance";

export async function action({ request }: ActionFunctionArgs) {
    const FormData = Object.fromEntries(await request.formData());
    const cod_insumo = FormData.cod_insumo as string;

    try {
        // Check via axiosInstance (relative to baseURL '/api')
        const checkRes = await axiosInstance.get(`/insumos/${encodeURIComponent(cod_insumo)}`);
        if (checkRes?.data) {
            return { error: "El Insumo ya está registrado en la base de datos" };
        }

        // If check returned falsy data, proceed to create
        const { data } = await axiosInstance.post('/insumos', FormData, { headers: { 'Content-Type': 'application/json' } });
        if (data) return redirect('/ListaInsumos');
        return { error: "cod_insumo no valido." };
    } catch (error) {
        // If GET returned 404, create the instrument
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            try {
                const { data } = await axiosInstance.post('/insumos', FormData, { headers: { 'Content-Type': 'application/json' } });
                if (data) return redirect('/ListaInsumos');
                return { error: "cod_insumo no valido, ya existe este insumo." };
            } catch (createError) {
                console.error("Error creating insumo:", createError);
                return { error: "Ocurrió un error al crear el insumo. Por favor, intente más tarde." };
            }
        }

        console.error("Error checking insumo by code:", error);
        return { error: "Ocurrió un error al verificar el código. Por favor, intente más tarde." };
    }
}

export default function CrearInsumo() {
    const actionData = useActionData() as { error?: string };

    return (
        <>
            <div className="row bg-primary text-white py-3 mb-5">
                <div className="col text-center">
                    <h1>Crear Insumo</h1>
                </div>
            </div>
            <div className="container mb-5">
                {actionData?.error && (
                    <div className="alert alert-danger" role="alert">
                        {actionData.error}
                    </div>
                )}
                <Form method="POST" className="row">
                    <div className="col-md-8">
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="cod_insumo" className="form-label">Código Insumo: <span className="text-danger">*</span></label>
                            <input type="text" id="cod_insumo" name="cod_insumo" maxLength={30} required className="form-control" />
                        </div>
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="nombre_insumo" className="form-label">Nombre Insumo: <span className="text-danger">*</span></label>
                            <input type="text" id="nombre_insumo" name="nombre_insumo" maxLength={60} required className="form-control" />
                        </div>
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="observacion" className="form-label">Observación</label>
                            <textarea id="observacion" name="observacion" maxLength={200} className="form-control" style={{ height: "140px" }}></textarea>
                        </div>
                    </div>
                    <div className="col-12 text-center">
                        <button type="submit" className="btn btn-primary">Crear Insumo</button>
                    </div>
                </Form>
            </div>
        </>
    );
}