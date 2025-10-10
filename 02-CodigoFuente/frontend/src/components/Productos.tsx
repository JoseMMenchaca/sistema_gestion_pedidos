import React, { useState, useEffect } from "react";
import axios from "axios";
import EditProductoModal from "./modals/EditProductoModal.tsx";
import AddProductoModal from "./modals/AddProductoModal.tsx";

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  stock: string;
  imagen: string;
  categoria: Categoria;

  precio: string;
  estado: boolean;
}

interface Categoria {
  id: number;
  nombre: string; // El nombre de la categoría
}

const API_URL = "/api/productos"; // URL de la API para gestionar productos

const Productos: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [modalOpen, setModalOpen] = useState(false); // Estado para el modal de agregar
  const [editModalOpen, setEditModalOpen] = useState(false); // Estado para el modal de editar
  const [productoEditando, setProductoEditando] = useState<Producto | null>(
    null
  );
  const [imagenExpandida, setImagenExpandida] = useState<string | null>(null); // Estado para controlar la imagen expandida

  // Función para abrir el modal de agregar proveedor
  const openModalAgregar = () => {
    setModalOpen(true);
  };

  // Función para cerrar el modal de agregar proveedor
  const closeModalAgregar = () => {
    setModalOpen(false);
  };

  // Función para abrir el modal de editar proveedor
  const openModalEditar = (producto: Producto) => {
    setProductoEditando(producto);
    setEditModalOpen(true);
  };

  // Función para cerrar el modal de editar proveedor
  const closeModalEditar = () => {
    setEditModalOpen(false);
    setProductoEditando(null);
  };

  const fetchProductos = async () => {
    try {
      const response = await axios.get<Producto[]>(API_URL);
      setProductos(response.data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleImagenClick = (imagen: string) => {
    setImagenExpandida(imagen); // Al hacer clic en la imagen, se expande
  };

  const handleCloseExpandida = () => {
    setImagenExpandida(null); // Cerrar la imagen expandida
  };

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Si se hace clic fuera de la imagen, cerrar el modal
    if (e.target === e.currentTarget) {
      handleCloseExpandida();
    }
  };

  return (
    <div>
      <h1 className="text-2xl tracking-[1.08px] text-gray-800 mb-4 ml-4">
        Gestión de Productos
      </h1>

      {/* Modal para agregar proveedor */}
      <AddProductoModal
        isOpen={modalOpen}
        onClose={closeModalAgregar}
        fetchProductos={fetchProductos}
      />

      {/* Modal para editar proveedor */}
      <EditProductoModal
        isOpen={editModalOpen}
        onClose={closeModalEditar}
        fetchProductos={fetchProductos}
        productoEditando={productoEditando}
      />

      <button
        className="bg-green-500 text-white px-4 py-2 mb-4 ml-4"
        onClick={openModalAgregar}
      >
        Agregar Producto
      </button>

      <h1 className="text-2xl text-center tracking-[1.08px] text-gray-800 mb-4">
        Lista de Productos
      </h1>
      <div className="mx-4">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Nombre</th>
              <th className="border border-gray-300 px-6 py-2">Descripcion</th>
              <th className="border border-gray-300 px-4 py-2">Precio</th>
              <th className="border border-gray-300 px-4 py-2">Estado</th>
              <th className="border border-gray-300 px-1 py-2">Stock</th>
              <th className="border border-gray-300 px-4 py-2">Categoria</th>
              <th className="border border-gray-300 px-4 py-2">Imagen</th>
              <th className="border border-gray-300 px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id} className="hover:bg-gray-100">
                <td className="border border-gray-300 py-2 text-center">
                  {producto.id}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {producto.nombre}
                </td>
                <td className="border border-gray-300 px-6 py-2">
                  {producto.descripcion}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {producto.precio}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center font-semibold">
                  {/* 🚨 CAMBIO APLICADO AQUÍ: Visualización del estado booleano */}
                  {producto.estado ? (
                    <span className="text-green-600">Activo</span>
                  ) : (
                    <span className="text-red-600">Inactivo</span>
                  )}
                </td>
                <td className="border border-gray-300 px-1 py-2">
                  {producto.stock}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {producto.categoria?.nombre}
                </td>
                <td className="flex justify-center border border-gray-300 px-4 py-2">
                  {producto.imagen ? (
                    <img
                      src={`http://localhost:3000${producto.imagen}`} // Asegúrate de que no haya doble slash
                      alt={producto.nombre}
                      className="w-16 h-16 object-cover"
                      onClick={() => handleImagenClick(producto.imagen)} // Al hacer clic en la imagen, se expande
                    />
                  ) : (
                    "Sin imagen"
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="flex justify-center space-x-4">
                    <button
                      className="bg-yellow-500 text-white px-4 py-2"
                      onClick={() => openModalEditar(producto)}
                    >
                      {" "}
                      Editar{" "}
                    </button>{" "}
                    {/*Boton EDITAR producto*/}
                    {/* <button
                      className="bg-red-500 text-white px-4 py-2"
                      onClick={() => alert(`Eliminar ${proveedor.id}`)} // Eliminar proveedor
                    >
                      Eliminar
                    </button> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Modal para imagen expandida */}
        {imagenExpandida && (
          <div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center"
            onClick={handleModalClick}
          >
            <div className="relative">
              <img
                src={`http://localhost:3000${imagenExpandida}`}
                alt="Imagen expandida"
                className="max-w-4xl max-h-4xl object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Productos;
