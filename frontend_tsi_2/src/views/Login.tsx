export default function Login() {
    return (
        <>
            <div className="container-fluid">
                <div className="row justify-content-center align-items-center vh-100">
                    <div className="col-md-4">
                        <div className="card mb-3">
                            <div className="card-body">
                                <h3 className="card-title text-center mb-4">Iniciar Sesión</h3>
                                <form>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">
                                            Email
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="email"
                                            name="email"
                                            placeholder="Ingrese su email"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">
                                            Contraseña
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            name="password"
                                            placeholder="Ingrese su contraseña"
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100">
                                        Entrar
                                    </button>
                                </form>
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