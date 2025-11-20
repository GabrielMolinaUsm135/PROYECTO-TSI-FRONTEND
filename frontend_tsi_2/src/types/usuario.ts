import { nonEmpty, object, pipe, string } from "valibot";

// Login form validation (frontend expects `correo` field)
export const LoginFormSchema = object({
    correo: pipe(string(), nonEmpty('Indique su correo')),
    password: pipe(string(), nonEmpty('Indique su contraseña')),
});

// Role and Usuario types matching the database schema
export type Role = string;

export interface RawRol {
    id_rol?: number;
    nombre_rol?: string;
}

export interface Usuario {
    id_usuario?: number;
    rut?: string | null;
    nombre?: string | null;
    apellido_paterno?: string | null;
    apellido_materno?: string | null;
    correo?: string | null;
    telefono?: string | null;
    direccion?: string | null;
    // NOTE: password should never be exposed to the client in normal flows
    password?: string | null;
    id_rol?: number | null;
    // normalized role names for frontend checks (lowercase)
    roles?: Role[];
    // raw role object coming from backend (e.g. { nombre_rol: 'Profesor' })
    rol?: RawRol | null;
}