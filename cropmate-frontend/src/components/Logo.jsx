import React from 'react';
import logo from '../assets/logo.png';

const Logo = () => {
    return (
        <div className="flex items-end active:scale-95 transition-transform duration-150">
            <img src={logo} alt="logo" />
            <h3 className="text-3xl font-extrabold -ms-3.5 text-green-600">Crop<span className='text-yellow-400'>Mate</span></h3>
        </div>
    );
};

export default Logo;