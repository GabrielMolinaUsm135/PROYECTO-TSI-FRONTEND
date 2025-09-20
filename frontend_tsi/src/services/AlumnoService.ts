import axios from "axios"
import { safeParse } from "valibot"
import { ListaAlumnosSchema } from "../types/alumno"

export async function getListaAlumnos() {
    try{
        const url = 'http://localhost:3000/api/lista/alumnos'
        const {data:alumnos} =  await axios.get(url)
        const resultado = safeParse(ListaAlumnosSchema, alumnos.data)
        if (resultado.success){
            return resultado.output
        }else{
            throw new Error('Error en la validacion de datos')
        }
    } catch(error){
        console.log(error)
    }
}