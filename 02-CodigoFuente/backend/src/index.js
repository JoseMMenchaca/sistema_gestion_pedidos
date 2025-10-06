// src/index.js Creado para iniciar el servidor con Opcion de Pruebas JEST
// este archivo es el punto de entrada principal de la aplicación

import app from './server.js';
import { initializeDB } from './database/db.js';

const main = async () => {
  await initializeDB();
  app.listen(app.get("port"), () => {
    console.log(`✅ Servidor corriendo en el puerto ${app.get("port")}`);
  });
};

main();