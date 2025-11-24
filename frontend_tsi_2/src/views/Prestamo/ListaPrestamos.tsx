import { Link } from 'react-router-dom';

export default function ListaPrestamos() {
    return (
        <div className="container py-4">
            <h1>Listado de Préstamos</h1>
            <p className="text-muted">(Página de ejemplo - completa según tu API)</p>
            <div className="mt-3">
                <Link to="/Prestamo/CrearPrestamo" className="btn btn-primary">Crear Préstamo</Link>
            </div>
        </div>
    );
}
