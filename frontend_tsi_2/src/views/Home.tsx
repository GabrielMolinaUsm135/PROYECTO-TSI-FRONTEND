export default function Home() {
    return (
        <div className="container py-5">
            <div className="row align-items-center gy-4">
                <div className="col-md-6 text-center">
                    <div
                        className="bg-light rounded shadow-sm d-flex align-items-center justify-content-center"
                        style={{ height: 320 }}
                    >
                        {/* Image placeholder - replace the img src with your asset or component */}
                        <img
                            src="/placeholder-image.png"
                            alt="Imagen representativa"
                            style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                        />
                    </div>
                </div>

                <div className="col-md-6">
                    <h1 className="display-5 fw-bold">SERVICIO PRESTAMOS MUSART</h1>
                    <p className="lead text-muted">Zona de prestamos de Instrumentos e Insumos</p>
                </div>
            </div>
        </div>
    );
}