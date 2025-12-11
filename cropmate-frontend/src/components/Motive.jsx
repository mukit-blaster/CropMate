import React from 'react';
import rightimg from '../assets/location-merchant.png'; 
import toppng from '../assets/be-a-merchant-bg.png';

const Motive = () => {
    return (
        <section className="p-4 md:p-8">
            <div 
                className="relative max-w-7xl mx-auto rounded-xl overflow-hidden shadow-2xl bg-secondary"
            >
                <img 
                    src={toppng} 
                    alt="Background graphic" 
                    className="absolute top-0 left-0 w-full h-auto object-cover opacity-50"
                />

                <div className="relative p-8 md:p-16 flex flex-col md:flex-row items-center justify-between z-10">
                    
                    <div className="md:w-3/5 text-white text-center md:text-left mb-8 md:mb-0">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">
                            Empowering Farmers & <span className="block">Maximizing Harvests</span>
                        </h2>
                        <p className="text-base text-tertiary mb-8 max-w-lg mx-auto md:mx-0">
                            We provide cutting-edge AI for disease detection, easy access to quality seeds, and a network of skilled labor. CropMate supports every step of your farming journey to ensure the best yield.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <a 
                                href="#" 
                                className="active:scale-95 inline-block px-8 py-3 rounded-full text-lg font-semibold transition-colors duration-300 bg-primary hover:bg-gray-400"
                                style={{ color: '#133330' }}
                            >
                                Start Farming
                            </a>
                            
                            <a 
                                href="#" 
                                className="active:scale-95  inline-block px-8 py-3 rounded-full text-lg font-semibold border-2 border-primary text-primary transition-colors duration-300 hover:bg-white hover:text-black"
                            >
                                List Your Machines
                            </a>
                        </div>
                    </div>

                    <div className="md:w-2/5 flex justify-center md:justify-end min-h-[250px] relative">
                        <img 
                            src={rightimg} 
                            alt="Farmer or technology illustration" 
                            className="w-full max-w-sm h-auto object-contain"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Motive;