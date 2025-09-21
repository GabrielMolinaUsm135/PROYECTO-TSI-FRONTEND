import { createBrowserRouter } from "react-router-dom";
import Layout from "./layouts/Layout";
import Home from "./views/Home";
import FichaAlumno from "./views/Alumno/FichaAlumno";
import CalendarioSemanal from "./views/Calendario/CalendarioSemanal";
import DetalleInstrumento from "./views/instrumentos&Inusmos/DetalleInstrumento";
import DetalleInsumo from "./views/instrumentos&Inusmos/DetalleInsumo";
import ListaAlumnos, {loader as ListaAlumnosLoader}from "./views/Alumno/ListaAlumnos";
import ListaInsumos from "./views/instrumentos&Inusmos/ListaInsumos";
import Login from "./views/Login";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import CrearAlumno from "./views/Alumno/CrearAlumno";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index:true,
                element:<Home/>,
            },
            {
                path: 'FichaAlumno',
                element: <FichaAlumno/>,
            },
            /*
            {
                path: 'CalendarioMensual',
                element: <CalendarioMensual/>,
            },
            */
            {
                path: 'CalendarioMensual',
                element: <Calendar/>,
            },
            {
                path: 'CalendarioSemanal',
                element: <CalendarioSemanal/>,
            },
            {
                path: 'DetalleInstrumento',
                element: <DetalleInstrumento/>,
            },
            {
                path: 'DetalleInsumo',
                element: <DetalleInsumo/>,
            },
            {
                path: 'ListaAlumnos',
                element: <ListaAlumnos/>,
                // loader: ListaAlumnosLoader
            },
            {
                path: 'Alumno/CrearAlumno',
                element: <CrearAlumno/>
            },
            {
                path: 'ListaInsumos',
                element: <ListaInsumos/>,
            },
            {
                path: 'Login',
                element: <Login/>,
            },
            
        ]
    }
])