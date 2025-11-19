import { createBrowserRouter, Navigate } from "react-router-dom";
import FichaAlumno, { loader as FichaAlumnoLoader } from "./views/Alumno/FichaAlumno";
import DetalleInstrumento from "./views/instrumentos&Inusmos/DetalleInstrumento";
import DetalleInsumo from "./views/instrumentos&Inusmos/DetalleInsumo";
import ListaAlumnos, { loader as ListaAlumnosLoader } from "./views/Alumno/ListaAlumnos";
import ListaInsumos from "./views/instrumentos&Inusmos/ListaInsumos";
import Login, {action as loginAction} from "./views/Login";
import "react-calendar/dist/Calendar.css";
import CrearAlumno, {action as actionCrearAlumno} from "./views/Alumno/CrearAlumno";
import EditarAlumno, {loader as EditarAlumnoLoader, action as EditarAlumnoAction} from "./views/Alumno/EditarAlumno";
import { PrivateRoute } from "./components/Privateroute";
import Layout from "./layouts/Layout";

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
                        element: <Navigate to="/Alumno/ListaAlumnos" replace />,
                    },
                    {
                        path: 'Alumno/Ficha/:rut',
                        element: <FichaAlumno />,
                        loader: FichaAlumnoLoader,
                    },                
                    {
                        path: 'DetalleInstrumento',
                        element: <DetalleInstrumento />,
                    },
                    {
                        path: 'DetalleInsumo',
                        element: <DetalleInsumo />,
                    },
                    {
                        path: 'Alumno/ListaAlumnos',
                        element: <ListaAlumnos />,
                        loader: ListaAlumnosLoader
                    },
                    {
                        path: 'Alumno/EditarAlumno/:rut',
                        element: <EditarAlumno />,
                        loader: EditarAlumnoLoader,
                        action: EditarAlumnoAction,
                    },
                    {
                        path: 'Alumno/CrearAlumno',
                        element: <CrearAlumno />,
                        action: actionCrearAlumno
                    },
                    {
                        path: 'ListaInsumos',
                        element: <ListaInsumos />,
                    },
                ]
            }
        ]
    }
])