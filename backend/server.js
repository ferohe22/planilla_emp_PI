const path = require('path');
const dotenv = require('dotenv');

console.log('Iniciando servidor...');

// Configurar dotenv para buscar el archivo .env en el directorio raíz del proyecto
const result = dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

if (result.error) {
  console.error('Error al cargar el archivo .env:', result.error);
} else {
  console.log('Archivo .env cargado correctamente');
}

console.log('Ruta del archivo .env:', path.resolve(__dirname, '..', '.env'));

const express = require('express');
const rutasEmpleados = require('./routes/employeeRoutes');
const rutasBasicos = require('./routes/BasicoRoutes');
const rutasFondos = require('./routes/FondosRoutes');
const rutasTiposPlanilla = require('./routes/tiposPlanillaRoutes');
const rutasPlanillaMensual = require('./routes/planillaMensualRoutes');
const middlewareError = require('./middlewares/errorMiddleware');
const app = express();
const cors = require('cors');
const PUERTO = process.env.PORT || 5001;

console.log('Configurando middleware...');
app.use(express.json());

// Configuración de CORS ajustada para ser más flexible en producción
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? '*' : 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Middleware de logging para rastrear solicitudes
app.use((req, res, next) => {
  console.log(`Solicitud recibida: ${req.method} ${req.url}`);
  next();
});

// Rutas de API
console.log('Registrando rutas de API...');
app.use('/api/empleados', rutasEmpleados);
app.use('/api/Basicos', rutasBasicos);
app.use('/api/fondos-pension', rutasFondos);
app.use('/api/tipos-planilla', rutasTiposPlanilla);
app.use('/api/planilla-mensual', rutasPlanillaMensual);
console.log('Rutas de API registradas');

// Servir archivos estáticos del frontend en producción
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

  // Ruta para manejar todas las demás solicitudes y servir index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
  });
}

// Middleware de manejo de errores
app.use(middlewareError);

const server = app.listen(PUERTO, () => {
  console.log(`El servidor está corriendo en el puerto ${PUERTO}`);
  console.log(`Accede a la aplicación en: http://localhost:${PUERTO}`);
});

server.on('error', (error) => {
  console.error('Error al iniciar el servidor:', error);
});

// Manejador de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('Error no capturado:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesa rechazada no manejada:', reason);
  process.exit(1);
});

console.log('Configuración del servidor completada.');
