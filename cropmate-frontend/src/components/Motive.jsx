import React from 'react';
import rightimg from '../assets/location-merchant.png'; 
import toppng from '../assets/be-a-merchant-bg.png';

const Motive = () => {
    return (
        <section className="px-4 md:px-6 py-4">
            <div className="relative max-w-7xl mx-auto rounded-xl overflow-hidden shadow-xl bg-secondary">
                <img
                    src={toppng}
                    alt="Background graphic"
                    className="absolute top-0 left-0 w-full h-auto object-cover opacity-50"
                />

                <div className="relative p-6 md:p-10 flex flex-col md:flex-row items-center justify-between z-10">

                    <div className="md:w-3/5 text-white text-center md:text-left mb-6 md:mb-0">
                        <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold mb-2 leading-tight">
                            Empowering Farmers & <span className="block">Maximizing Harvests</span>
                        </h2>
                        <p className="text-sm text-gray-300 mb-5 max-w-lg mx-auto md:mx-0">
                            Cutting-edge AI for disease detection, quality seeds, and skilled labor — CropMate supports every step of your farming journey.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-2.5 justify-center md:justify-start">
                            <a
                                href="#"
                                className="active:scale-95 inline-block px-5 py-2 rounded-full text-sm font-semibold transition-colors duration-300 bg-primary hover:bg-gray-400"
                                style={{ color: '#133330' }}
                            >
                                Start Farming
                            </a>
                            <a
                                href="#"
                                className="active:scale-95 inline-block px-5 py-2 rounded-full text-sm font-semibold border-2 border-primary text-primary transition-colors duration-300 hover:bg-white hover:text-black"
                            >
                                List Your Machines
                            </a>
                        </div>
                    </div>

                    <div className="md:w-2/5 flex justify-center md:justify-end relative">
                        <img
                            src={rightimg}
                            alt="Farmer or technology illustration"
                            className="w-full max-w-xs h-auto object-contain"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Motive;