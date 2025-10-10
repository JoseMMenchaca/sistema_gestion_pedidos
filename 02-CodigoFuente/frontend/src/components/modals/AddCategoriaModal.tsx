import React, { useState } from "react";
import axios from "axios";

interface AddCategoriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  fetchCategorias: () => void; // Función para recargar categoria después de agregar uno nuevo
}

const API_URL = "/api/categoria"; // URL de la API en tu backend

const AddCategoriaModal: React.FC<AddCategoriaModalProps> = ({
  isOpen,
  onClose,
  fetchCategorias,
}) => {
  const [nuevoCategoria, setNuevoCategoria] = useState({
    nombre: "",
    descripcion: "",
  });
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNuevoCategoria((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      // Enviar datos al backend
      await axios.post(API_URL, nuevoCategoria);
      fetchCategorias(); // Actualizar lista de categorias después de agregar uno nuevo
      onClose(); // Cerrar el modal
    } catch (error) {
      console.error("Error al agregar categoria:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h3 className="text-xl mb-4">Agregar Nueva Categoria</h3>
        <div className="mb-2">
        {/* Agregar más campos según sea necesario */}
          <label htmlFor="nombre" className="block">Nombre</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            // value={nuevoProveedor.nombre}
            onChange={handleChange}
            className="border border-gray-300 p-2 w-full"
          />
          <label htmlFor="descripcion" className="block">Descripcion</label>
          <input
            type="text"
            id="descripcion"
            name="descripcion"
            // value={nuevoProveedor.nombre}
            onChange={handleChange}
            className="border border-gray-300 p-2 w-full"
          />
        </div>
        {/* Agregar más campos según sea necesario */}
        <div className="mt-4 flex justify-between">
          <button
            className="bg-blue-500 text-white px-4 py-2"
            onClick={handleSubmit}
          >
            Guardar
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCategoriaModal;
