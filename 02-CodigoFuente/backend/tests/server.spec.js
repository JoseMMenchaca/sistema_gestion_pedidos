import request from 'supertest';
import app from '../src/server.js'; // Importamos la app, no 'server'
import { sequelize } from "../src/database/db.js";
          
describe('\n+--------------------------------------+\n| GET / - Prueba de Humo del Servidor  |\n+--------------------------------------+', () => {

  // Antes de todas las pruebas, nos aseguramos de que la DB de test esté conectada
  beforeAll(async () => {
    await sequelize.authenticate();

    await sequelize.sync({ force: true }); // Esto recrea las tablas en la base de datos de prueba
  });

  // Después de todas las pruebas, cerramos la conexión a la DB para que Jest pueda salir limpiamente
  afterAll(async () => {
    await sequelize.close();
  });

  it('---> Debería responder con un estado 200 y un mensaje JSON', async () => {
    const response = await request(app).get('/'); // Usamos la 'app' importada
    expect(response.statusCode).toBe(200);
    expect(response.type).toBe('application/json');
    expect(response.body).toEqual("Servidor Comida FastExpress");
  });
});