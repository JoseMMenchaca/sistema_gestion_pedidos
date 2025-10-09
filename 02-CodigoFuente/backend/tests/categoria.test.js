import request from 'supertest';
import app from '../src/server.js'; 
import { sequelize } from '../src/database/db.js'; 

describe('\nPruebas para los endpoints de Categoria\n---------------------------------------', () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    let categoriaId;
    const datosCategoria = {
        nombre: 'HAMBURGUESAS',
        descripcion: 'HAMBURGUESAS DE CARNE, POLLO, ETC.',
    };

    test('debería crear una categoria \t\t\t\t- POST /api/categoria', async () => {
        const response = await request(app).post('/api/categoria').send(datosCategoria);
        expect(response.statusCode).toBe(201);
        expect(response.body.nombre).toBe(datosCategoria.nombre);
        expect(response.body.descripcion).toBe(datosCategoria.descripcion);
        categoriaId = response.body.id;
    });

    test('debería obtener todos las Categorias \t\t\t- GET /api/categoria', async () => {
        const response = await request(app).get('/api/categoria');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(1);
    });

    test('debería obtener una Categoria por ID \t\t\t- GET /api/categoria/:id', async () => {
        const response = await request(app).get(`/api/categoria/${categoriaId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.nombre).toBe(datosCategoria.nombre);
    });

    test('debería actualizar datos de una Categoria \t\t\t- PUT /api/categoria/:id', async () => {
        const datosActualizados = datosCategoria;           // Mantenemos datos antes de la actualización x Campos obligatorios
            datosActualizados.nombre = 'POLLOS';
            datosActualizados.descripcion = 'POLLOS A LA BRASA, POLLOS FRITOS, ETC.'; 
        const response = await request(app).put(`/api/categoria/${categoriaId}`).send(datosActualizados);
        expect(response.statusCode).toBe(201);
        expect(response.body.nombre).toBe(datosActualizados.nombre);
        expect(response.body.descripcion).toBe(datosActualizados.descripcion);
    });

    afterAll(async () => {
        await sequelize.close();
    });
});
