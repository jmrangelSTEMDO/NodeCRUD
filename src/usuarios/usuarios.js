import dotenv from 'dotenv'
dotenv.config();
import { createClient } from "@supabase/supabase-js";
import CryptoJS from 'crypto-js';
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const supabase = createClient(
  'https://cmzgqyfvwnsxrbinxkjk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtemdxeWZ2d25zeHJiaW54a2prIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODU3MjU5MCwiZXhwIjoyMDU0MTQ4NTkwfQ.DSRew9cWsqX22HZIR6JkxDr5F7lAdxQbT4R5XqYYaUA'
);

// Clave secreta para la encriptación (guárdala de forma segura, no la expongas en el código)
const SECRET_KEY = process.env.ENCRYPTION_SECRET_KEY;


function encryptData(data) {
    return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
}

export async function createData(req, res) {
  // console.log(req.body.email)
  // console.log(validarEmail(req.body.email))

  if (validarEmail(req.body.email)){

    try {
      
      const encryptedData = encryptData(req.body.email);
      // if(encryptData != "")
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
  }else{
    return res.status(400).json({ error: 'El correo electrónico introducido no es válido.' });;
  }
}

export async function readTodos(req, res) {
    try{
    const { data, error } = await supabase
      .from('usuarios')
      .select('*');
  
    if (error) throw error;
    return res.status(201).json({data})
  } catch(error){
    console.error("Error al leer la tabla:", error.message);
    return res.status(400).json({error: error.message});
  }
}


export async function readTodosDecrypted(req, res) {
    try{
    const { data, error } = await supabase
      .from('usuarios')
      .select('*');

    let lista = [{}];
    data.forEach(element => {
        let emailD = CryptoJS.AES.decrypt(element.email, SECRET_KEY).toString(CryptoJS.enc.Utf8);
    
        lista.push({
            id: element.id,
            email: emailD,
            fechaRegistro: element.fechaRegistro
        });
        
    });
  
    if (error) throw error;
    return res.status(201).json({lista})
  } catch(error){
    console.error("Error al leer la tabla:", error.message);
    // console.log(data);
    return res.status(400).json({error: error.message});
  }
}


// export async function updateData(req, res, id) {
//   try {
  
//     const encryptedData = encryptData(req.body.email);
//     const { data, error } = await supabase
//       .from('usuarios')
//       .update([{ email: encryptedData }])
//       .eq('id', id);
    
//     if (error) throw error;
//     return res.status(201).json({ message: 'Datos encriptados actualizados correctamente' });
//   } catch (error) {
//     console.error('Error al actualizar el usuario:', error.message);
//     return res.status(400).json({ error: error.message });
//   }
// }

export async function csv(req, res) {
  let  json = [{}];
  try{
    const { data, error } = await supabase
    .from('usuarios')
    .select('*');
    // console.log(data);
    json = data;
    data.forEach(element => {
        let emailD = CryptoJS.AES.decrypt(element.email, SECRET_KEY).toString(CryptoJS.enc.Utf8);
    
        json.push({
            id: element.id,
            email: emailD,
            fechaRegistro: element.fechaRegistro
        });
        
    });

  }catch (e){
 
  }
  json = JSON.stringify(json);
  // console.log(json);
  let csv = jsonToCsv(json);

  csv = CryptoJS.AES.encrypt(csv, SECRET_KEY).toString();
  res.header('Content-Type', 'text/csv');
  res.attachment('datos.csv');
  // console.log(csv);
  console.log(CryptoJS.AES.decrypt(csv, SECRET_KEY).toString(CryptoJS.enc.Utf8));
  res.send(csv);
  
}

function jsonToCsv(json) {
  const items = JSON.parse(json);
  const header = Object.keys(items[0]).join(',');
  const rows = items.map(item => Object.values(item).join(',')).join('\n');
  return `${header}\n${rows}`;
}



function validarEmail(email) {
  return emailRegex.test(email);
}



