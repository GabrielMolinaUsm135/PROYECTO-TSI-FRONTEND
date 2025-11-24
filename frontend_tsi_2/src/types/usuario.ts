import { nonEmpty, number, object, pipe, string } from "valibot";

export const LoginFormSchema = object({
    correo: pipe(string(), nonEmpty('Indique su correo')),
    password: pipe(string(), nonEmpty('Indique su contraseña')),
});

export const UsuarioFormSchema = object({
    correo: string(),
    password: string(),
    id_rol: number(),
});