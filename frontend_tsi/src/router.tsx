import { createBrowserRouter } from "react-router-dom";
import Layout from "./layouts/Layout";
import Home from "./views/Home";
import FichaAlumno from "./views/FichaAlumno";
import CalendarioMensual from "./views/CalendarioMensual";
import CalendarioSemanal from "./views/CalendarioSemanal";
import DetalleInstrumento from "./views/DetalleInstrumento";
import DetalleInsumo from "./views/DetalleInsumo";
import ListaAlumnos from "./views/ListaAlumnos";
import ListaInsumos from "./views/ListaInsumos";
import Login from "./views/Login";

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
            {
                path: 'CalendarioMensual',
                element: <CalendarioMensual/>,
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