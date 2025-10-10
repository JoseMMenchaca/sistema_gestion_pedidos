// db.js
import { Sequelize } from "sequelize";
import mysql from 'mysql2/promise'; 
import dotenv from "dotenv";

dotenv.config();

const { DB_NAME, DB_USERNAME, DB_PASSWORD, HOST } = process.env;

// Función que crea la base de datos si no existe (Requiere mysql2/promise)
const ensureDatabaseExists = async () => {
    try {
        const connection = await mysql.createConnection({
            host: HOST,
            user: DB_USERNAME,
            password: DB_PASSWORD
        });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
        await connection.end();
        console.log(`✅ Base de datos '${DB_NAME}' verificada/creada.`);
    } catch (error) {
        console.error('❌ Error al verificar la base de datos:', error.message);
        process.exit(1); 
    }
};

export const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
    host: HOST,
    dialect: "mysql",
    logging: true,
});

// Función de inicialización que incluye la creación de la DB
export const initializeDB = async () => {
    try {
        await ensureDatabaseExists(); // <--- ESTO DEBE EJECUTARSE PRIMERO
        await sequelize.authenticate();
        await sequelize.sync({ alter: true });
        console.log("🚀 Conexión establecida y Tablas sincronizadas.");
    } catch (error) {
        // Este catch es el que generó tu error actual, porque la DB aún no existía
        console.error("Error al sincronizar las tablas:", error.message);
    }
};
// import Sequelize from "sequelize";
// import dotenv from "dotenv";

// dotenv.config();

// export const sequelize = new Sequelize(
//     process.env.DB_NAME,
//     process.env.DB_USERNAME,
//     process.env.DB_PASSWORD,
//     {
//         host: process.env.HOST,
//         dialect: "mysql",
//         logging: true,
//     }
// );