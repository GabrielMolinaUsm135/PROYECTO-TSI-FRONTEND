import { createBrowserRouter, Navigate } from "react-router-dom";
import FichaAlumno, { loader as FichaAlumnoLoader } from "./views/Alumno/FichaAlumno";
import DetalleInstrumento, { loader as DetalleInstrumentoLoader } from "./views/instrumentos&Inusmos/DetalleInstrumento";
import DetalleInsumo, { loader as DetalleInsumoLoader } from "./views/instrumentos&Inusmos/DetalleInsumo";
import ListaAlumnos, { loader as ListaAlumnosLoader } from "./views/Alumno/ListaAlumnos";
import ListaInsumos, { loader as ListaInsumosLoader } from "./views/instrumentos&Inusmos/ListaInsumos";
import CrearInsumo, { action as CrearInsumoAction } from "./views/instrumentos&Inusmos/CrearInsumo";
import Login, {action as loginAction} from "./views/Login";
import EditarAlumno, {loader as EditarAlumnoLoader, action as EditarAlumnoAction} from "./views/Alumno/EditarAlumno";
import { PrivateRoute } from "./components/Privateroute";
import Layout from "./layouts/Layout";
import Home from "./views/Home";

//CREAR PERFILES
import CrearUsuario from "./views/CrearPerfiles/CrearUsuario";
import CrearProfesor from "./views/CrearPerfiles/CrearProfesor";
import CrearAlumno from "./views/CrearPerfiles/CrearAlumno";
import ListaProfesores, { loader as ListaProfesoresLoader } from "./views/Profesores/ListaProfesores";
import EditarProfesor, { loader as EditarProfesorLoader, action as EditarProfesorAction } from "./views/Profesores/EditarProfe";
import ListaUsuarios from "./views/Admin/ListaUsuarios";
import ListaInstrumentos, { loader as ListaInstrumentosLoader } from "./views/instrumentos&Inusmos/ListaInstrumentos";
import CrearInstrumento, { action as CrearInstrumentoAction } from "./views/instrumentos&Inusmos/CrearInstrumento";
import EditarInstrumento, { loader as EditarInstrumentoLoader } from "./views/instrumentos&Inusmos/EditarInstrumento";
import EditarInsumo, { loader as EditarInsumoLoader } from "./views/instrumentos&Inusmos/EditarInsumo";
import ListaAlergias, { loader as ListaAlergiasLoader } from "./views/Alergias/ListaAlergias";
import CrearAlergia from "./views/Alergias/CrearAlergia";
import DetalleAlergia, { loader as DetalleAlergiaLoader } from "./views/Alergias/DetalleAlergia";
import EditarAlergia, { loader as EditarAlergiaLoader } from "./views/Alergias/EditarAlergia";
import ListaApoderados, { loader as ListaApoderadosLoader } from "./views/Apoderados/ListaApoderados";
import CrearApoderado from "./views/Apoderados/CrearApoderado";
import DetalleApoderado, { loader as DetalleApoderadoLoader } from "./views/Apoderados/DetalleApoderado";
import EditarApoderado, { loader as EditarApoderadoLoader } from "./views/Apoderados/EditarApoderado";
import ListaPrestamos from "./views/Prestamo/ListaPrestamos";
import CrearPrestamo from "./views/Prestamo/CrearPrestamo";
import FichaProfesor, { loader as FichaProfesorLoader } from "./views/Profesores/FichaProfe";
import EditarNotas, { loader as EditarNotasLoader, action as EditarNotasAction } from "./views/Notas/NotaEdit";

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login/>,
        action: loginAction,
    },
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                element: <PrivateRoute/>,
                children: [
                    {
                        index: true,
                        element: <Navigate to="/Home" replace />,
                    },
                    {
                        path: 'Home',
                        element: <Home/>
                    },
                    //CREAR PERFILES
                    {
                        path: 'CrearUsuario',
                        element: <CrearUsuario/>
                    },
                    {
                        path: 'CrearProfesor',
                        element: <CrearProfesor/>
                    },
                    {
                        path: 'CrearAlumno',
                        element: <CrearAlumno/>,
                    },                           
                    //LISTAR
                    {
                        path: 'Usuario/ListaUsuarios',
                        element: <ListaUsuarios/>,
                    },
                    {
                        path: 'Profesor/ListaProfesores',
                        element: <ListaProfesores/>,
                        loader: ListaProfesoresLoader,
                    },
                        {
                            path: 'Profesor/EditarProfesor/:id',
                            element: <EditarProfesor />,
                            loader: EditarProfesorLoader,
                            action: EditarProfesorAction,
                        },
                        // APODERADOS
                        {
                            path: 'Apoderados/ListaApoderados',
                            element: <ListaApoderados />,
                            loader: ListaApoderadosLoader,
                        },
                        {
                            path: 'Apoderados/CrearApoderado',
                            element: <CrearApoderado />,
                        },
                        {
                            path: 'Apoderados/Detalle/:id',
                            element: <DetalleApoderado />,
                            loader: DetalleApoderadoLoader,
                        },
                        {
                            path: 'Apoderados/Editar/:id',
                            element: <EditarApoderado />,
                            loader: EditarApoderadoLoader,
                        },
                        {
                            path: 'Profesor/Ficha/:id',
                            element: <FichaProfesor />,
                            loader: FichaProfesorLoader,
                        },
                    {
                        path: 'Alumno/ListaAlumnos',
                        element: <ListaAlumnos />,
                        loader: ListaAlumnosLoader
                    },
                    //INSTRUMENTOS E INSUMOS     
                    {
                        path: 'Instrumentos/Detalle/:cod',
                        element: <DetalleInstrumento />,
                        loader: DetalleInstrumentoLoader,
                    },
                    {
                        path: 'Insumos/Detalle/:cod',
                        element: <DetalleInsumo />,
                        loader: DetalleInsumoLoader,
                    },
                    {
                        path: 'ListaInsumos',
                        element: <ListaInsumos />,
                        loader: ListaInsumosLoader,
                    },
                        {
                            path: 'Instrumentos/ListaInstrumentos',
                            element: <ListaInstrumentos />,
                            loader: ListaInstrumentosLoader,
                        },
                        {
                            path: 'Instrumentos/Editar/:id',
                            element: <EditarInstrumento />,
                            loader: EditarInstrumentoLoader,
                        },
                        {
                            path: 'Instrumentos/CrearInstrumento',
                            element: <CrearInstrumento />,
                            action: CrearInstrumentoAction,
                        },
                        {
                            path: 'Insumos/CrearInsumo',
                            element: <CrearInsumo />,
                            action: CrearInsumoAction,
                        },
                        {
                            path: 'Insumos/Editar/:id',
                            element: <EditarInsumo />,
                            loader: EditarInsumoLoader,
                        },
                        // PRESTAMOS
                        {
                            path: 'Prestamo/ListaPrestamos',
                            element: <ListaPrestamos />,
                        },
                        {
                            path: 'Prestamo/CrearPrestamo',
                            element: <CrearPrestamo />,
                        },
                        // ALERGIAS
                        {
                            path: 'Alergias/ListaAlergias',
                            element: <ListaAlergias />,
                            loader: ListaAlergiasLoader,
                        },
                        {
                            path: 'Alergias/CrearAlergia',
                            element: <CrearAlergia />,
                        },
                        {
                            path: 'Alergias/Detalle/:id',
                            element: <DetalleAlergia />,
                            loader: DetalleAlergiaLoader,
                        },
                        {
                            path: 'Alergias/Editar/:id',
                            element: <EditarAlergia />,
                            loader: EditarAlergiaLoader,
                        },
                    //ALUMNO
                    {
                        // accept an id (preferred) but loader will also handle rut strings
                        path: 'Alumno/Ficha/:id',
                        element: <FichaAlumno />,
                        loader: FichaAlumnoLoader,
                    },  
                    {
                        path: 'Alumno/EditarAlumno/:rut',
                        element: <EditarAlumno />,
                        loader: EditarAlumnoLoader,
                        action: EditarAlumnoAction,
                    },
                    {
                        path: 'alumno/notas/:id',
                        element: <EditarNotas/>,
                        loader: EditarNotasLoader,
                        action: EditarNotasAction,
                    }
                ]
            }
        ]
    }
])