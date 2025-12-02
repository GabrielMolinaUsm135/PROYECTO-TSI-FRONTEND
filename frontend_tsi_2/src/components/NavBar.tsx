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
                            <li className="nav-item">
                                <NavLink to="/Home" className="nav-link text-white d-flex align-items-center">
                                    <i className="bi bi-house fs-3"></i>
                                </NavLink>
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
                                    <i className="bi bi-person-circle fs-3"></i>
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