const express = require('express');
const router = express.Router();
const userController = require('../usuarios/usuarios')


// Configura el cliente de Supabase

// POST - Crear un nuevo usuario
router.post('/user', async (req, res) => {
  try {
    await userController.createData(req, res, userController.supabase);
  } catch (error){
    console.error('error al insertar usuario:', error.message);
  }
});


router.get('/', async (req, res) =>{
  try{
    await userController.readTodos(req, res);
  }catch(error){
    console.error("Error al leer la tabla:", error.message);
  }
});

router.get('/pepito', async (req, res) =>{
  try{
    await userController.readTodosDecrypted(req, res);
  }catch(error){
    console.error("Error al leer la tabla:", error.message);
  }
});

router.get('/list', async (req, res) =>{
  try{
    await userController.csv(req, res);
  }catch(error){
    console.error("Error al leer la tabla:", error.message);
  }
});


router.put('/:id', async (req,res) => {
  try{
    await userController.updateData(id)
  }catch(error){
    console.error("Error al leer la tabla:", error.message);
  }
});


module.exports = router;
