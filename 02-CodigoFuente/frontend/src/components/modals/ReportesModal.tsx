import { useState } from 'react';
import Productos from '../ReporteVentas';
import Categorias from '../ReporteProductos';

const Configuracion = () => {
  const [activeTab, setActiveTab] = useState('ventas');

  return (
    <div className="p-4">
      <div className="flex border-b">
        <button
          className={`px-4 py-2 ${activeTab === 'ventas' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('ventas')}
        >
          Reporte de Ventas 
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'productos' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('productos')}
        >
          Top Productos 🔥
        </button>
      </div>
      <div className="pt-4">
        {activeTab === 'ventas' && <Productos />}
        {activeTab === 'productos' && <Categorias />}
      </div>
    </div>
  );
};

export default Configuracion;
