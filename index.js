const express = require('express');
const app = express();
const userRoutes = require('./src/routes/routes'); // Importa el módulo de rutas
var cors = require('cors');
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const CryptoJS = require('crypto-js');
const dotenv = require('dotenv')
dotenv.config();

const {createClient} = require('@supabase/supabase-js');
const supabase_url = process.env.SUPABASE_URL;
const supabase_key = process.env.SUPABASE_KEY;
const SECRET_KEY = process.env.ENCRYPTION_SECRET_KEY;


const supabase = createClient(
  supabase_url,
  supabase_key
);

var allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:4200',
  'http://localhost:4200/inicio',
  'http://localhost:8000',
  'http://192.168.88.167',
  'https://loginmicrosoftonlinecom-git-master-sergios-projects-d4c71fde.vercel.app',
  'https://loginmicrosoftonlinecom-git-master-sergios-projects-d4c71fde.vercel.app/stemdo',
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
// app.use('/api', userRoutes);

app.post("/api/usuarios", async(req, res) => {
  if (validarEmail(req.body.email)) {
    try {
      const encryptedData = encryptData(req.body.email);
      const { data, error } = await supabase
        .from('usuarios')
        .insert([{ email: encryptedData }])
        .select();
      if (error) throw error;
      return res.status(201).json({ message: 'Datos encriptados insertados correctamente' });
    } catch (error) {
      console.error('Error al insertar usuario:', error.message);
      return res.status(400).json({ error: error.message });
    }
  } else {
    return res.status(400).json({ error: 'El correo electrónico introducido no es válido.' });;
  }
});

app.get('/api/list', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*');

    if (error) throw error;
    return res.status(201).json({ data })
  } catch (error) {
    console.error("Error al leer la tabla:", error.message);
    return res.status(400).json({ error: error.message });
  }
})

app.get('/api/csv', async (req, res) => {
  let json = [];
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*');
      data.forEach(element => {
        let emailD = CryptoJS.AES.decrypt(element.email, SECRET_KEY).toString(CryptoJS.enc.Utf8);
  
        json.push({
          id: element.id,
          email: emailD,
          fechaRegistro: element.fechaRegistro
        });
  
      });
  
    } catch (e) {
  
    }
    json = JSON.stringify(json);
    let csv = jsonToCsv(json);
    csv = CryptoJS.AES.encrypt(csv, SECRET_KEY).toString();
    res.header('Content-Type', 'text/csv');
    res.attachment('datos.csv');
    res.send(csv);
})

// Inicia el servidor
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

function validarEmail(email) {
  return emailRegex.test(email);
}

function encryptData(data) {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
}

function jsonToCsv(json) {
  const items = JSON.parse(json);
  const header = Object.keys(items[0]).join(',');
  const rows = items.map(item => Object.values(item).join(',')).join('\n');
  return `${header}\n${rows}`;
}
