import React from 'react';
import { FiUsers, FiShoppingCart, FiCamera, FiTrendingUp } from 'react-icons/fi';

const cardData = [
  {
    icon: FiUsers, 
    title: 'Hire Labor & Machines',
    description: 'Easily connect with skilled farm workers and rent modern machinery for your field operations.',
  },
  {
    icon: FiShoppingCart, 
    title: 'Buy Seeds & Medicine',
    description: 'Purchase high-quality seeds, fertilizers, and crop medicines from trusted suppliers.',
  },
  {
    icon: FiCamera, 
    title: 'AI Disease Detection',
    description: 'Scan your crops to instantly detect diseases and get AI-powered treatment recommendations.',
  },
  {
    icon: FiTrendingUp, 
    title: 'Smart Crop Suggestion',
    description: 'Get data-driven insights on the best crops to cultivate based on your soil and season.',
  },
];

const HowWorks = () => {
  return (
    <div className=" py-10 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-extrabold text-secondary mb-8 text-left">
        How it Works
      </h2>
      <div className="flex flex-wrap justify-center gap-7">
        {cardData.map((card, index) => (
          <div 
            key={index} 
            className="bg-white p-6 rounded-xl shadow-lg w-full sm:w-60 flex flex-col items-start"
            style={{ minHeight: '10rem' }}
          >
            <card.icon className="text-4xl text-secondary mb-3" />
            <h3 className="text-lg font-bold text-secondary mb-2">
              {card.title}
            </h3>
            <p className="text-normal text-tertiary leading-relaxed text-left">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowWorks;