import React from 'react';
import fondo01 from '../assets/fondo01.png';

const Hero: React.FC = () => {
  return (
    <section className="h-screen flex items-center bg-gray-100">
      <div className="container mx-auto px-4 flex items-center justify-between">
        
        {/* Imagen Izquierda */}
        <div className="w-1/4 flex justify-center">
          <img src={fondo01} alt="Decoración de comida rápida" className="object-contain h-auto max-w-full" />
        </div>

        {/* Contenido Central */}
        <div className="w-1/2 text-center">
          <div className="bg-white/80 p-8 rounded-lg backdrop-blur-sm shadow-xl">
            <h2 className="text-6xl font-black text-gray-900 mb-4 leading-tight">
              La <span className="text-red-600">Comida Rápida</span> que Mereces
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              Pide en línea y disfruta de nuestras hamburguesas, pizzas y snacks recién hechos, entregados en minutos.
            </p>
            <a
              href="#menu"
              className="bg-red-600 text-white text-xl font-bold py-3 px-8 rounded-full shadow-lg hover:bg-red-700 transition duration-300 transform hover:scale-105 inline-block"
            >
              ¡Ordenar Ahora! 🍔
            </a>
          </div>
        </div>

        {/* Imagen Derecha */}
        <div className="w-1/4 flex justify-center">
          <img src={fondo01} alt="Decoración de comida rápida" className="object-contain h-auto max-w-full" />
        </div>

      </div>
    </section>
  );
};

export default Hero;