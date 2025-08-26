export default function DetalleInsumo(){
    return(
        <>
            <div className="container"><a href="index.html">main menu</a></div>

            <div className="container-fluid">
                <div className="row">
                    {/* <!-- Left side --> */}
                    <div className="col-md-6">
                        <h1 className="mb-3 bg-primary text-light">Detalle del Insumo</h1>
                        <div className="mb-2 d-flex justify-content-start">
                            <h5 className="me-2">Código:</h5>
                            <p>PCT001</p>
                        </div>
                        <div className="mb-2 d-flex justify-content-start">
                            <h5 className="me-2">Nombre:</h5>
                            <p>Pecastilla</p>
                        </div>
                        <div className="mb-2">
                            <h5>Observación:</h5>
                            <textarea className="form-control" rows={3}>Texto de ejemplo</textarea>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="mt-5 text-center">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/27/Instrument_Placeholder.png"
                                alt="Insumo" className="img-fluid"/>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}