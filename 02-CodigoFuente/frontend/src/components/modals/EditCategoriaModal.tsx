import React, { useState, useEffect } from "react";
import axios from "axios";

interface EditCategoriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  fetchCategorias: () => void;
  categoriaEditando: any; // Proveedor a editar
}

const EditCategoriaModal: React.FC<EditCategoriaModalProps> = ({
  isOpen,
  onClose,
  fetchCategorias,
  categoriaEditando,
}) => {
  const [categoria, setCategoria] = useState({
    id: 0,
    nombre: "",
    descripcion: "",
  });

  // Si la categoria que estamos editando cambia, actualizar el estado
  useEffect(() => {
    if (categoriaEditando) {
      setCategoria(categoriaEditando);
    }
  }, [categoriaEditando]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategoria((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      // Enviar la solicitud PUT para actualizar el proveedor
      await axios.put(`/api/categoria/${categoria.id}`, categoria);
      fetchCategorias(); // Actualizar la lista de proveedores
      onClose(); // Cerrar el modal
    } catch (error) {
      console.error("Error al actualizar la categoria:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h3 className="text-xl mb-4">Editar Categoria</h3>
        <div className="mb-2">
          <label htmlFor="nombre" className="block">Nombre</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={categoria.nombre}
            onChange={handleChange}
            className="border border-gray-300 p-2 w-full"
          />

          <label htmlFor="descripcion" className="block">Descripcion</label>
          <input
            type="text"
            id="descripcion"
            name="descripcion"
            value={categoria.descripcion}
            onChange={handleChange}
            className="border border-gray-300 p-2 w-full"
          />
        </div>

        <div className="mt-4 flex justify-between">
          <button
            className="bg-blue-500 text-white px-4 py-2"
            onClick={handleSubmit}
          >
            Guardar Cambios
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

export default EditCategoriaModal;
