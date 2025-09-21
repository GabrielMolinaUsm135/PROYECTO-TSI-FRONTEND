import { Link } from "react-router-dom";

export default function Home() {
    return (
        <>
            <div className="container text-center mt-5">
                <h1>Menú Principal</h1>
                <div className="d-flex flex-column align-items-center mt-4">
                    {/* <Link to="/FichaAlumno" className="btn btn-primary mb-3 w-50">Ficha Alumno</Link>
                    <Link to="/CalendarioMensual" className="btn btn-info mb-3 w-50">Calendario Mensual</Link>
                    <Link to="/CalendarioSemanal" className="btn btn-info mb-3 w-50">Calendario Semanal</Link>
                    <Link to="/DetalleInstrumento" className="btn btn-secondary mb-3 w-50">Detalle Instrumento</Link>
                    <Link to="/DetalleInsumo" className="btn btn-secondary mb-3 w-50">Detalle Insumo</Link> */}
                    <Link to="/ListaAlumnos" className="btn btn-success mb-3 w-50">Lista Alumnos</Link>
                    {/* <Link to="/ListaInsumos" className="btn btn-success mb-3 w-50">Lista Insumos/Instrumentos</Link> */}
                    <Link to="/Login" className="btn btn-dark mb-3 w-50">Login</Link>
                </div>
            </div>
        </>
    )
}