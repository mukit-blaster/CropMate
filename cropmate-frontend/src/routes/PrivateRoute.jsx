import React from 'react';
import useAuth from '../hooks/useAuth';
import { Navigate } from 'react-router';
import { useLocation } from 'react-router';

const PrivateRoute = ({children}) => {
    const {user, loading} = useAuth();
    const location = useLocation()
    if(loading){
        return <div>
            <span className="loading loading-spinner text-success"></span>
        </div>
    }
    
    if(!user){
        return <Navigate state={location.pathname} to = "/login"></Navigate>
    }
    
    return children;
};

export default PrivateRoute;