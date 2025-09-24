import { safeParse } from "valibot";
import { LoginFormSchema } from "../types/usuario";
import axios from "axios";

type UsuarioFormData = {
   [k: string]: FormDataEntryValue
};
export async function login(formData: UsuarioFormData) {
    try {
        console.log('1. Iniciando login con datos:', formData);
        const resultado = safeParse(LoginFormSchema, formData);
        console.log('2. Resultado de validación:', resultado);
        
        if (resultado.success){
            //aprueba el schema
            const url = `http://localhost:3000/api/login`;
            console.log('3. URL del backend:', url);
            console.log('4. Datos a enviar:', resultado.output);
            
            const {data} = await axios.post(url,resultado.output);
            console.log('5. Respuesta del backend:', data);
            
            localStorage.setItem('token', data.token);
            console.log('6. Token guardado en localStorage');
            return {success: true};
        }else{
            //no aprueba el schema
            const detalleerror: Record<string,string[] > = {}
            for (const issue of resultado.issues){
                const campo = issue.path![0].key as string;
                if (!detalleerror[campo]){
                    detalleerror[campo] = [];
                }
                detalleerror[campo].push(issue.message);
            }
            return {success: false, error: 'Datos de formulario no validos', detalleErrores: detalleerror}
        }
    } catch (error:any) {
        console.error('❌ Error en el bloque try:', error);
        console.error('❌ Tipo de error:', typeof error);
        console.error('❌ Stack trace:', error.stack);
        return{
            success: false,
            error: error.response?.data?.error ?? `Error inesperado: ${error.message}`
        }
    }
}