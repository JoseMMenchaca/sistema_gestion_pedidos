import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CarritoContext';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

const Header: React.FC = () => {
   const { totalItems, dispatch } = useCart();

  const handleToggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };
  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-10">
      <div className="container mx-auto flex justify-between items-center p-4">
        <h1 className="text-3xl font-extrabold text-red-600">
          Fast<span className="text-yellow-500">Express</span>
        </h1>
        <nav>
          <ul className="flex space-x-6 text-gray-700 font-medium">
            
            <li>
              <button
            onClick={handleToggleCart}
            className="relative p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
            aria-label="Abrir Carrito de Compras"
          >
            <ShoppingCartIcon className="w-6 h-6 text-gray-700" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                {totalItems}
              </span>
            )}
          </button>
            </li>
            <li><Link to="/login" className="hover:text-red-600 transition">Login</Link></li>
          </ul>

           
        </nav>
      </div>
    </header>
  );
};

export default Header;