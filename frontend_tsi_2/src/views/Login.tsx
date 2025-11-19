import { Form , redirect, useActionData} from "react-router-dom";
import { login } from "../services/UsuarioService";

export async function action({ request }: { request: Request }) {
    const formData = Object.fromEntries(await request.formData());
    const resultado = await login(formData)
    if (!resultado.success){
        return resultado
    }
    return redirect('/')
}

export default function Login() {
    const actionData = useActionData() as {
        success: boolean;
        error?: string;
        detalleErrores?: {[key:string]:string[]}
    }
    return (
        <>
            <div className="container-fluid">
                <div className="row justify-content-center align-items-center vh-100">
                    <div className="col-md-4">
                        <div className="card mb-3">
                            <div className="card-body">
                                <h3 className="card-title text-center mb-4">Iniciar Sesión</h3>
                                {actionData?.error && (
                                    <div className="alert alert-danger">
                                        {actionData.error}
                                        </div>
                                        )}
                                <Form method="POST">
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">
                                            Correo Electronico
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${actionData?.detalleErrores?.email ? 'is-invalid' :''}`}
                                            id="email"
                                            name="email"
                                            placeholder="Ingrese su Correo"
                                        />
                                        {'email' in (actionData?.detalleErrores || {}) && (
                                            <div className="invalid-feedback">
                                                {actionData?.detalleErrores?.email[0]}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">
                                            Contraseña
                                        </label>
                                        <input
                                            type="password"
                                            className={`form-control ${actionData?.detalleErrores?.password ? 'is-invalid' :''}`}
                                            id="password"
                                            name="password"
                                            placeholder="Ingrese su contraseña"
                                        />
                                        {'password' in (actionData?.detalleErrores || {}) && (
                                            <div className="invalid-feedback">
                                                {actionData?.detalleErrores?.password[0]}
                                            </div>
                                        )}
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100">
                                        Entrar
                                    </button>
                                </Form>
                                <div className="mt-3 text-center">
                                    <a href="/crearCuenta">Crear cuenta</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}