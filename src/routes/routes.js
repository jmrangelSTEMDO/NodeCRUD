const express = require('express');
const router = express.Router();
const userController = require('../usuarios/usuarios.js')

router.post('/usuarios', async (req, res) => {
  try {
    await userController.createData(req, res, userController.supabase);
  } catch (error){
    console.error('error al insertar usuario:', error.message);
  }
});

router.get('/list', async (req, res) =>{
  try{
    await userController.csv(req, res);
  }catch(error){
    console.error("Error al leer la tabla:", error.message);
  }
});

router.get('/', async (req, res) =>{ console.log("hloa");
  try{
    await userController.readTodos(req, res);
  }catch(error){
    console.error("Error al leer la tabla:", error.message);
  }
});

// router.get('/pepito', async (req, res) =>{
//   try{
//     await userController.readTodosDecrypted(req, res);
//   }catch(error){
//     console.error("Error al leer la tabla:", error.message);
//   }
// });


module.exports = router;
