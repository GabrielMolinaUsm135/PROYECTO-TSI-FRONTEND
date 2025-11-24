import { useState } from 'react';

export default function CrearUsuario() {
   const [role, setRole] = useState<'admin' | 'profesor'>('admin');

   return (
      <div className="container py-4">
         <h2 className="mb-4">Crear usuario</h2>

         <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-3">
               <label className="form-label">Tipo de usuario</label>
               <select
                  name="role"
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'admin' | 'profesor')}
               >
                  <option value="admin">Administrador</option>
                  <option value="profesor">Profesor</option>
               </select>
            </div>

            {/* ADMINISTRADOR: minimal fields (visible only when role === 'admin') */}
            {role === 'admin' && (
               <fieldset id="admin-fields" className="border p-3 mb-3">
                  <legend className="w-auto">Administrador</legend>

                  <div className="mb-3">
                     <label className="form-label">Correo</label>
                     <input name="correo" type="email" className="form-control" />
                  </div>

                  <div className="mb-3">
                     <label className="form-label">Contraseña</label>
                     <input name="password" type="password" className="form-control" />
                  </div>

                  {/*
                     Place admin-specific inputs here (columns/fields):
                     - ejemplo_admin_1
                     - ejemplo_admin_2
                  */}
               </fieldset>
            )}

            {/* PROFESOR: full set of fields (visible only when role === 'profesor') */}
            {role === 'profesor' && (
               <fieldset id="profesor-fields" className="border p-3 mb-3">
                  <legend className="w-auto">Profesor</legend>

                  <div className="row">
                     <div className="col-md-6 mb-3">
                        <label className="form-label">RUT</label>
                        <input name="rut" className="form-control" />
                     </div>
                     <div className="col-md-6 mb-3">
                        <label className="form-label">Teléfono</label>
                        <input name="telefono" className="form-control" />
                     </div>
                  </div>

                  <div className="row">
                     <div className="col-md-4 mb-3">
                        <label className="form-label">Nombre</label>
                        <input name="nombre" className="form-control" />
                     </div>
                     <div className="col-md-4 mb-3">
                        <label className="form-label">Apellido paterno</label>
                        <input name="apellido_paterno" className="form-control" />
                     </div>
                     <div className="col-md-4 mb-3">
                        <label className="form-label">Apellido materno</label>
                        <input name="apellido_materno" className="form-control" />
                     </div>
                  </div>

                  <div className="mb-3">
                     <label className="form-label">Dirección</label>
                     <input name="direccion" className="form-control" />
                  </div>

                  <div className="mb-3">
                     <label className="form-label">Asignatura</label>
                     <input name="asignatura" className="form-control" />
                  </div>

                  <div className="row">
                     <div className="col-md-6 mb-3">
                        <label className="form-label">Correo</label>
                        <input name="correo" type="email" className="form-control" />
                     </div>
                     <div className="col-md-6 mb-3">
                        <label className="form-label">Contraseña</label>
                        <input name="password" type="password" className="form-control" />
                     </div>
                  </div>

                  {/*
                     Place profesor-specific inputs here (columns/fields):
                     - ejemplo_profesor_1
                     - ejemplo_profesor_2
                  */}
               </fieldset>
            )}

            <div className="d-flex justify-content-end">
               <button type="submit" className="btn btn-primary">Crear</button>
            </div>
         </form>
      </div>
   );
}