import React, { useState, useEffect } from 'react'; // 👈 Importa useState y useEffect
import type { Producto } from '../types';
import axios from 'axios';


const API_URL = 'http://localhost:3000/api/productos'; 


async function getFeaturedItems(): Promise<Producto[]> {
  try {
    const response = await axios.get<Producto[]>(API_URL);
    const featuredItems: Producto[] = response.data;
    console.log('Datos cargados con éxito:', featuredItems);
    return featuredItems;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error al obtener los datos:', error.message);
      return []; 
    }
    console.error('Ocurrió un error inesperado:', error);
    return [];
  }
}


interface FoodCardProps {
  item: Producto;
}

const FoodCard: React.FC<FoodCardProps> = ({ item }) => (
  <div className="bg-white rounded-xl shadow-2xl overflow-hidden transform hover:scale-105 transition duration-300">
    <img 
      src={`/${item.imagen}`} 
      alt={item.nombre} 
      className="w-full h-48 object-cover" 
    />
    <div className="p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.nombre}</h3>
      <p className="text-gray-600 mb-4">{item.descripcion}</p>
      <div className="flex justify-between items-center">
        <span className="text-3xl font-extrabold text-red-600">${item.precio.toFixed(2)}</span>
        <button className="bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-full hover:bg-yellow-600 transition">
          Añadir
        </button>
      </div>
    </div>
  </div>
);


const FeaturedMenu: React.FC = () => {
  const [featuredItems, setFeaturedItems] = useState<Producto[]>([]);
  const [isLoading, setIsLoading] = useState(true); 
  useEffect(() => {

    const loadItems = async () => {
      setIsLoading(true); 
      const data = await getFeaturedItems();
      setFeaturedItems(data); 
      setIsLoading(false); 
    };

    loadItems();
  }, []); 
  if (isLoading) {
    return (
      <section id="menu" className="py-20 text-center">
        <h2 className="text-4xl font-semibold text-gray-700">Cargando menú... ⏳</h2>
      </section>
    );
  }

  if (featuredItems.length === 0) {
    return (
      <section id="menu" className="py-20 text-center">
        <h2 className="text-4xl font-semibold text-red-500">No se encontraron productos. 😢</h2>
      </section>
    );
  }

  return (
    <section id="menu" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-extrabold text-center text-gray-900 mb-12">
          Nuestros Favoritos 🔥
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {featuredItems.map(item => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedMenu;