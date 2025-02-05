const express = require('express');
const userRoutes = require('./routes/routes.js'); // Importa el módulo de rutas
const app = express();
var cors = require('cors');

var allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:4200',
  'http://localhost:4200/inicio',
  'http://localhost:8000',
  'http://192.168.88.167',
  'https://loginmicrosoftonlinecom-git-master-sergios-projects-d4c71fde.vercel.app/',
  'http://192.168.88.162'
];
app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

// Middleware para parsear JSON
app.use(express.json());

// Usa las rutas de usuarios
app.use('/api', userRoutes);

// Inicia el servidor
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
