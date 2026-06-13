// IMPORTAMOS MYSQL2 QUE PERMITE HACER CONSULTAS, Y DOTENV PARA LEER EL ARCHIVO SECRETARIO .ENV
const mysql = require("mysql2");
require("dotenv").config();

// CREAMOS UN "POOL" DE CONEXIONES
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10, // MÁXIMO 10 PETICIONES AL MISMO TIEMPO
  queueLimit: 0,
  timezone: "Z",
});

// CONVERTIMOS EL POOL PARA QUE SOPORTE ASYNC/AWAIT
const promisePool = pool.promise();

console.log("CONFIGURACIÓN DE BASE DE DATOS INICIALIZADA");

module.exports = promisePool;
