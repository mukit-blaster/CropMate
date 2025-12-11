import React, { useState } from 'react';
import { FiChevronUp, FiChevronDown, FiArrowRight } from 'react-icons/fi';

const faqData = [
  {
    question: "What is CropMate and how does it help farmers?",
    answer:
      "CropMate is a smart farming platform that acts as your digital partner. It helps you hire skilled labor and machinery, buy quality seeds and medicines, and uses AI to detect crop diseases and suggest the best crops for your land.",
  },
  {
    question: "How do I hire workers or rent machinery?",
    answer:
      "Simply navigate to the 'Hire' section of the app. You can browse listings for available farm laborers and machinery (like tractors or harvesters) in your area, check their rates, and book them directly.",
  },
  {
    question: "How does the AI disease detection work?",
    answer:
      "It's simple: take a clear photo of your affected crop and upload it to the 'Detect' feature. Our AI analyzes the image to identify the specific disease and immediately suggests the appropriate medicine or treatment.",
  },
  {
    question: "Can I buy seeds and medicines directly from the app?",
    answer:
    "Yes! Our 'Buy' marketplace allows you to order high-quality seeds, fertilizers, and crop medicines from verified suppliers. We ensure you get authentic products delivered to your location.",
  },
  {
    question: "How does CropMate suggest which crop to grow?",
    answer:
      "Our 'Smart Crop Suggestion' feature analyzes data such as your soil type, current season, and regional climate conditions to recommend crops that will provide the highest yield and profitability for your specific farm.",
  },
  {
    question: "Are the suppliers on CropMate verified?",
    answer:
      "Yes, we vet our suppliers to ensure that the seeds, medicines, and machinery listed on our platform meet quality standards, giving you peace of mind with every purchase or rental.",
  },
  {
    question: "Do you offer delivery for purchased items?",
    answer:
      "Yes, we provide delivery services for seeds, medicines, and other agricultural products purchased through the app. Delivery times may vary based on your location.",
  },
  {
    question: "Can I list my own machinery for rent?",
    answer:
      "Absolutely. CropMate is a community platform. If you own machinery that is sitting idle, you can list it for rent on our platform to earn extra income by helping other farmers.",
  },
  {
    question: "Is the app free to use?",
    answer:
      "Downloading and registering on CropMate is free. You only pay for the specific services you use, such as purchasing products or hiring labor/machinery.",
  },
];

const INITIAL_VISIBLE_COUNT = 5;

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleShowMore = () => {
    setVisibleCount(faqData.length);
  };

  const isShowMoreVisible = visibleCount < faqData.length;

  return (
    <section className="bg-gray-50 py-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-secondary tracking-wide">
            Frequently Asked Question (FAQ)
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Enhance crop yields, farm efficiency, and profitability effortlessly with CropMate. Achieve smarter farming, reduce operational hassle, and maximize your harvest with ease!
          </p>
        </div>

        <div className="space-y-4">
          {faqData.slice(0, visibleCount).map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`
                  bg-white rounded-lg shadow-sm overflow-hidden border-2
                  ${isOpen ? 'border-teal-300' : 'border-gray-200'}
                  transition-all duration-300 transform group
                  opacity-100 translate-y-0
                `}
                // REMOVED data-aos="fade-up" from here
              >
                <button
                  className={`
                    w-full flex justify-between items-center p-5 text-left font-semibold
                    ${isOpen ? 'text-teal-700 bg-teal-50' : 'text-gray-700 hover:bg-gray-50'}
                  `}
                  onClick={() => toggleFAQ(index)}
                >
                  {item.question}
                  {isOpen ? (
                    <FiChevronUp className="text-xl transition-transform duration-300" />
                  ) : (
                    <FiChevronDown className="text-xl transition-transform duration-300" />
                  )}
                </button>

                <div
                  className={`
                    transition-all duration-500 ease-in-out overflow-hidden
                    ${isOpen ? 'max-h-96 opacity-100 p-5 pt-0' : 'max-h-0 opacity-0 p-0'}
                  `}
                >
                  <p className="text-tertiary text-sm border-t border-gray-200 pt-5">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        {isShowMoreVisible && (
          <div className="flex justify-center mt-12 transition-opacity duration-500">
            <button
              onClick={handleShowMore}
              className="flex items-center gap-2 px-8 py-3 rounded-full text-lg font-semibold text-gray-800 transition-shadow duration-300 shadow-md hover:shadow-lg"
              style={{ backgroundColor: '#B8EA5C' }}
            >
              See More FAQ's
              <FiArrowRight />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FAQSection;