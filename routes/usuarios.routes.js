/*
  Ruta: /api/usuarios
*/
const { Router } = require('express');
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos.middleware');
const { getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario } = require('../controllers/usuarios.controller');
const { validarJWT } = require('../middlewares/validar-jwt.middleware');

const router = Router();

router.get('/', [
  validarJWT
],
getUsuarios);

router.post('/',
  [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    validarCampos,
  ],
  crearUsuario);

router.put('/:id', 
  [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('role', 'El role es obligatorio').not().isEmpty(),
    validarCampos
  ],
  actualizarUsuario);

router.delete('/:id',
  [
    validarJWT
  ],
  borrarUsuario);

module.exports = router;