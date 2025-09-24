import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

export function PrivateRoute(){
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    useEffect(() => {
        if(!token){
            navigate('/login');
        }
    }, [token, navigate]);

    return token ? <Outlet /> : null;
} 