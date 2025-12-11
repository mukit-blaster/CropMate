import React from 'react';
import useAuth from '../hooks/useAuth';
import { Navigate } from 'react-router';
import { useLocation } from 'react-router';

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();
    
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="loading loading-spinner text-success text-6xl mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }
    
    if (!user) {
        return <Navigate state={location.pathname} to="/login" />;
    }
    
    // Note: Admin role check is done inside AdminDashboard component
    // because we need to fetch user role from backend
    return children;
};

export default AdminRoute;

