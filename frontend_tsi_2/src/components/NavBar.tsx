import { NavLink } from "react-router-dom";

export default function NavBar() {
    return (
        <>
            <nav className="navbar navbar-expand-lg bg-primary">
                <div className="container-fluid">
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
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
                                        <NavLink className="dropdown-item" to="/Alumno/CrearAlumno">
                                            Crear Alumno
                                        </NavLink>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                        {/* DROPDOWN LOGOUT */}
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item dropdown dropstart">
                                <NavLink
                                    className="nav-link dropdown-toggle text-white"
                                    to="#"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    
                                >
                                    <i className="bi bi-door-open-fill"></i>
                                </NavLink>
                                <ul className="dropdown-menu ">
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