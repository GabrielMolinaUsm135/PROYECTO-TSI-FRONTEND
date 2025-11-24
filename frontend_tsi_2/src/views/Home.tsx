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
                    <h1 className="display-5 fw-bold">SERVICIO PRÉSTAMOS MUSART</h1>
                    <p className="lead text-muted mb-4">Gestión de alumnos, profesores, instrumentos, insumos y préstamos.</p>                    
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
                    <div className="col-md-4">
                        <Link to="/CrearAlumno" className="text-decoration-none">
                            <div className="card h-100 shadow-sm" style={cardStyle}>
                                <div className="card-body d-flex flex-column">
                                    <div className="mb-3">
                                        <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width:48, height:48 }}>+A</div>
                                    </div>
                                    <h5 className="card-title">Crear Alumno</h5>
                                    <p className="card-text text-muted">Registrar un nuevo alumno con todos sus datos.</p>
                                    <div className="mt-auto text-primary">Ir &rarr;</div>
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className="col-md-4">
                        <Link to="/CrearProfesor" className="text-decoration-none">
                            <div className="card h-100 shadow-sm" style={cardStyle}>
                                <div className="card-body d-flex flex-column">
                                    <div className="mb-3">
                                        <div className="bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width:48, height:48 }}>+P</div>
                                    </div>
                                    <h5 className="card-title">Crear Profesor</h5>
                                    <p className="card-text text-muted">Registrar un nuevo profesor con todos sus datos.</p>
                                    <div className="mt-auto text-warning">Ir &rarr;</div>
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className="col-md-4">
                        <Link to="/CrearUsuario" className="text-decoration-none">
                            <div className="card h-100 shadow-sm" style={cardStyle}>
                                <div className="card-body d-flex flex-column">
                                    <div className="mb-3">
                                        <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width:48, height:48 }}>+R</div>
                                    </div>
                                    <h5 className="card-title">Crear Administrador</h5>
                                    <p className="card-text text-muted">Crear nuevo administrador del sistema.</p>
                                    <div className="mt-auto text-success">Ir &rarr;</div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* LISTADOS PERFILES */}
            <section className="mb-4">
                <div className="row mb-3">
                    <div className="col">
                        <h3 className="h6 text-uppercase text-muted mb-0">Listados (Perfiles)</h3>
                        <hr />
                    </div>
                </div>

                <div className="row g-3">
                    <div className="col-md-4">
                        <Link to="/Alumno/ListaAlumnos" className="text-decoration-none">
                            <div className="card h-100 shadow-sm" style={cardStyle}>
                                <div className="card-body d-flex flex-column">
                                    <div className="mb-3">
                                        <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width:48, height:48 }}>A</div>
                                    </div>
                                    <h5 className="card-title">Lista de Alumnos</h5>
                                    <p className="card-text text-muted">Ver la lista completa de alumnos en el sistema.</p>
                                    <div className="mt-auto text-primary">Ir &rarr;</div>
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className="col-md-4">
                        <Link to="/Profesor/ListaProfesores" className="text-decoration-none">
                            <div className="card h-100 shadow-sm" style={cardStyle}>
                                <div className="card-body d-flex flex-column">
                                    <div className="mb-3">
                                        <div className="bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width:48, height:48 }}>P</div>
                                    </div>
                                    <h5 className="card-title">Lista de Profesores</h5>
                                    <p className="card-text text-muted">Ver la lista completa de profesores en el sistema.</p>
                                    <div className="mt-auto text-warning">Ir &rarr;</div>
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className="col-md-4">
                        <Link to="/Usuario/ListaUsuarios" className="text-decoration-none">
                            <div className="card h-100 shadow-sm" style={cardStyle}>
                                <div className="card-body d-flex flex-column">
                                    <div className="mb-3">
                                        <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width:48, height:48 }}>R</div>
                                    </div>
                                    <h5 className="card-title">Lista de Administradores</h5>
                                    <p className="card-text text-muted">Ver la lista completa de administradores en el sistema.</p>
                                    <div className="mt-auto text-success">Ir &rarr;</div>
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
                                    <h5 className="card-title">Lista Instrumentos</h5>
                                    <p className="card-text text-muted">Ver todos los instrumentos disponibles.</p>
                                    <div className="mt-auto text-primary">Ir &rarr;</div>
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
                                    <h5 className="card-title">Lista Insumos</h5>
                                    <p className="card-text text-muted">Ver todos los insumos registrados.</p>
                                    <div className="mt-auto text-warning">Ir &rarr;</div>
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className="col-md-3">
                        <Link to="/Instrumentos/CrearInstrumento" className="text-decoration-none">
                            <div className="card h-100 shadow-sm" style={cardStyle}>
                                <div className="card-body d-flex flex-column">
                                    <div className="mb-3">
                                        <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width:48, height:48 }}>+</div>
                                    </div>
                                    <h5 className="card-title">Crear Instrumento</h5>
                                    <p className="card-text text-muted">Registrar un nuevo instrumento.</p>
                                    <div className="mt-auto text-success">Ir &rarr;</div>
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className="col-md-3">
                        <Link to="/Insumos/CrearInsumo" className="text-decoration-none">
                            <div className="card h-100 shadow-sm" style={cardStyle}>
                                <div className="card-body d-flex flex-column">
                                    <div className="mb-3">
                                        <div className="bg-info text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width:48, height:48 }}>+</div>
                                    </div>
                                    <h5 className="card-title">Crear Insumo</h5>
                                    <p className="card-text text-muted">Registrar un nuevo insumo.</p>
                                    <div className="mt-auto text-info">Ir &rarr;</div>
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
                                    <h5 className="card-title">Listado de Préstamos</h5>
                                    <p className="card-text text-muted">Ver préstamos activos e históricos.</p>
                                    <div className="mt-auto text-secondary">Ir &rarr;</div>
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className="col-md-6">
                        <Link to="/Prestamo/CrearPrestamo" className="text-decoration-none">
                            <div className="card h-100 shadow-sm" style={cardStyle}>
                                <div className="card-body d-flex flex-column">
                                    <div className="mb-3">
                                        <div className="bg-dark text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width:48, height:48 }}>+</div>
                                    </div>
                                    <h5 className="card-title">Crear Préstamo</h5>
                                    <p className="card-text text-muted">Registrar un nuevo préstamo de instrumento/insumo.</p>
                                    <div className="mt-auto text-dark">Ir &rarr;</div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}