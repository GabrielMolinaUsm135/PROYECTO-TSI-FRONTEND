import { Link } from 'react-router-dom';

export default function CrearInstrumento() {
    return (
        <div className="container py-4">
            <h1>Crear Instrumento</h1>
            <p className="text-muted">(Formulario de ejemplo - implementar campos según tu API)</p>
            <div className="mt-3">
                <Link to="/Instrumentos/ListaInstrumentos" className="btn btn-secondary">Volver a lista</Link>
            </div>
        </div>
    );
}
