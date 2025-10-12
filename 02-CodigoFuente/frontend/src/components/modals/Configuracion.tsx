import { useState } from 'react';
import Productos from '../Productos';
import Categorias from '../Categorias';

const Configuracion = () => {
  const [activeTab, setActiveTab] = useState('productos');

  return (
    <div className="p-4">
      <div className="flex border-b">
        <button
          className={`px-4 py-2 ${activeTab === 'productos' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('productos')}
        >
          Productos
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'categorias' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('categorias')}
        >
          Categorías
        </button>
      </div>
      <div className="pt-4">
        {activeTab === 'productos' && <Productos />}
        {activeTab === 'categorias' && <Categorias />}
      </div>
    </div>
  );
};

export default Configuracion;
