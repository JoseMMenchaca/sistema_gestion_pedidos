import React from 'react';
import fondo01 from '../assets/admin01.png';

const HeroAdmin: React.FC = () => {
  return (
    <section className="h-screen flex items-center justify-center bg-gray-100">
      <div className="w-1/3 flex justify-center">
        <img src={fondo01} alt="Admin" className="object-contain h-auto max-w-full" />
      </div>
    </section>
  );
};

export default HeroAdmin;