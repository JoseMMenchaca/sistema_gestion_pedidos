import React, { useState, useEffect } from "react";
import axios from "axios";

interface EditProductoModalProps {
  isOpen: boolean;
  onClose: () => void;
  fetchProductos: () => void;
  productoEditando: any; // Producto a editar
}

const EditProductoModal: React.FC<EditProductoModalProps> = ({
  isOpen,
  onClose,
  fetchProductos,
  productoEditando,
}) => {
  const [producto, setProducto] = useState({
    id: 0,
    nombre: "",
    descripcion: "",
    precio: "",
    estado: "",
    stock: "",
    imagen: "",
    categoria_id: "",
  });
  const [imagen, setImagen] = useState<File | null>(null);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [estado, setEstado] = useState<boolean>(true);
  // Cargar las categorías al montar el componente
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get("/api/categoria"); // Asegúrate de que esta ruta sea correcta
        setCategorias(response.data); // Guardar las categorías en el estado
      } catch (error) {
        console.error("Error al cargar las categorías:", error);
      }
    };

    fetchCategorias();
  }, []); // Se ejecuta solo una vez al montar el componente

  // Si el producto que estamos editando cambia, actualizar el estado
  useEffect(() => {
    if (productoEditando) {
      setProducto({
        ...productoEditando,
        //categoria_id: productoEditando.categoria_id || "", // Asegúrate de que categoria_id no sea undefined
        categoria_id: productoEditando.categoria?.id?.toString() ||
          productoEditando.categoria_id?.toString() || "",
      });
      setEstado(productoEditando.estado);
    }
  }, [productoEditando]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProducto((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImagen(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Producto a actualizar:", producto);

    if (!producto.categoria_id) {
      alert("Debe seleccionar una categoría.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("nombre", producto.nombre);
      formData.append("descripcion", producto.descripcion);
      formData.append("precio", producto.precio);
      formData.append("estado", String(estado));
      formData.append("stock", producto.stock);
      formData.append("categoria_id", producto.categoria_id.toString()); // Asegúrate de que categoria_id no sea undefined
      if (imagen) {
        formData.append("imagen", imagen);
      }

      const response = await axios.put(
        `/api/productos/${producto.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Producto actualizado con éxito:", response.data);
      fetchProductos();
      onClose();
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 overflow-y-auto p-4">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl max-h-full overflow-y-auto">
        <h3 className="text-2xl font-bold mb-4">Editar Producto</h3>
        <form onSubmit={handleSubmit}>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4 md:mb-0">
              <label htmlFor="nombre" className="block">Nombre</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={producto.nombre}
                onChange={handleChange}
                className="border border-gray-300 p-2 w-full"
              />
            </div>
            <div className="mb-4 md:mb-0">
              <label htmlFor="precio" className="block">Precio</label>
              <input
                type="number"
                id="precio"
                name="precio"
                value={producto.precio}
                onChange={handleChange}
                className="border border-gray-300 p-2 w-full"
              />
            </div>
            <div className="mb-4 md:mb-0">
              <label htmlFor="descripcion" className="block">Descripción</label>
              <input
                id="descripcion"
                name="descripcion"
                value={producto.descripcion}
                onChange={handleChange}
                className="border border-gray-300 p-2 w-full"
              />
            </div>
            <div className="mb-4 md:mb-0">
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
            <div className="mb-4 md:mb-0">
              <label htmlFor="stock" className="block">Stock</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={producto.stock}
                onChange={handleChange}
                className="border border-gray-300 p-2 w-full"
              />
            </div>

            {/* Selección de categoría */}
            <div className="mb-4 md:mb-0">
              <label htmlFor="categoria_id" className="block">Categoría</label>
              <select
                id="categoria_id"
                name="categoria_id"
                value={producto.categoria_id}
                onChange={handleChange}
                className="border border-gray-300 p-2 w-full"
              >
                <option value="">Seleccione una categoría</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4 md:mb-0">
              <label htmlFor="file-upload-edit" className="block text-gray-700 mb-2">
                Imagen:
              </label>

              {/* 🔑 INICIO DEL BOTÓN DE IMAGEN ESTILIZADO */}
              <div className="flex items-center space-x-3">

                {/* 1. Input Oculto (Mecanismo real de selección) */}
                <input
                  id="file-upload-edit" // Usamos un ID diferente para evitar conflictos
                  type="file"
                  name="imagen"
                  onChange={handleImageChange}
                  className="hidden" // Ocultamos el input feo del navegador
                  accept="image/*"
                />

                {/* 2. Botón Visible (La etiqueta estilizada que el usuario ve) */}
                <label
                  htmlFor="file-upload-edit"
                  className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition duration-150 whitespace-nowrap"
                >
                  {/* Lógica: Si se seleccionó una imagen nueva (imagen) o ya existe una (producto.imagen) */}
                  {(imagen || productoEditando?.imagen) ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
                </label>

                {/* 3. Indicador de Archivo Seleccionado */}
                <span className="text-gray-600 truncate flex-1">
                  {/* Muestra el nombre del archivo NEW si existe, sino, muestra el nombre del archivo VIEJO, sino, un mensaje por defecto. */}
                  {imagen ? (
                    <span className="font-semibold text-sm">{imagen.name}</span>
                  ) : productoEditando?.imagen ? (
                    <span className="italic text-sm text-gray-800"></span>
                  ) : (
                    <span className="italic text-sm">Ningún archivo seleccionado</span>
                  )}
                </span>
              </div>
              {/* 🔑 FIN DEL BOTÓN DE IMAGEN ESTILIZADO */}

              {/* 4. Muestra la imagen actual del producto si no se ha seleccionado una nueva */}
              {productoEditando?.imagen && !imagen && (
                <img
                  src={`http://localhost:3000${productoEditando.imagen}`}
                  alt="Imagen actual del producto"
                  className="mt-2 w-32 h-32 object-cover border border-gray-300 rounded"
                />
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Guardar Cambios
            </button>
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductoModal;
