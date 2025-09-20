import { createBrowserRouter } from "react-router-dom";
import Layout from "./layouts/Layout";
import Home from "./views/Home";
import FichaAlumno from "./views/FichaAlumno";
import CalendarioSemanal from "./views/CalendarioSemanal";
import DetalleInstrumento from "./views/DetalleInstrumento";
import DetalleInsumo from "./views/DetalleInsumo";
import ListaAlumnos, {loader as ListaAlumnosLoader}from "./views/ListaAlumnos";
import ListaInsumos from "./views/ListaInsumos";
import Login from "./views/Login";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

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
                loader: ListaAlumnosLoader
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