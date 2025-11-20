import React, { useState } from 'react';

export default function CrearUsuario(){
  const [form, setForm] = useState({
    rut: '',
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    correo: '',
    telefono: '',
    direccion: '',
    password: '',
    id_rol: '1'
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string,string>>({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>){
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setErrors(e => ({ ...e, [name]: '' }));
  }

  function validate(){
    const next: Record<string,string> = {};
    if (!form.correo) next.correo = 'Correo es requerido';
    if (!form.password) next.password = 'Contraseña es requerida';
    if (!form.nombre) next.nombre = 'Nombre es requerido';
    return next;
  }

  function handleSubmit(e: React.FormEvent){
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length > 0){
      setErrors(v);
      return;
    }

    // no backend call here per request — just show a success message and log payload
    console.log('Crear usuario payload:', form);
    setSubmitted(true);
  }

  return (
    <div className="container-fluid">
      <div className="row justify-content-center align-items-center vh-100">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Crear Usuario</h3>

              {submitted ? (
                <div className="alert alert-success">Usuario creado (simulado). Revisa la consola para ver el payload.</div>
              ) : null}

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">RUT</label>
                    <input name="rut" value={form.rut} onChange={handleChange} className="form-control" />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Correo</label>
                    <input name="correo" value={form.correo} onChange={handleChange} className={`form-control ${errors.correo ? 'is-invalid' : ''}`} />
                    {errors.correo && <div className="invalid-feedback">{errors.correo}</div>}
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Nombre</label>
                    <input name="nombre" value={form.nombre} onChange={handleChange} className={`form-control ${errors.nombre ? 'is-invalid' : ''}`} />
                    {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Apellido paterno</label>
                    <input name="apellido_paterno" value={form.apellido_paterno} onChange={handleChange} className="form-control" />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Apellido materno</label>
                    <input name="apellido_materno" value={form.apellido_materno} onChange={handleChange} className="form-control" />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Teléfono</label>
                    <input name="telefono" value={form.telefono} onChange={handleChange} className="form-control" />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Dirección</label>
                    <input name="direccion" value={form.direccion} onChange={handleChange} className="form-control" />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Contraseña</label>
                    <input name="password" type="password" value={form.password} onChange={handleChange} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Rol</label>
                    <select name="id_rol" value={form.id_rol} onChange={handleChange} className="form-select">
                      <option value="1">Alumno</option>
                      <option value="2">Profesor</option>
                      <option value="3">Administrador</option>
                    </select>
                  </div>
                </div>

                <div className="d-grid gap-2">
                  <button className="btn btn-primary" type="submit">Crear cuenta (simulado)</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
