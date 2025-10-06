import { Sequelize } from "sequelize";
import mysql from 'mysql2/promise';
import dotenv from "dotenv";

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' });
} else if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: '.env.development' });
} else {
  dotenv.config({ path: '.env' });
}

const { DB_NAME, DB_USERNAME, DB_PASSWORD, HOST } = process.env;

const ensureDatabaseExists = async () => {
  try {
    const connection = await mysql.createConnection({
      host: HOST,
      user: DB_USERNAME,
      password: DB_PASSWORD
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    await connection.end();
    console.log(`Base de datos '${DB_NAME}' verificada/creada.`);
  } catch (error) {
    console.error('Error al crear la base de datos:', error);
    process.exit(1);
  }
};

export const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: HOST,
  dialect: "mysql",
  logging: process.env.NODE_ENV !== 'test',
  dialectOptions: { connectTimeout: 100000 }
});

export const initializeDB = async () => {
  try {
    await ensureDatabaseExists();
    await sequelize.authenticate();
    await sequelize.sync({ alter: true }); // crea/actualiza tablas
    console.log("Tablas sincronizadas");
  } catch (error) {
    console.error("Error al sincronizar las tablas:", error);
  }
};
