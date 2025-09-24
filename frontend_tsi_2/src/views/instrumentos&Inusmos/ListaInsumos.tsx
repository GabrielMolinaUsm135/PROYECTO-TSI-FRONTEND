export default function ListaInsumos(){
    return(
        <>
            <div className="row bg-primary text-white py-3 mb-5">
                    <div className="col text-center">
                        <h1>Lista de Insumos/Instrumentos</h1>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Codigo</th>
                                    <th>Nombre</th>
                                    <th>Especificacion</th>
                                    <th>Disponibilidad</th>
                                    <th>Fecha de inicio</th>
                                    <th>Fecha de fin</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>VLN001</td>
                                    <td>Violin</td>
                                    <td><a href="/DetalleInstrumento" className="btn btn-primary btn">...</a></td>
                                    <td>✔️</td>
                                    <td>...</td>
                                    <td>...</td>
                                    <td>
                                        <a href="#" className="btn btn-warning btn">✏️</a>
                                        <a href="#" className="btn btn-success btn">📥</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>PCT001</td>
                                    <td>Pecastilla</td>
                                    <td><a href='/DetalleInsumo' className="btn btn-primary btn">...</a></td>
                                    <td>❌</td>
                                    <td>01/01/2025</td>
                                    <td>30/04/2025</td>
                                    <td>
                                        <a href="#" className="btn btn-warning btn">✏️</a>
                                        <a href="#" className="btn btn-success btn">📥</a>
                                    </td>
                                </tr>
                                {/* <!-- Add more rows as needed --> */}
                            </tbody>
                        </table>
                    </div>
                </div>
        </>
    )
}