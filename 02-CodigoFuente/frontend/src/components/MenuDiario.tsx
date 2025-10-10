import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- Type Definitions ---
interface CategoriaInfo {
  id: number;
  nombre: string;
}

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  estado: boolean;
  imagen: string;
  categoria: CategoriaInfo;
}

interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
  productos: Producto[];
}

// --- API URLs ---
const API_CATEGORIAS_URL = 'http://localhost:3000/api/categoria';
const API_PRODUCTOS_URL = 'http://localhost:3000/api/productos';

// --- Main Component ---
const MenuDiario: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productUpdates, setProductUpdates] = useState<Record<number, { stock: number; estado: boolean }>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, prodRes] = await Promise.all([
          axios.get(API_CATEGORIAS_URL),
          axios.get<Producto[]>(API_PRODUCTOS_URL),
        ]);

        const productos: Producto[] = prodRes.data;
        const categoriasData: Categoria[] = catRes.data.map((cat: any) => ({
          ...cat,
          productos: productos.filter(p => p.categoria.id === cat.id),
        }));

        setCategorias(categoriasData);

        const initialUpdates: Record<number, { stock: number; estado: boolean }> = {};
        productos.forEach(p => {
          initialUpdates[p.id] = { stock: 100, estado: false };
        });
        setProductUpdates(initialUpdates);

      } catch (err) {
        setError('Error al cargar los datos. Verifique la conexión con el backend.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (productId: number, field: 'stock' | 'estado', value: number | boolean) => {
    setProductUpdates(prev => ({
      ...prev,
      [productId]: { ...prev[productId], [field]: value },
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const updatePromises = Object.entries(productUpdates).map(([productId, data]) => {
        return axios.put(`${API_PRODUCTOS_URL}/${productId}`, data);
      });

      await Promise.all(updatePromises);
      alert('Jornada inicializada con éxito!');
      // Optionally, you might want to refetch data here
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
      alert('Hubo un error al guardar los cambios.');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-full mx-auto">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-gray-800">
          Inicialización de Jornada: <span className="capitalize">{today}</span>
        </h2>
      </div>

      <div className="p-6">
        {loading && <div className="text-center py-10">Cargando...</div>}
        {error && <div className="text-center py-10 text-red-500">{error}</div>}
        {!loading && !error && (
          <div className="space-y-8">
            {categorias.map(categoria => (
              <div key={categoria.id}>
                <h3 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b-2 border-gray-200">{categoria.nombre}</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Imagen</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {categoria.productos.map(producto => (
                        <tr key={producto.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <img src={`http://localhost:3000${producto.imagen}`} alt={producto.nombre} className="w-32 h-32 object-cover rounded-md shadow-sm" />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{producto.nombre}</div>
                            <div className="text-sm text-gray-500">{producto.descripcion}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              value={productUpdates[producto.id]?.stock ?? 100}
                              onChange={(e) => handleInputChange(producto.id, 'stock', parseInt(e.target.value, 10))}
                              className="w-24 p-2 border border-gray-300 rounded-md"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={productUpdates[producto.id]?.estado ?? false}
                              onChange={(e) => handleInputChange(producto.id, 'estado', e.target.checked)}
                              className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
            <div className="flex justify-end pt-6 border-t">
              <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuDiario;