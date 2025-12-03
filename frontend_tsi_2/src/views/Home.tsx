import { Link } from 'react-router-dom';

export default function Home() {
    const cardStyle = { cursor: 'pointer' };

    return (
        <div className="container py-5">
            {/* HERO */}
            <div className="row align-items-center gy-4 mb-5">
                <div className="col-lg-6">
                    <div className="bg-light rounded shadow-sm d-flex align-items-center justify-content-center" style={{ height: 320 }}>
                        <img
                            src="https://github.com/GabrielMolinaUsm135/PROYECTO-TSI-FRONTEND/blob/main/LogoMusart.png?raw=true"
                            alt="Logo Musart"
                            style={{ maxHeight: '90%', maxWidth: '90%', objectFit: 'contain' }}
                        />
                    </div>
                </div>

                <div className="col-lg-6">
                    <h1 className="display-5 fw-bold">SERVICIO PRÉSTAMOS ORQUESTA SINFONICA MUSART CASABLANCA</h1>
                    <p className="lead text-muted mb-4">Gestión de prestamos alumnos, profesores, instrumentos e insumos.</p>                    
                </div>
            </div>

            {/* ADMINISTRACIÓN */}
            <section className="mb-4">
                <div className="row mb-3">
                    <div className="col">
                        <h3 className="h6 text-uppercase text-muted mb-0">Administración</h3>
                        <hr />
                    </div>
                </div>

                <div className="row g-3">
                    <div className="col-md-3">
                        <Link to="/Alumno/ListaAlumnos" className="text-decoration-none">
                            <div className="card h-100 shadow-sm" style={cardStyle}>
                                <div className="card-body d-flex flex-column">
                                    <div className="mb-3">
                                        <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width:48, height:48 }}>A</div>
                                    </div>
                                    <h5 className="card-title">Alumnos</h5>
                                    <div className="mt-auto text-primary"> </div>
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className="col-md-3">
                        <Link to="/Profesor/ListaProfesores" className="text-decoration-none">
                            <div className="card h-100 shadow-sm" style={cardStyle}>
                                <div className="card-body d-flex flex-column">
                                    <div className="mb-3">
                                        <div className="bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width:48, height:48 }}>P</div>
                                    </div>
                                    <h5 className="card-title">Profesores</h5>
                                    <div className="mt-auto text-warning"> </div>
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className="col-md-3">
                        <Link to="/Usuario/ListaUsuarios" className="text-decoration-none">
                            <div className="card h-100 shadow-sm" style={cardStyle}>
                                <div className="card-body d-flex flex-column">
                                    <div className="mb-3">
                                        <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width:48, height:48 }}>R</div>
                                    </div>
                                    <h5 className="card-title">Usuarios</h5>
                                    <div className="mt-auto text-success"> </div>
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className="col-md-3">
                        <Link to="/Apoderados/ListaApoderados" className="text-decoration-none">
                            <div className="card h-100 shadow-sm" style={cardStyle}>
                                <div className="card-body d-flex flex-column">
                                    <div className="mb-3">
                                        <div className="bg-info text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width:48, height:48 }}>AP</div>
                                    </div>
                                    <h5 className="card-title">Apoderados</h5>
                                    <div className="mt-auto text-info"> </div>
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className="col-md-3">
                        <Link to="/Alergias/ListaAlergias" className="text-decoration-none">
                            <div className="card h-100 shadow-sm" style={cardStyle}>
                                <div className="card-body d-flex flex-column">
                                    <div className="mb-3">
                                        <div className="bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width:48, height:48 }}>AL</div>
                                    </div>
                                    <h5 className="card-title">Alergias</h5>
                                    <div className="mt-auto text-danger"> </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            

            {/* INSTRUMENTOS E INSUMOS */}
            <section className="mb-4">
                <div className="row mb-3">
                    <div className="col">
                        <h3 className="h6 text-uppercase text-muted mb-0">Instrumentos & Insumos</h3>
                        <hr />
                    </div>
                </div>

                <div className="row g-3">
                    <div className="col-md-3">
                        <Link to="/Instrumentos/ListaInstrumentos" className="text-decoration-none">
                            <div className="card h-100 shadow-sm" style={cardStyle}>
                                <div className="card-body d-flex flex-column">
                                    <div className="mb-3">
                                        <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width:48, height:48 }}>I</div>
                                    </div>
                                    <h5 className="card-title">Instrumentos</h5>
                                    <div className="mt-auto text-primary"> </div>
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className="col-md-3">
                        <Link to="/ListaInsumos" className="text-decoration-none">
                            <div className="card h-100 shadow-sm" style={cardStyle}>
                                <div className="card-body d-flex flex-column">
                                    <div className="mb-3">
                                        <div className="bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width:48, height:48 }}>S</div>
                                    </div>
                                    <h5 className="card-title">Insumos</h5>
                                    <div className="mt-auto text-warning"> </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* PRÉSTAMOS */}
            <section>
                <div className="row mb-3">
                    <div className="col">
                        <h3 className="h6 text-uppercase text-muted mb-0">Préstamos</h3>
                        <hr />
                    </div>
                </div>

                <div className="row g-3">
                    <div className="col-md-6">
                        <Link to="/Prestamo/ListaPrestamos" className="text-decoration-none">
                            <div className="card h-100 shadow-sm" style={cardStyle}>
                                <div className="card-body d-flex flex-column">
                                    <div className="mb-3">
                                        <div className="bg-secondary text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width:48, height:48 }}>L</div>
                                    </div>
                                    <h5 className="card-title">Préstamos</h5>
                                    <div className="mt-auto text-secondary"> </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}