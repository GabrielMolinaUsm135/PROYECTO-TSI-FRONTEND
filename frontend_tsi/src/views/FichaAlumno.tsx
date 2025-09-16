<<<<<<< HEAD
import { Link } from "react-router-dom";

export default function FichaAlumno() {
    return (
        <>
            <div className="container"><Link to="/">main menu</Link></div>
=======
export default function FichaAlumno() {
    return (
        <>
            <div className="container"><a href="index.html">main menu</a></div>
>>>>>>> origin/main
            <div className="container">
                <div className="row h-100 align-items-stretch">
                    {/* Column 1 */}
                    <div className="col-md-3 d-flex flex-column justify-content-center align-items-center border">
                        <div className="text-center">
                            <img
                                src="https://t4.ftcdn.net/jpg/05/42/36/11/360_F_542361185_VFRJWpR2FH5OiAEVveWO7oZnfSccZfD3.jpg"
                                alt="Foto del alumno"
                                className="img-fluid border"
                            />
                        </div>
                    </div>
                    {/* Column 2 */}
                    <div className="col-md-4 d-flex flex-column justify-content-center align-items-start border">
                        <h3 className="text-center w-100">ALUMNO</h3>
                        <div>
                            <div className="mb-2 d-flex justify-content-start">
                                <h5 className="me-2">Rut:</h5>
                                <p>12345678-9</p>
                            </div>
                            <div className="mb-2 d-flex justify-content-start">
                                <h5 className="me-2">Nombre:</h5>
                                <p>Juan Pérez</p>
                            </div>
                            <div className="mb-2 d-flex justify-content-start">
                                <h5 className="me-2">Edad:</h5>
                                <p>19</p>
                            </div>
                            <div className="mb-2 d-flex justify-content-start">
                                <h5 className="me-2">Correo:</h5>
                                <p>juan.perez@example.com</p>
                            </div>
                            <div className="mb-2 d-flex justify-content-start">
                                <h5 className="me-2">Número:</h5>
                                <p>+56 9 8765 4321</p>
                            </div>
                            <div className="mb-2 d-flex justify-content-start">
                                <h5 className="me-2">Instrumento:</h5>
<<<<<<< HEAD
                                <Link to="/DetalleInstrumento">Violin</Link>
=======
                                <a href="detalleInstrumento.html">Violin</a>
>>>>>>> origin/main
                            </div>
                            <div className="mb-2 d-flex justify-content-start">
                                <h5 className="me-2">Grupo Teoría:</h5>
                                <p>Morado</p>
                            </div>
                            <div className="mb-2 d-flex justify-content-start">
                                <h5 className="me-2">Diagnóstico:</h5>
                                <p>Sin diagnóstico</p>
                            </div>
                            <div className="mb-2 d-flex justify-content-start">
                                <h5 className="me-2">Dirección:</h5>
                                <p>Calle Falsa 123</p>
                            </div>
                            <div className="mb-2 d-flex justify-content-start">
                                <h5 className="me-2">Alergias:</h5>
                                <p>Ninguna</p>
                            </div>
                            <div className="mb-2 d-flex justify-content-start">
                                <h5 className="me-2">Año que ingresó:</h5>
                                <p>2015</p>
                            </div>
                        </div>
                    </div>
                    {/* Column 3 */}
                    <div className="col-md-4 d-flex flex-column align-items-start border">
                        <h3 className="text-center w-100">APODERADO</h3>
                        <div>
                            <div className="mb-2 d-flex justify-content-start">
                                <h5 className="me-2">Rut:</h5>
                                <p>23456789-1</p>
                            </div>
                            <div className="mb-2 d-flex justify-content-start">
                                <h5 className="me-2">Nombre:</h5>
                                <p>María López</p>
                            </div>
                            <div className="mb-2 d-flex justify-content-start">
                                <h5 className="me-2">Teléfono:</h5>
                                <p>+56 9 1234 5678</p>
                            </div>
                            <div className="mb-2 d-flex justify-content-start">
                                <h5 className="me-2">Email:</h5>
                                <p>maria.lopez@example.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mt-4">
                <h3 className="text-center mb-3">Desempeño Teoria Musical</h3>
                <table className="table table-bordered text-center">
                    <thead className="table-primary">
                        <tr>
                            <th>Nota 1</th>
                            <th>Nota 2</th>
                            <th>Nota 3</th>
                            <th>Prueba Final</th>
                            <th>Asistencia %</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>6.5</td>
                            <td>5.8</td>
                            <td>6.0</td>
                            <td>6.2</td>
                            <td>95%</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="container mt-4">
                <h3 className="text-center mb-3">Préstamos Instrumentos/Insumos</h3>
                <table className="table table-bordered text-center">
                    <thead className="table-primary">
                        <tr>
                            <th>Item</th>
                            <th>Fecha de Inicio</th>
                            <th>Fecha de Devolución</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
<<<<<<< HEAD
                            <td><Link to="/DetalleInstrumento">Violin</Link></td>
=======
                            <td><a href="detalleInstrumento.html">Violin</a></td>
>>>>>>> origin/main
                            <td>01-03-2025</td>
                            <td>15-05-2025</td>
                            <td>En uso</td>
                        </tr>
                        <tr>
<<<<<<< HEAD
                            <td><Link to="/DetalleInsumo">Pecastilla</Link></td>
=======
                            <td><a href="detalleInsumos.html">Pecastilla</a></td>
>>>>>>> origin/main
                            <td>05-03-2025</td>
                            <td>20-03-2025</td>
                            <td>Atrasado</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}