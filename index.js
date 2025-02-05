const express = require('express');
const userRoutes = require('./src/routes/routes'); // Importa el módulo de rutas
var cors = require('cors');
const app = express();
app.use(express.static('public'));
var serviceAccount = require("./config.json");

var allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:4200',
  'http://localhost:4200/inicio',
  'http://localhost:8000',
  'http://192.168.88.167',
  'https://loginmicrosoftonlinecom-git-master-sergios-projects-d4c71fde.vercel.app',
  'http://192.168.88.162'
];
// Middleware para parsear JSON
app.use(express.json());

app.use(cors({
  origin: function(origin, callback){
    console.log('Origin:', origin); 
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));


// Usa las rutas de usuarios
app.use('/api', userRoutes);

// Inicia el servidor
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
