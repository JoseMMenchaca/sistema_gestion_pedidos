import React from 'react';

const Hero: React.FC = () => {
  return (
    <section 
      className="pt-24 h-screen flex items-center bg-gray-100" 
      style={{ backgroundImage: "url('/fastfood-bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="container mx-auto px-4 text-center">
        <div className="bg-white/80 p-8 rounded-lg max-w-2xl mx-auto backdrop-blur-sm">
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
      {/* Añade una imagen de fondo en /public/fastfood-bg.jpg para este componente. */}
    </section>
  );
};

export default Hero;