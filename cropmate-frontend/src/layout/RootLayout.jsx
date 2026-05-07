import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const RootLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 max-w-10/12 w-full mx-auto max-sm:max-w-11/12">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default RootLayout;
