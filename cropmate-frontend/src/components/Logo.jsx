import React from 'react';
import logo from '../assets/logo.png';

const Logo = ({ variant = 'default' }) => {
    const isLight = variant === 'light';
    const imgSize = isLight ? 'h-8' : 'h-10';
    const textSize = isLight ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl';
    return (
        <div className="inline-flex items-end active:scale-95 transition-transform duration-150 select-none">
            <img src={logo} alt="CropMate logo" className={`${imgSize} w-auto`} />
            <h3 className={`${textSize} font-extrabold -ms-2 ${isLight ? 'text-white' : 'text-secondary'}`}>
                Crop<span className="text-primary">Mate</span>
            </h3>
        </div>
    );
};

export default Logo;
