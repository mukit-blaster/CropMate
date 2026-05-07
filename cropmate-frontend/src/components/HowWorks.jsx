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
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-5">
          <h2 className="text-2xl md:text-3xl font-extrabold text-secondary">How It Works</h2>
          <p className="text-tertiary text-sm mt-1 max-w-xl">
            Four simple steps to a smarter, more profitable harvest.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cardData.map((card, index) => (
            <div
              key={index}
              className="group relative bg-white p-4 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 border border-gray-100"
            >
              <div className="absolute top-3 right-3 text-[10px] font-bold text-primary/80 bg-secondary/5 rounded-full w-6 h-6 flex items-center justify-center">
                {String(index + 1).padStart(2, '0')}
              </div>
              <div className="bg-primary/20 rounded-lg w-10 h-10 flex items-center justify-center mb-2.5 group-hover:bg-primary transition-colors">
                <card.icon className="text-lg text-secondary" />
              </div>
              <h3 className="text-sm font-bold text-secondary mb-1">{card.title}</h3>
              <p className="text-xs text-tertiary leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowWorks;
