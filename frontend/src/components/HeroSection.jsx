import React from 'react';
import { Link } from 'react-router-dom';
import HeroImg from '../assets/certhero.png';

const HeroSection = () => {
  return (
    <section
      className="min-h-[80vh] flex items-center justify-start bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${HeroImg})`,
      }}
    >
      {/* Full Image Blur */}
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
      ></div>

      {/* Stronger Blur Overlay on Left for Text */}
      <div
        className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-50/90 to-transparent backdrop-blur-md"
        style={{ width: '50%' }}
      ></div>

      {/* Text Section */}
      <div className="w-full md:w-2/5 p-6 md:p-12 flex flex-col justify-center space-y-6 z-10">
        <h1 className="text-3xl md:text-4xl font-bold text-green-900 leading-tight">
          Empower Your Academic Journey with FUTO
        </h1>
        <p className="text-base md:text-lg text-green-800">
          Access your student portal, manage academic records, or verify credentials seamlessly.
        </p>
        <div className="flex space-x-4">
          <Link
            to="/login"
            className="bg-green-600 text-white px-5 py-2.5 rounded-full font-semibold hover:bg-green-700 hover:shadow-md transition-all duration-300 text-sm md:text-base"
          >
            Get Started
          </Link>
          <Link
            to="/about"
            className="bg-green-50 border-2 border-green-600 text-green-600 px-5 py-2.5 rounded-full font-semibold hover:bg-green-600 hover:text-white transition-all duration-300 text-sm md:text-base"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;