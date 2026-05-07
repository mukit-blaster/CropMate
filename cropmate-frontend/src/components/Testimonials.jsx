import React from 'react';
import testimonialIllustration from '../assets/customer-top.png'; 
import ReviewCarousel from './ReviewCarousel'; 

const Testimonials = () => {

    return (
        <section className="bg-gray-100 py-10 px-4 md:px-8">
            <div className="max-w-6xl mx-auto text-center">

                <div className="mb-4">
                    <img
                        src={testimonialIllustration}
                        alt="Customer review illustration"
                        className="h-16 w-auto object-contain mx-auto"
                    />
                </div>

                <h2 className="text-2xl md:text-3xl font-extrabold text-secondary tracking-wide mb-2">
                    What our customers are saying
                </h2>
                <p className="text-sm text-tertiary max-w-xl mx-auto mb-6">
                    Hear from farmers who've boosted their yield and grown smarter with CropMate.
                </p>

                <ReviewCarousel />

            </div>
        </section>
    );
};

export default Testimonials;