import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

const API_CATEGORIAS_URL = '/api/categoria';
const API_PRODUCTOS_URL = '/api/productos/lista';
const API_PRODUCTOS_URL_UPDATE = '/api/productos';

const InicializarMenu: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productUpdates, setProductUpdates] = useState<Record<number, { stock: number; estado: boolean }>>({});
  
  const [productosMap, setProductosMap] = useState<Record<number, Producto>>({}); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, prodRes] = await Promise.all([
          axios.get(API_CATEGORIAS_URL),
          axios.get<Producto[]>(API_PRODUCTOS_URL),
        ]);

        const productos: Producto[] = prodRes.data;
        
        const map: Record<number, Producto> = {};
        productos.forEach(p => {
          map[p.id] = p;
        });
        setProductosMap(map);


        const categoriasData: Categoria[] = catRes.data.map((cat: any) => ({
          ...cat,
          productos: productos.filter(p => p.categoria.id === cat.id),
        }));

        setCategorias(categoriasData);

        const initialUpdates: Record<number, { stock: number; estado: boolean }> = {};
        productos.forEach(p => {
          initialUpdates[p.id] = { stock: p.stock, estado: p.estado };
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
      
      const productIdsToUpdate = Object.keys(productUpdates).map(id => parseInt(id));

      const updatePromises = productIdsToUpdate.map(productId => {
        const originalProduct = productosMap[productId];
        const updatedFields = productUpdates[productId];

        if (!originalProduct) {
          console.error(`Producto con ID ${productId} no encontrado en el mapa.`);
          return Promise.resolve(); // Salta si el producto no existe
        }

        // Crear el objeto Producto completo para enviar al backend
        const fullUpdatedProduct: Producto = {
          ...originalProduct,
          stock: updatedFields.stock,
          estado: updatedFields.estado,
        };

        return axios.put(`${API_PRODUCTOS_URL_UPDATE}/${productId}`, fullUpdatedProduct);
      });

      await Promise.all(updatePromises);
      alert('Cambios guardados con éxito!');

      // Refrescar el estado local después de guardar (asumiendo que la actualización fue exitosa)
      // Esto es importante para que el UI refleje el nuevo "estado original"
      setCategorias(prevCategorias => 
        prevCategorias.map(categoria => ({
          ...categoria,
          productos: categoria.productos.map(p => {
            const updatedData = productUpdates[p.id];
            if (updatedData) {
              return { ...p, stock: updatedData.stock, estado: updatedData.estado };
            }
            return p;
          }),
        }))
      );
      
      setProductosMap(prevMap => {
        const newMap = { ...prevMap };
        productIdsToUpdate.forEach(id => {
          const original = prevMap[id];
          const updated = productUpdates[id];
          if (original && updated) {
            newMap[id] = { ...original, stock: updated.stock, estado: updated.estado };
          }
        });
        return newMap;
      });
      
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
      alert('Hubo un error al guardar los cambios.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Inicialización de Jornada", 14, 16);
    doc.text(today, 14, 24);

    let y = 30;

    categorias.forEach(categoria => {
      if (y > 250) { // Add new page if content overflows
        doc.addPage();
        y = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFillColor(255, 165, 0, 0.2); // Light orange background
      doc.rect(14, y, 182, 8, 'F');
      doc.text(categoria.nombre, 15, y + 6);
      y += 10;
      doc.setFont('helvetica', 'normal');

      const tableData = categoria.productos.map(p => [
        p.nombre,
        productUpdates[p.id]?.stock ?? p.stock,
        (productUpdates[p.id]?.estado ?? p.estado) ? 'Activo' : 'Inactivo',
      ]);

      autoTable(doc, {
        startY: y,
        head: [['Producto', 'Stock', 'Estado']],
        body: tableData,
      });

      y = (doc as any).lastAutoTable.finalY + 10;
    });

    window.open(doc.output('bloburl'), '_blank');
  };

  const today = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-full mx-auto">
      <div className="sticky top-0 bg-white p-6 border-b z-10">
        <h2 className="text-2xl font-bold text-gray-800">
          Inicialización/Modificación de Oferta: <span className="capitalize">{today}</span>
        </h2>
      </div>

      <div className="p-6 pb-24"> 
        {loading && <div className="text-center py-10">Cargando...</div>}
        {error && <div className="text-center py-10 text-red-500">{error}</div>}
        {!loading && !error && (
          <div className="space-y-8">
            {categorias.map(categoria => (
              <div key={categoria.id}>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 p-3 bg-orange-200 rounded-md">{categoria.nombre}</h3>
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
                        <tr key={producto.id} className={(productUpdates[producto.id]?.estado ?? producto.estado) ? 'bg-white' : 'bg-red-100'}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <img src={`http://localhost:3000${producto.imagen}`} alt={producto.nombre} className="w-80 h-32 object-cover rounded-md shadow-sm" />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{producto.nombre}</div>
                            <div className="text-sm text-gray-500">{producto.descripcion}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              value={productUpdates[producto.id]?.stock ?? producto.stock}
                              onChange={(e) => handleInputChange(producto.id, 'stock', parseInt(e.target.value, 10))}
                              className="w-24 p-2 border border-gray-300 rounded-md"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={productUpdates[producto.id]?.estado ?? producto.estado}
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
          </div>
        )}
      </div>

      <div className="sticky bottom-0 bg-white p-4 border-t z-10 flex justify-end space-x-4">
        <button onClick={handleExportPDF} className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:bg-green-300" disabled={loading}>
          Exportar a PDF
        </button>
        <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </div>
  );
};

export default InicializarMenu;