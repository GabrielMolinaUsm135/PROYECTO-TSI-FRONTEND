import { Link } from 'react-router-dom';

export default function CrearPrestamo() {
    return (
        <div className="container py-4">
            <h1>Crear Préstamo</h1>
            <p className="text-muted">(Formulario de ejemplo - implementar campos según tu API)</p>
            <div className="mt-3">
                <Link to="/Prestamo/ListaPrestamos" className="btn btn-secondary">Volver a listado</Link>
            </div>
        </div>
    );
}
