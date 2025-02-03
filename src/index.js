const express = require('express');
const userRoutes = require('./routes/routes.js'); // Importa el módulo de rutas

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Usa las rutas de usuarios
app.use('/api', userRoutes);

// Inicia el servidor
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
