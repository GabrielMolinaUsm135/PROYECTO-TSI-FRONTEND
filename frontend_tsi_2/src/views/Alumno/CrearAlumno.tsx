import { useState } from "react";

export default function CrearAlumno() {
    const [rutApoderados] = useState([
        "12345678-9", 
        "98765432-1", 
        "11223344-5"
    ]);

    return(
        <>
            <div className="row bg-primary text-white py-3 mb-5">
                <div className="col text-center">
                    <h1>Crear un alumno</h1>
                </div>
            </div>
            <div className="container">
                <form className="row">
                    <div className="col-md-6">
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="rut_alumno" className="form-label">RUT Alumno:</label>
                            <input type="text" id="rut_alumno" name="rut_alumno" maxLength={12} required className="form-control" />
                        </div>
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="rut_apoderado" className="form-label">RUT Apoderado:</label>
                            <select id="rut_apoderado" name="rut_apoderado" required className="form-select">
                                <option value="">Seleccione un RUT</option>
                                {rutApoderados.map((rut, index) => (
                                    <option key={index} value={rut}>{rut}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="nombre_alumno" className="form-label">Nombre Alumno:</label>
                            <input type="text" id="nombre_alumno" name="nombre_alumno" maxLength={10} required className="form-control" />
                        </div>
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="apellido_paterno" className="form-label">Apellido Paterno:</label>
                            <input type="text" id="apellido_paterno" name="apellido_paterno" maxLength={10} required className="form-control" />
                        </div>
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="apellido_materno" className="form-label">Apellido Materno:</label>
                            <input type="text" id="apellido_materno" name="apellido_materno" maxLength={10} required className="form-control" />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="telefono_alumno" className="form-label">Teléfono Alumno:</label>
                            <input type="number" id="telefono_alumno" name="telefono_alumno" required className="form-control" />
                        </div>
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="correo_alumno" className="form-label">Correo Alumno:</label>
                            <input type="email" id="correo_alumno" name="correo_alumno" maxLength={40} required className="form-control" />
                        </div>
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="direccion_alumno" className="form-label">Dirección Alumno:</label>
                            <input type="text" id="direccion_alumno" name="direccion_alumno" maxLength={50} required className="form-control" />
                        </div>
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="diagnostico_ne" className="form-label">Diagnóstico NE:</label>
                            <textarea id="diagnostico_ne" name="diagnostico_ne" maxLength={100} required className="form-control" style={{ height: "150px" }}></textarea>
                        </div>
                        <div className="mb-3 bg-light p-3 rounded">
                            <label htmlFor="anio_ingreso_orquesta" className="form-label">Año Ingreso Orquesta:</label>
                            <input type="number" id="anio_ingreso_orquesta" name="anio_ingreso_orquesta" min={1900} max={2100} required className="form-control" />
                        </div>
                    </div>
                    <div className="col-12 text-center">
                        <button type="submit" className="btn btn-primary">Crear Usuario</button>
                    </div>
                </form>
            </div>
        </>
    )
}