/*
  Ruta: /api/login
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignIn } = require('../controllers/auth.controller');
const { validarCampos } = require('../middlewares/validar-campos.middleware');

const router = Router();

router.post('/',
 [
  check('email', 'EL email es obligatorio').isEmail(),
  check('password', 'El password es obligatorio').not().isEmpty(),
  validarCampos
 ],
 login
);

router.post('/google',
 [
  check('token', 'El Token de google es obligatorio').not().isEmpty(),
  validarCampos
 ],
 googleSignIn
);

module.exports = router;