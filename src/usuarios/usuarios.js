/*import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    'https://cmzgqyfvwnsxrbinxkjk.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtemdxeWZ2d25zeHJiaW54a2prIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODU3MjU5MCwiZXhwIjoyMDU0MTQ4NTkwfQ.DSRew9cWsqX22HZIR6JkxDr5F7lAdxQbT4R5XqYYaUA'
);

export async function createData(req, res) {
    try {
        const { data, error } = await supabase
            .from('usuarios')
            .insert([req.body]);

        if (error) throw error;
        return res.status(201).json(data);
    } catch (error) {
        console.error('Error al insertar usuario:', error.message);
        return res.status(400).json({ error: error.message });
    }
}

*/

import dotenv from 'dotenv'
dotenv.config();
import { createClient } from "@supabase/supabase-js";
import CryptoJS from 'crypto-js';

export const supabase = createClient(
  'https://cmzgqyfvwnsxrbinxkjk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtemdxeWZ2d25zeHJiaW54a2prIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODU3MjU5MCwiZXhwIjoyMDU0MTQ4NTkwfQ.DSRew9cWsqX22HZIR6JkxDr5F7lAdxQbT4R5XqYYaUA'
);

// Clave secreta para la encriptación (guárdala de forma segura, no la expongas en el código)
const SECRET_KEY =process.env.ENCRYPTION_SECRET_KEY;


function encryptData(data) {
    return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
}

export async function createData(req, res) {
  try {
    // Encripta los datos del body

    
    const encryptedData = encryptData(req.body.email);
    const { data, error } = await supabase
      .from('usuarios')
      .insert([{ email: encryptedData }]);
    
    if (error) throw error;
    return res.status(201).json({ message: 'Datos encriptados insertados correctamente' });
  } catch (error) {
    console.error('Error al insertar usuario:', error.message);
    return res.status(400).json({ error: error.message });
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
    console.log(data);
    return res.status(400).json({error: error.message});
  }
}


