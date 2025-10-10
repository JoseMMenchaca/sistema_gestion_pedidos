import React, { useState, useEffect } from "react";
import axios from "axios";
import EditCategoriaModal from "./modals/EditCategoriaModal.tsx"; // Modal de edición
import AddCategoriaModal from "./modals/AddCategoriaModal.tsx"; // Modal de agregar

interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
}

const API_URL = "api/categoria"; // URL de la API para gestionar categorias

const Categorias: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [modalOpen, setModalOpen] = useState(false); // Estado para el modal de agregar
  const [editModalOpen, setEditModalOpen] = useState(false); // Estado para el modal de editar
  const [categoriaEditando, setCategoriaEditando] = useState<Categoria | null>(null);

  // Función para abrir el modal de agregar categoria
  const openModalAgregar = () => {
    setModalOpen(true);
  };

  // Función para cerrar el modal de agregar categoria
  const closeModalAgregar = () => {
    setModalOpen(false);
  };

  // Función para abrir el modal de editar proveedor
  const openModalEditar = (categoria: Categoria) => {
    setCategoriaEditando(categoria);
    setEditModalOpen(true);
  };

  // Función para cerrar el modal de editar categoria
  const closeModalEditar = () => {
    setEditModalOpen(false);
    setCategoriaEditando(null);
  };

  const fetchCategorias = async () => {
    try {
      const response = await axios.get<Categoria[]>(API_URL);
      setCategorias(response.data);
    } catch (error) {
      console.error("Error al obtener categorias:", error);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  return (
    <div>
      <h1 className="text-2xl tracking-[1.08px] text-gray-800 mb-4 ml-4">
        Gestión de Categorias
      </h1>

      {/* Modal para agregar proveedor */}
      <AddCategoriaModal
        isOpen={modalOpen}
        onClose={closeModalAgregar}
        fetchCategorias={fetchCategorias}
      />

      {/* Modal para editar proveedor */}
      <EditCategoriaModal
        isOpen={editModalOpen}
        onClose={closeModalEditar}
        fetchCategorias={fetchCategorias}
        categoriaEditando={categoriaEditando}
      />

      <button
        className="bg-green-500 text-white px-4 py-2 mb-4 ml-4"
        onClick={openModalAgregar}
      >
        Agregar Categoria
      </button>

      <h1 className="text-2xl text-center tracking-[1.08px] text-gray-800 mb-4">
        Lista de Categorias
      </h1>
      <div className="mx-4">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Nombre</th>
              <th className="border border-gray-300 px-4 py-2">Descripcion</th>
              <th className="border border-gray-300 px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">{categoria.id}</td>
                <td className="border border-gray-300 px-4 py-2">{categoria.nombre}</td>
                <td className="border border-gray-300 px-4 py-2">{categoria.descripcion}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="flex justify-center space-x-4">
                    <button
                      className="bg-yellow-500 text-white px-4 py-2"
                      onClick={() => openModalEditar(categoria)}> Editar </button> {/*Boton EDITAR producto*/}

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
      </div>
    </div>
  );
};

export default Categorias;
