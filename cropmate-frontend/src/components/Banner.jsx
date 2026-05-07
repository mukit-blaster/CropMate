import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import banner1 from '../assets/banner/banner1.png';
import banner2 from '../assets/banner/banner2.png';
import banner3 from '../assets/banner/banner3.png';

const slides = [banner1, banner2, banner3];

const Banner = () => {
    return (
        <div className="rounded-3xl overflow-hidden shadow-lg">
            <Carousel
                autoPlay
                infiniteLoop
                stopOnHover
                interval={4500}
                showThumbs={false}
                showStatus={false}
                showArrows={true}
                swipeable
                emulateTouch
            >
                {slides.map((src, i) => (
                    <div key={i}>
                        <img className="rounded-3xl object-cover" src={src} alt={`CropMate banner ${i + 1}`} />
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default Banner;
