//IMPORTAMOS LA CONFIGURACIÓN QUE ACABAMOS DE HACER EN APP.JS
const app = require("./app");
// IMPORTAMOS BASE DE DATOS
const db = require("./config/db");

// 2. DEFINIMOS EL PUERTO EN EL QUE CORRERÁ EL SERVIDOR
const PORT = process.env.APP_PORT || process.env.PORT || 3000;
const RETRY_DELAY_MS = 3000;

// FUNCIÓN PARA VERIFICAR SI LA BASE DE DATOS RESPONDE
async function startServer() {
  try {
    // HACE UNA CONSULTA SIMPLE DE PRUEBA (1 + 1)
    await db.query("SELECT 1 + 1 AS resultado");
    console.log("¡CONEXIÓN EXITOSA A MYSQL EN DOCKER!");

    app.listen(PORT, () => {
      console.log(`SERVIDOR CORRIENDO EN EL PUERTO http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(
      `ERROR AL CONECTAR LA BASE DE DATOS. REINTENTANDO EN ${
        RETRY_DELAY_MS / 1000
      }s:`,
      error.message
    );
    setTimeout(startServer, RETRY_DELAY_MS);
  }
}

startServer();
