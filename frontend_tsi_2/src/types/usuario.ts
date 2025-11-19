import { nonEmpty, object, pipe, string } from "valibot";

export const LoginFormSchema = object   ({
    email: pipe(string(),nonEmpty('Indique su correo electrónico')),
    password: pipe(string(),nonEmpty('Indique su contraseña')),
});