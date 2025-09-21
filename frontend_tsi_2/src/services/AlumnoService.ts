import axios from "axios";
import { safeParse } from "valibot";
import { AlumnoFormSchema, ListaAlumnosSchema } from "../types/alumno";

export async function getListaAlumnos() {
    try {
        const url = 'http://localhost:3000/api/lista/alumnos';
        const { data: alumnos } = await axios.get(url);
        const resultado = safeParse(ListaAlumnosSchema, alumnos.data);
        if (resultado.success) {
            return resultado.output;
        } else {
            throw new Error('Error en la validacion de datos');
        }
    } catch (error) {
        console.log(error);
    }
}

type AlumnoFormData = {
    [k: string]: FormDataEntryValue;
};

export async function alumnoCrear(formData: AlumnoFormData) {
    try {
        const resultado = safeParse(AlumnoFormSchema, formData);
        if (resultado.success) {
            const url = 'http://localhost:3000/api/alumno';
            await axios.post(url, {
                rut_alumno: resultado.output.rut_alumno,
                rut_apoderado: resultado.output.rut_apoderado,
                nombre_alumno: resultado.output.nombre_alumno,
                apellido_paterno: resultado.output.apellido_paterno,
                apellido_materno: resultado.output.apellido_materno,
                telefono_alumno: resultado.output.telefono_alumno,
                correo_alumno: resultado.output.correo_alumno,
                direccion_alumno: resultado.output.direccion_alumno,
                diagnostico_ne: resultado.output.diagnostico_ne,
                anio_ingreso_orquesta: resultado.output.anio_ingreso_orquesta,
            });
            return { success: true };
        } else {
            throw new Error('Error en la validacion de datos');
        }
    } catch (error) {
        console.log(error);
    }
}