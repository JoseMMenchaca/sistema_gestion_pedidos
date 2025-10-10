import React, { useState, useEffect } from "react";
import axios from "axios";

interface Categoria {
  id: number;
  nombre: string;
}


interface AddProductoModalProps {
  isOpen: boolean;
  onClose: () => void;
  fetchProductos: () => void;
}

const AddProductoModal: React.FC<AddProductoModalProps> = ({
  isOpen,
  onClose,
  fetchProductos,
}) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [estado, setEstado] = useState<boolean>(true);
  const [stock, setStock] = useState("0");
  const [imagen, setImagen] = useState<File | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaId, setCategoriaId] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      axios
        .get<Categoria[]>("/api/categoria")
        .then((response) => setCategorias(response.data))
        .catch((error) => console.error("Error al obtener categorías:", error));
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setCategoriaId(null); // Restablece la selección
    }
  }, [isOpen]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("descripcion", descripcion);
    formData.append("precio", precio);  
    formData.append("estado", String(estado)); 
    formData.append("stock", stock);
    if (imagen) formData.append("imagen", imagen);
    if (categoriaId) formData.append("categoria_id", categoriaId.toString());
    try {
      await axios.post("/api/productos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchProductos(); // Refrescar la lista de productos
      onClose(); // Cerrar el modal
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  };

  return isOpen ? (
    <div className="inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Agregar Producto</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Nombre:</label>
            <input
              type="text"
              //value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Descripción:</label>
            <textarea
              //value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Precio:</label>
            <input
              type="number"
              //value={nombre}
              onChange={(e) => setPrecio(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="estado-checkbox">
                    Estado del Producto:
                </label>
                <div className="flex items-center">
                    <input
                        id="estado-checkbox"
                        type="checkbox"
                        checked={estado} 
                        onChange={(e) => setEstado(e.target.checked)} 
                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" 
                    />
                    <span className={`ml-2 font-medium ${estado ? 'text-green-600' : 'text-red-600'}`}>
                        {estado ? "Activo" : "Inactivo"}
                    </span>
                </div>
            </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Stock:</label>
            <input
              disabled
              value={stock}              
              type="number"
              onChange={(e) => setStock(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Categoría:</label>
            <select
              value={categoriaId || ""}
              onChange={(e) => setCategoriaId(Number(e.target.value))}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            >
              <option value="" disabled>
                Seleccione una categoría
              </option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Imagen:</label>
            <input
              type="file"
              onChange={(e) => setImagen(e.target.files ? e.target.files[0] : null)}
              className="w-full"
              accept="image/*"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Agregar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
};

export default AddProductoModal;
