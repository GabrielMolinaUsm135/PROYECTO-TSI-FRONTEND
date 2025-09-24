import { nonEmpty, object, pipe, string } from "valibot";

export const LoginFormSchema = object   ({
    username: pipe(string(),nonEmpty('Indique su nombre de usuario')),
    password: pipe(string(),nonEmpty('Indique su contraseña')),
});