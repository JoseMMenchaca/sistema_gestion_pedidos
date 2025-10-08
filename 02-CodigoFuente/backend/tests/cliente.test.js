import request from 'supertest';
import app from '../src/server.js'; 
import { sequelize } from '../src/database/db.js';

describe('\nPruebas para los endpoints de CLIENTE\n---------------------------------------', () => {
    
    // 1. Configuración: Sincroniza la DB y limpia las tablas antes de todas las pruebas
    beforeAll(async () => {
        // Usamos force: true para asegurar un entorno de prueba limpio y sin datos residuales
        await sequelize.sync({ force: true }); 
    });

    let clienteId; // Para almacenar el ID del cliente creado
    
    // Los datos que usaremos para crear el cliente de prueba
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

        // 1. Verifica el estado de la respuesta
        expect(response.statusCode).toBe(201);
        
        // 2. Verifica el cuerpo de la respuesta (según tu controlador)
        expect(response.body.ok).toBe(true);
        expect(response.body.message).toBe("Cliente Regitrado");
        
        // NOTA: Para obtener el ID del cliente, necesitaríamos que el controlador 
        // lo devolviera. Asumiremos que tu controlador devuelve al menos el ID,
        // o si no, usaremos una prueba GET para encontrarlo más tarde.
        
        // Dado que el controlador NO devuelve el objeto creado, haremos una búsqueda 
        // para obtener el ID para las siguientes pruebas.
        const createdClientResponse = await request(app).get('/api/clientes');
        clienteId = createdClientResponse.body[0].id;

        expect(createdClientResponse.body[0].nombre).toBe(datosCliente.nombre);
    });

    // --- PRUEBA GET (READ ALL) ---
    test('debería obtener una lista de Clientes y devolver 200 \t- GET /api/clientes', async () => {
        const response = await request(app).get('/api/clientes');
        
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(1); // Debe haber el cliente que acabamos de crear
        expect(response.body[0].celular).toBe(datosCliente.celular);
    });

    // --- PRUEBA GET (READ ONE) ---
    test('debería obtener un Cliente por ID y devolver 200 \t\t- GET /api/clientes/:id', async () => {
        const response = await request(app).get(`/api/clientes/${clienteId}`);

        expect(response.statusCode).toBe(200);
        // Verifica que la respuesta no sea nula (encontró el cliente)
        expect(response.body).not.toBeNull(); 
        expect(response.body.id).toBe(clienteId);
        expect(response.body.email).toBe(datosCliente.email);
    });

    // --- PRUEBA PUT (UPDATE) ---
    test('debería actualizar un Cliente por ID y devolver 200 \t- PUT /api/clientes/:id', async () => {
        const datosActualizados = {
            nombre: 'Arnol Quiza (ACTUALIZADO)',
            celular: '69987654', // Nuevo celular
            estado: false       // Cambiamos el estado
        };
        
        const response = await request(app)
            .put(`/api/clientes/${clienteId}`)
            .send(datosActualizados);

        // 1. Verifica el estado de la respuesta
        expect(response.statusCode).toBe(200);
        
        // 2. Verifica el mensaje de éxito
        expect(response.body.ok).toBe(true);
        expect(response.body.message).toBe("Registro Actualizado");
        
        // 3. Verifica los datos actualizados
        expect(response.body.body.nombre).toBe(datosActualizados.nombre);
        expect(response.body.body.celular).toBe(datosActualizados.celular);
        expect(response.body.body.estado).toBe(datosActualizados.estado); // Verifica el estado boolean
    });
    
    // 2. Limpieza: Cierra la conexión a la base de datos
    afterAll(async () => {
        await sequelize.close();
    });
});