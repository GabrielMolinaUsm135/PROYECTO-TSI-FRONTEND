import { Link } from 'react-router-dom';

export default function ListaInstrumentos() {
    return (
        <div className="container py-4">
            <h1>Lista de Instrumentos</h1>
            <p className="text-muted">(Página de ejemplo - completa según tu API)</p>
            <div className="mt-3">
                <Link to="/Instrumentos/CrearInstrumento" className="btn btn-primary">Crear Instrumento</Link>
            </div>
        </div>
    );
}
