import request from 'supertest';
import app from '../src/server.js';
import { sequelize } from '../src/database/db.js';
import { Categoria } from '../src/models/Categoria.js';

describe('\nPruebas para los endpoints de PRODUCTO\n---------------------------------------', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
    // Crear una categoría base para asignar productos
    await Categoria.create({
  nombre: 'Herramientas',
  descripcion: 'Categoría de herramientas manuales y eléctricas',
});

  });

  let productoId;

  const datosProducto = {
    nombre: 'Taladro Bosch (TEST)',
    descripcion: 'Taladro de 500W',
    precio: 300,
    stock: 10,
    estado: true,
    categoria_id: 1
  };

  test('debería crear un nuevo Producto - POST /api/productos', async () => {
    const response = await request(app)
      .post('/api/productos')
      .field('nombre', datosProducto.nombre)
      .field('descripcion', datosProducto.descripcion)
      .field('precio', datosProducto.precio)
      .field('stock', datosProducto.stock)
      .field('estado', datosProducto.estado)
      .field('categoria_id', datosProducto.categoria_id);

    expect(response.statusCode).toBe(201);
    expect(response.body.nombre).toBe(datosProducto.nombre);

    // Guardamos el ID para futuras pruebas
    productoId = response.body.id;
  });

  test('debería listar los productos - GET /api/productos', async () => {
    const response = await request(app).get('/api/productos');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
  });

  test('debería obtener un producto por ID - GET /api/productos/:id', async () => {
    const response = await request(app).get(`/api/productos/${productoId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).not.toBeNull();
    expect(response.body.id).toBe(productoId);
  });

test('debería actualizar un producto - PUT /api/productos/:id', async () => {
  const nuevosDatos = { 
    nombre: 'Taladro Bosch (ACTUALIZADO)', 
    descripcion: 'Taladro actualizado de 500W',
    precio: 350,
    stock: 15,
    estado: true,
    categoria_id: 1
  };

  const response = await request(app)
    .put(`/api/productos/${productoId}`)
    .send(nuevosDatos);

  expect(response.statusCode).toBe(200);
  expect(response.body.nombre).toBe(nuevosDatos.nombre);
  expect(response.body.stock).toBe(nuevosDatos.stock);
});



  afterAll(async () => {
    await sequelize.close();
  });
});
