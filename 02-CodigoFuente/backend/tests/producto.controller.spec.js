import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { Producto } from '../src/models/Producto.js';
import { Categoria } from '../src/models/Categoria.js';
import {
  listarProductos,
  crearProducto,
  verProducto,
  editarProducto
} from '../src/controllers/producto.controller.js';

// Mock de request y response
const mockRequest = (body = {}, params = {}, file = null) => ({ body, params, file });
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Pruebas del Controlador de Productos', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('listarProductos', () => {
    it('Debería listar todos los productos con sus categorías', async () => {
      const productosMock = [
        { id: 1, nombre: 'Hamburguesa Whopper', categoria: { nombre: 'Hamburguesa' } },
        { id: 2, nombre: 'Pollo Loco Doble', categoria: { nombre: 'Pollo' } },
      ];

      jest.spyOn(Producto, 'findAll').mockResolvedValue(productosMock);

      const req = mockRequest();
      const res = mockResponse();

      await listarProductos(req, res);

      expect(res.json).toHaveBeenCalledWith(productosMock);
      expect(res.status).not.toHaveBeenCalledWith(500);
    });

    it('Debería manejar errores al listar productos', async () => {
      jest.spyOn(Producto, 'findAll').mockImplementationOnce(() => {
        throw new Error('Error al obtener productos');
      });

      const req = mockRequest();
      const res = mockResponse();

      await listarProductos(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error al obtener productos' });
    });
  });

  describe('crearProducto', () => {
  it('Debería crear un producto con datos válidos y categoría existente', async () => {
    const categoriaMock = { id: 1, nombre: 'Herramientas' };
    const productoMock = {
      id: 10,
      nombre: 'Hamburguesa Simple',
      descripcion: 'Hamburguesa con carne de res y queso',
      precio: 15.5,
      stock: 50,
      estado: true,
      categoria_id: 1,
      imagen: '/uploads/test.png',
    };

    // Simular que la categoría existe
    jest.spyOn(Categoria, 'findByPk').mockResolvedValue(categoriaMock);

    // Simular creación del producto
    jest.spyOn(Producto, 'create').mockResolvedValue(productoMock);

    // Simular req con file
    const req = {
      body: {
        nombre: 'Hamburguesa Simple',
        descripcion: 'Hamburguesa con carne de res y queso',
        precio: 15.5,
        stock: 50,
        estado: true,
        categoria_id: 1,
      },
      file: { filename: 'test.png' } // Aquí indicamos que se subió un archivo
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    await crearProducto(req, res);

    // Verificaciones
    expect(Categoria.findByPk).toHaveBeenCalledWith(1);
    expect(Producto.create).toHaveBeenCalledWith(expect.objectContaining({
      nombre: 'Hamburguesa Simple',
      imagen: '/uploads/test.png'
    }));
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(productoMock);
  });

  it('No debería crear si la categoría no existe', async () => {
    jest.spyOn(Categoria, 'findByPk').mockResolvedValue(null);

    const req = {
      body: { categoria_id: 99 },
      file: null
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    await crearProducto(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Categoría no encontrada' });
  });
  //PRUEBAS DEL MANEJO DE ERRORES AL CREAR PRODUCTO
  // it('Debería manejar errores al crear producto', async () => {
  //   jest.spyOn(Categoria, 'findByPk').mockResolvedValue({ id: 1 });

  //   jest.spyOn(Producto, 'create').mockImplementationOnce(() => {
  //     throw new Error('Error al crear producto');
  //   });

  //   const req = {
  //     body: {
  //       nombre: 'Destornillador',
  //       categoria_id: 1
  //     },
  //     file: null
  //   };
  //   const res = {
  //     status: jest.fn().mockReturnThis(),
  //     json: jest.fn().mockReturnThis(),
  //   };

  //   await crearProducto(req, res);

  //   expect(res.status).toHaveBeenCalledWith(500);
  //   expect(res.json).toHaveBeenCalledWith({ message: 'Error al crear producto' });
  // });
});


  describe('verProducto', () => {
    it('Debería retornar un producto por ID', async () => {
      const productoMock = { id: 1, nombre: 'Llave Inglesa' };
      jest.spyOn(Producto, 'findOne').mockResolvedValue(productoMock);

      const req = mockRequest({}, { id: 1 });
      const res = mockResponse();

      await verProducto(req, res);

      expect(Producto.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(productoMock);
    });

    it('Debería manejar errores al buscar producto', async () => {
      jest.spyOn(Producto, 'findOne').mockImplementationOnce(() => {
        throw new Error('Error de DB al buscar');
      });

      const req = mockRequest({}, { id: 1 });
      const res = mockResponse();

      await verProducto(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error de DB al buscar' });
    });
  });

  describe('editarProducto', () => {
    it('Debería actualizar un producto existente', async () => {
      const productoExistente = {
        id: 1,
        nombre: 'Tornillo',
        save: jest.fn().mockResolvedValue(true),
      };
      jest.spyOn(Producto, 'findByPk').mockResolvedValue(productoExistente);

      const req = mockRequest(
        { nombre: 'Tornillo actualizado', categoria_id: 1 },
        { id: 1 },
        null
      );
      const res = mockResponse();

      await editarProducto(req, res);

      expect(productoExistente.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(productoExistente);
    });

    it('Debería manejar error si el producto no existe', async () => {
      jest.spyOn(Producto, 'findByPk').mockResolvedValue(null);

      const req = mockRequest({}, { id: 999 });
      const res = mockResponse();

      await editarProducto(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Producto no encontrado' });
    });

    it('Debería manejar errores del servidor al actualizar', async () => {
      jest.spyOn(Producto, 'findByPk').mockImplementationOnce(() => {
        throw new Error('Error al actualizar producto');
      });

      const req = mockRequest({}, { id: 1 });
      const res = mockResponse();

      await editarProducto(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error al actualizar producto' });
    });
  });
});
