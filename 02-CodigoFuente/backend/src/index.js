import app from './server.js';
import { initializeDB } from './database/db.js';

const main = async () => {
  await initializeDB();
  app.listen(app.get("port"), () => {
    console.log(`✅ Servidor corriendo en el puerto ${app.get("port")}`);
  });
};

main();