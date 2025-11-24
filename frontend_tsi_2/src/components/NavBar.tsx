import { NavLink } from "react-router-dom";

export default function NavBar() {
    return (
        <>
            <nav className="navbar navbar-expand-lg bg-primary">
                <div className="container-fluid">
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            
                            <NavLink to="/Home" className="nav-link text-white">
                                <i className="bi bi-house"></i>
                            </NavLink>

                            {/* DROPDOWN ALUMNO */}
                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle text-white"
                                    href="#"
                                    id="alumnoDropdown"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Alumno
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="alumnoDropdown">
                                    <li>
                                        <NavLink className="dropdown-item" to="/Alumno/ListaAlumnos">
                                            Listar Alumnos
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink className="dropdown-item" to="/CrearAlumno">
                                            Crear Alumno
                                        </NavLink>
                                    </li>
                                </ul>
                            </li>                    

                            {/* DROPDOWN INSTRUMENTOS & INSUMOS */}
                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle text-white"
                                    href="#"
                                    id="insumosDropdown"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Instrumentos & Insumos
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="insumosDropdown">
                                    <li>
                                        <NavLink className="dropdown-item" to="/ListaInsumos">
                                            Lista Insumos/Instrumentos
                                        </NavLink>
                                    </li>
                                </ul>
                            </li>

                            {/* DROPDOWN CREAR PERFIL */}
                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle text-white"
                                    href="#"
                                    id="crearPerfilDropdown"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Crear Perfil
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="crearUsuarioDropdown">
                                    <li>
                                        <NavLink className="dropdown-item" to="/CrearUsuario">
                                            Crear Administrador
                                        </NavLink>
                                        <NavLink className="dropdown-item" to="/CrearProfesor">
                                            Crear Profesor
                                        </NavLink>
                                        <NavLink className="dropdown-item" to="/CrearAlumno">
                                            Crear Alumno
                                        </NavLink>
                                    </li>
                                </ul>
                            </li>       
                        </ul>

                                         

                        {/* DROPDOWN LOGOUT */}
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item dropdown dropstart">
                                <a
                                    className="nav-link dropdown-toggle text-white"
                                    href="#"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <i className="bi bi-person-circle"></i>
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li>
                                        <NavLink className="dropdown-item" to="/login">
                                            Cerrar sesión
                                        </NavLink>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}