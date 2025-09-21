export default function DetalleInstrumento() {
    return (
        <>
            <div className="container"><a href="index.html">main menu</a></div>

            <div className="container-fluid">
                <div className="row">
                    {/* Left side */}
                    <div className="col-md-6">
                        <h1 className="mb-3 bg-primary text-light">Detalle del Instrumento</h1>
                        <div className="mb-2 d-flex justify-content-start">
                            <h5 className="me-2">Código:</h5>
                            <p>VLN001</p>
                        </div>
                        <div className="mb-2 d-flex justify-content-start">
                            <h5 className="me-2">Nombre:</h5>
                            <p>Violin</p>
                        </div>
                        <div className="mb-2 d-flex justify-content-start">
                            <h5 className="me-2">Modelo:</h5>
                            <p>Modelo Y</p>
                        </div>
                        <div className="mb-2 d-flex justify-content-start">
                            <h5 className="me-2">Tamaño:</h5>
                            <p>4/4</p>
                        </div>
                        <div className="mb-2">
                            <h5>Observación:</h5>
                            <textarea className="form-control" rows={3} readOnly>Texto de ejemplo</textarea>
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="col-md-6">
                        <h1 className="bg-primary text-light">Lista de Insumos Extra:</h1>
                        <ul>
                            <li>Pecastilla</li>
                            <li>Arco</li>
                            <li>Soporte</li>
                        </ul>

                        <div className="mt-5 text-center">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/2/27/Instrument_Placeholder.png"
                                alt="Instrumento"
                                className="img-fluid"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}