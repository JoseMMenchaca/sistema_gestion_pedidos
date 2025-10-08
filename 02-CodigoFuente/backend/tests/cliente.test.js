import request from 'supertest';
import app from '../src/server.js'; 
import { sequelize } from '../src/database/db.js';

describe('\nPruebas para los endpoints de CLIENTE\n---------------------------------------', () => {

    // 1. Configuración: Sincroniza la DB y limpia las tablas antes de todas las pruebas
    beforeAll(async () => {
        await sequelize.sync({ force: true }); 
    });

    let clienteId; // Para almacenar el ID del cliente creado

    // Datos que usaremos para crear el cliente de prueba
    const datosCliente = {
        nombre: 'Arnol Quiza (TEST)',
        direccion: 'Av. Sistemas N° 101',
        celular: '70012345',
        email: 'arnol.test@ejemplo.com',
        estado: '1'
    };

    // --- PRUEBA POST (CREATE) ---
    test('debería crear un nuevo Cliente y devolver 201 \t\t- POST /api/clientes', async () => {
        const response = await request(app)
            .post('/api/clientes')
            .send(datosCliente);

        expect(response.statusCode).toBe(201);
        expect(response.body.ok).toBe(true);
        expect(response.body.message).toBe("Cliente Regitrado");

        // Guardamos el ID del cliente creado directamente desde la respuesta
        clienteId = response.body.id;

        // Verificamos que el cliente realmente se haya creado
        const createdClientResponse = await request(app).get('/api/clientes');
        expect(createdClientResponse.body[0].nombre).toBe(datosCliente.nombre);
    });

    // --- PRUEBA GET (READ ALL) ---
    test('debería obtener una lista de Clientes y devolver 200 \t- GET /api/clientes', async () => {
        const response = await request(app).get('/api/clientes');

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(1); // Debe haber el cliente creado
        expect(response.body[0].celular).toBe(datosCliente.celular);
    });

    // --- PRUEBA GET (READ ONE) ---
    test('debería obtener un Cliente por ID y devolver 200 \t\t- GET /api/clientes/:id', async () => {
        const response = await request(app).get(`/api/clientes/${clienteId}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).not.toBeNull(); 
        expect(response.body.id).toBe(clienteId);
        expect(response.body.email).toBe(datosCliente.email);
    });

    // --- PRUEBA PUT (UPDATE) ---
    test('debería actualizar un Cliente por ID y devolver 200 \t- PUT /api/clientes/:id', async () => {
        const datosActualizados = {
            nombre: 'Arnol Quiza (ACTUALIZADO)',
            celular: '69987654',
            estado: false
        };

        const response = await request(app)
            .put(`/api/clientes/${clienteId}`)
            .send(datosActualizados);

        expect(response.statusCode).toBe(200);
        expect(response.body.ok).toBe(true);
        expect(response.body.message).toBe("Registro Actualizado");
        expect(response.body.body.nombre).toBe(datosActualizados.nombre);
        expect(response.body.body.celular).toBe(datosActualizados.celular);
        expect(response.body.body.estado).toBe(datosActualizados.estado);
    });

    // --- PRUEBA GET PEDIDOS DEL CLIENTE ---
    test('debería obtener los pedidos de un cliente (sin pedidos aún) - GET /api/clientes/:id/pedidos', async () => {
        const response = await request(app).get(`/api/clientes/${clienteId}/pedidos`);

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(0); // No hay pedidos asociados aún
    });

    // 2. Limpieza: Cierra la conexión a la base de datos
    afterAll(async () => {
        await sequelize.close();
    });
});
