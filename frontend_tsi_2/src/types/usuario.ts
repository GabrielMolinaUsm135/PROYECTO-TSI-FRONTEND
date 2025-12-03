import { array, nonEmpty, number, object, pipe, string, type InferOutput } from "valibot";

export const LoginFormSchema = object({
    correo: pipe(string(), nonEmpty('Indique su correo')),
    password: pipe(string(), nonEmpty('Indique su contraseña')),
});

export const UsuarioFormSchema = object({
    correo: string(),
    password: string(),
    id_rol: number(),
});

export const listausuarioSchema = object({
    correo: string(),
    id_rol: number(),
});

export const ListaUsuariosSchema = array(listausuarioSchema);
export type ListaUsuario = InferOutput<typeof listausuarioSchema>;