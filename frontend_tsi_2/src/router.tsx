import { createBrowserRouter, Navigate } from "react-router-dom";
import FichaAlumno, { loader as FichaAlumnoLoader } from "./views/Alumno/FichaAlumno";
import DetalleInstrumento from "./views/instrumentos&Inusmos/DetalleInstrumento";
import DetalleInsumo from "./views/instrumentos&Inusmos/DetalleInsumo";
import ListaAlumnos, { loader as ListaAlumnosLoader } from "./views/Alumno/ListaAlumnos";
import ListaInsumos from "./views/instrumentos&Inusmos/ListaInsumos";
import CrearInsumo from "./views/instrumentos&Inusmos/CrearInsumo";
import Login, {action as loginAction} from "./views/Login";
import EditarAlumno, {loader as EditarAlumnoLoader, action as EditarAlumnoAction} from "./views/Alumno/EditarAlumno";
import { PrivateRoute } from "./components/Privateroute";
import Layout from "./layouts/Layout";
import Home from "./views/Home";

//CREAR PERFILES
import CrearUsuario from "./views/CrearPerfiles/CrearUsuario";
import CrearProfesor from "./views/CrearPerfiles/CrearProfesor";
import CrearAlumno from "./views/CrearPerfiles/CrearAlumno";
import ListaProfesores from "./views/Profesores/ListaProfesores";
import ListaUsuarios from "./views/Admin/ListaUsuarios";
import ListaInstrumentos from "./views/instrumentos&Inusmos/ListaInstrumentos";
import CrearInstrumento from "./views/instrumentos&Inusmos/CrearInstrumento";
import ListaPrestamos from "./views/Prestamo/ListaPrestamos";
import CrearPrestamo from "./views/Prestamo/CrearPrestamo";

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
                    },
                    {
                        path: 'Alumno/ListaAlumnos',
                        element: <ListaAlumnos />,
                        loader: ListaAlumnosLoader
                    },
                    //INSTRUMENTOS E INSUMOS     
                    {
                        path: 'DetalleInstrumento',
                        element: <DetalleInstrumento />,
                    },
                    {
                        path: 'DetalleInsumo',
                        element: <DetalleInsumo />,
                    },
                    {
                        path: 'ListaInsumos',
                        element: <ListaInsumos />,
                    },
                        {
                            path: 'Instrumentos/ListaInstrumentos',
                            element: <ListaInstrumentos />,
                        },
                        {
                            path: 'Instrumentos/CrearInstrumento',
                            element: <CrearInstrumento />,
                        },
                        {
                            path: 'Insumos/CrearInsumo',
                            element: <CrearInsumo />,
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
                ]
            }
        ]
    }
])