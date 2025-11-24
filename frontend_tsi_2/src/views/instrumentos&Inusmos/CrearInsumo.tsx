import { Link } from 'react-router-dom';

export default function CrearInsumo() {
    return (
        <div className="container py-4">
            <h1>Crear Insumo</h1>
            <p className="text-muted">(Formulario de ejemplo - implementar campos según tu API)</p>
            <div className="mt-3">
                <Link to="/ListaInsumos" className="btn btn-secondary">Volver a lista</Link>
            </div>
        </div>
    );
}
