import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-10">
      <div className="container mx-auto flex justify-between items-center p-4">
        <h1 className="text-3xl font-extrabold text-red-600">
          Fast<span className="text-yellow-500">Food</span>
        </h1>
        <nav>
          <ul className="flex space-x-6 text-gray-700 font-medium">
            <li><a href="#menu" className="hover:text-red-600 transition">Menú</a></li>
            <li><a href="#ofertas" className="hover:text-red-600 transition">Ofertas</a></li>
            <li><a href="#contacto" className="hover:text-red-600 transition">Contacto</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;