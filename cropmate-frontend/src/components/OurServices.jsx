import React from 'react';
import { FaTractor, FaSeedling } from 'react-icons/fa';
import { FiUsers, FiCamera, FiActivity } from 'react-icons/fi';
import { MdOutlineSupportAgent } from 'react-icons/md';

const serviceCards = [
  {
    image: FaSeedling,
    title: 'Agricultural Marketplace',
    description: 'Buy high-quality seeds, fertilizers, and crop medicines directly from trusted suppliers with doorstep delivery.',
    isHighlighted: false,
  },
  {
    image: FaTractor,
    title: 'Machinery Rental',
    description: 'Rent modern tractors, harvesters, and other heavy equipment at affordable hourly or daily rates to mechanize your farm.',
    isHighlighted: true,
  },
  {
    image: FiUsers,
    title: 'Hire Skilled Labor',
    description: 'Connect with and hire experienced farm workers for planting, harvesting, and field maintenance tasks during peak seasons.',
    isHighlighted: false,
  },
  {
    image: FiCamera,
    title: 'AI Disease Detection',
    description: 'Instantly detect crop diseases by simply taking a photo. Our AI analyzes the image and suggests the right treatment.',
    isHighlighted: false,
  },
  {
    image: FiActivity,
    title: 'Smart Crop Recommendations',
    description: 'Get data-driven insights on the best crops to cultivate based on your specific soil type, weather conditions, and season.',
    isHighlighted: false,
  },
  {
    image: MdOutlineSupportAgent,
    title: 'Expert Consultation',
    description: 'Get 24/7 access to agricultural experts to resolve your farming queries and get advice on maximizing your yield.',
    isHighlighted: false,
  },
];

const OurServices = () => {
  return (
    <section className="bg-secondary py-16 px-4 sm:px-6 lg:px-8 rounded-4xl">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-extrabold text-white mb-4">Our Services</h2>
        <p className="textarea-md text-gray-500 max-w-2xl mx-auto">
          Enjoy smart, efficient farming with real-time insights and zero hassle. From planting seeds to harvesting crops — we optimize your yield, every season.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {serviceCards.map((card, index) => (
          <div
            key={index}
            className='
              relative p-8 rounded-xl shadow-lg flex flex-col items-center text-left bg-white hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out hover:bg-primary h-70'
          >
            <card.image className="text-5xl mb-6 text-secondary" />
            
            <h3 className="textarea-xl font-bold text-secondary mb-3">
              {card.title}
            </h3>
            <p className="text-tertiary textarea-md">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurServices;