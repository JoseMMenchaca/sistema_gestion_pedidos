import { jest, describe, beforeEach, afterEach, it, expect } from '@jest/globals';
import { Cliente } from '../src/models/Cliente.js';
import { Pedido } from '../src/models/Pedido.js';
import {
  listarClientes,
  crearCliente,
  verCliente,
  actualizarCliente,
  verClientePedidos
} from '../src/controllers/cliente.controller.js';

// Mock de request y response para las pruebas
const mockRequest = (body = {}, params = {}, query = {}) => ({ body, params, query });

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Pruebas del Controlador de Clientes', () => {
  beforeEach(() => {
    // Limpiar todos los mocks antes de cada prueba
    jest.restoreAllMocks();
  });

  describe('listarClientes', () => {
    it('Debería obtener una lista de clientes existentes', async () => {
      const clientesMock = [
        { id: 1, nombre: 'Cliente 1' },
        { id: 2, nombre: 'Cliente 2' },
      ];
      jest.spyOn(Cliente, 'findAll').mockResolvedValue(clientesMock);

      const req = mockRequest();
      const res = mockResponse();

      await listarClientes(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(clientesMock);
    });

    it('Debería obtener una lista vacía de clientes si no hay ninguno', async () => {
      jest.spyOn(Cliente, 'findAll').mockResolvedValue([]);

      const req = mockRequest();
      const res = mockResponse();

      await listarClientes(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });

    it('Debería manejar errores del servidor al obtener clientes', async () => {
      jest.spyOn(Cliente, 'findAll').mockImplementationOnce(() => {
        throw new Error('Error de base de datos simulado');
      });

      const req = mockRequest();
      const res = mockResponse();

      await listarClientes(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error de base de datos simulado' });
    });
  });

  describe('crearCliente', () => {
    it('Debería crear un nuevo cliente con datos válidos', async () => {
      const nuevoClienteData = {
        nombre: 'Nuevo Cliente',
        direccion: 'Calle Falsa 123',
        celular: 12345678,
        email: 'nuevo@cliente.com',
        estado: true
      };
      const clienteCreadoMock = { id: 3, ...nuevoClienteData };
      jest.spyOn(Cliente, 'create').mockResolvedValue(clienteCreadoMock);

      const req = mockRequest(nuevoClienteData);
      const res = mockResponse();

      await crearCliente(req, res);

      expect(Cliente.create).toHaveBeenCalledWith(nuevoClienteData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        ok: true,
        status: 201,
        message: 'Cliente Regitrado',
      });
    });

    it('No debería crear un cliente si faltan campos obligatorios', async () => {
      const datosIncompletos = { nombre: 'Cliente Incompleto' };
      const errorMock = new Error('notNull Violation: clientes.direccion cannot be null');
      jest.spyOn(Cliente, 'create').mockRejectedValue(errorMock);

      const req = mockRequest(datosIncompletos);
      const res = mockResponse();

      await crearCliente(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: expect.any(String) });
    });

    it('Debería manejar errores del servidor al crear cliente', async () => {
      jest.spyOn(Cliente, 'create').mockImplementationOnce(() => {
        throw new Error('Error de base de datos simulado al crear');
      });

      const req = mockRequest({});
      const res = mockResponse();

      await crearCliente(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error de base de datos simulado al crear' });
    });
  });

  describe('verCliente', () => {
    it('Debería obtener un cliente específico por ID', async () => {
      const clienteMock = { id: 1, nombre: 'Cliente Encontrado' };
      jest.spyOn(Cliente, 'findOne').mockResolvedValue(clienteMock);

      const req = mockRequest({}, { id: 1 });
      const res = mockResponse();

      await verCliente(req, res);

      expect(Cliente.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(clienteMock);
    });

    it('Debería retornar null si el cliente no se encuentra', async () => {
      jest.spyOn(Cliente, 'findOne').mockResolvedValue(null);

      const req = mockRequest({}, { id: 999 });
      const res = mockResponse();

      await verCliente(req, res);

      expect(Cliente.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(null);
    });

    it('Debería manejar errores del servidor al obtener un cliente', async () => {
      jest.spyOn(Cliente, 'findOne').mockImplementationOnce(() => {
        throw new Error('Error de base de datos simulado al buscar');
      });

      const req = mockRequest({}, { id: 1 });
      const res = mockResponse();

      await verCliente(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error de base de datos simulado al buscar' });
    });
  });

  describe('actualizarCliente', () => {
    it('Debería actualizar un cliente existente', async () => {
      const clienteExistente = {
        id: 1,
        nombre: 'Cliente Original',
        direccion: 'Dir Original',
        set: jest.fn(),
        save: jest.fn().mockResolvedValue(true)
      };
      const datosActualizados = {
        nombre: 'Cliente Actualizado',
        direccion: 'Nueva Direccion'
      };

      jest.spyOn(Cliente, 'findOne').mockResolvedValue(clienteExistente);

      const req = mockRequest(datosActualizados, { id: 1 });
      const res = mockResponse();

      await actualizarCliente(req, res);

      expect(Cliente.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(clienteExistente.set).toHaveBeenCalledWith(datosActualizados);
      expect(clienteExistente.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Registro Actualizado',
        ok: true,
        status: 200,
        body: clienteExistente,
      });
    });

    it('Debería manejar errores si el cliente no se encuentra para actualizar', async () => {
      jest.spyOn(Cliente, 'findOne').mockResolvedValue(null);

      const req = mockRequest({ nombre: 'No Existe' }, { id: 999 });
      const res = mockResponse();

      await actualizarCliente(req, res);

      expect(Cliente.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: expect.any(String) });
    });

    it('Debería manejar errores del servidor al actualizar un cliente', async () => {
      jest.spyOn(Cliente, 'findOne').mockImplementationOnce(() => {
        const mockCliente = {
          set: jest.fn(),
          save: jest.fn().mockRejectedValue(new Error('Error al guardar en DB')),
        };
        return mockCliente;
      });

      const req = mockRequest({ nombre: 'Falla al guardar' }, { id: 1 });
      const res = mockResponse();

      await actualizarCliente(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error al guardar en DB' });
    });
  });

  describe('verClientePedidos', () => {
    it('Debería obtener los pedidos de un cliente específico', async () => {
      const pedidosMock = [{ id: 1, monto: 100 }, { id: 2, monto: 200 }];
      jest.spyOn(Pedido, 'findAll').mockResolvedValue(pedidosMock);
      jest.spyOn(Cliente, 'findOne').mockResolvedValue({ id: 1, nombre: 'Cliente con compras' });

      const req = mockRequest({}, { id: 1 });
      const res = mockResponse();

      await verClientePedidos(req, res);

      expect(Pedido.findAll).toHaveBeenCalledWith({ where: { cliente_id: 1 } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(pedidosMock);
    });

    it('Debería obtener una lista vacía de pedidos si el cliente no tiene compras', async () => {
      jest.spyOn(Pedido, 'findAll').mockResolvedValue([]);
      jest.spyOn(Cliente, 'findOne').mockResolvedValue({ id: 1, nombre: 'Cliente sin compras' });

      const req = mockRequest({}, { id: 1 });
      const res = mockResponse();

      await verClientePedidos(req, res);

      expect(Pedido.findAll).toHaveBeenCalledWith({ where: { cliente_id: 1 } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });

    it('Debería manejar errores del servidor al obtener pedidos del cliente', async () => {
      jest.spyOn(Pedido, 'findAll').mockImplementationOnce(() => {
        throw new Error('Error de base de datos simulado al buscar pedidos');
      });
      jest.spyOn(Cliente, 'findOne').mockResolvedValue({ id: 1, nombre: 'Cliente con error' });

      const req = mockRequest({}, { id: 1 });
      const res = mockResponse();

      await verClientePedidos(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error de base de datos simulado al buscar pedidos' });
    });
  });
});
