export default function ListaAlumnos() {
  return(
    <>
        <div className="row bg-primary text-white py-3 mb-5">
            <div className="col text-center">
                <h1>Lista de Alumnos</h1>
            </div>
        </div>
        <div className="container">
            <div className="row">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Rut</th>
                            <th>Nombre</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>12345678-9</td>
                            <td>Juan Pérez</td>
                            <td>
                                <div className="d-flex gap-2">
                                    <a href="#" className="btn btn-primary btn-sm">Editar</a>
                                    <a href="#" className="btn btn-danger btn-sm">Eliminar</a>
                                    <a href="fichaAlumno.html" className="btn btn-secondary btn-sm">Ver</a>
                                </div>
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