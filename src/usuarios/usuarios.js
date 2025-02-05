
import { createClient } from "@supabase/supabase-js";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;







export async function createData(req, res) {
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
}

export async function readTodos(req, res) {
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
}


export async function readTodosDecrypted(req, res) {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*');

    let lista = [];
    data.forEach(element => {
      let emailD = CryptoJS.AES.decrypt(element.email, SECRET_KEY).toString(CryptoJS.enc.Utf8);

      lista.push({
        id: element.id,
        email: emailD,
        fechaRegistro: element.fechaRegistro
      });

    });

    if (error) throw error;
    return res.status(201).json({ lista })
  } catch (error) {
    console.error("Error al leer la tabla:", error.message);
    return res.status(400).json({ error: error.message });
  }
}

export async function csv(req, res) {
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










