/*
 Ruta: /api/medicos
*/

const { Router } = require('express');
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos.middleware');
const { validarJWT } = require('../middlewares/validar-jwt.middleware');
const { actualizarMedico, borrarMedico, crearMedico, getMedicos } = require('../controllers/medicos.controller');

const router = Router();

router.get('/', 
  [
    
  ],
  getMedicos);

router.post('/',
  [
    validarJWT,
    check('nombre', 'El nombre del medico es necesario').not().isEmpty(),
    check('hospital', 'El hospitalId debe ser valido').isMongoId(),
    validarCampos
  ],
  crearMedico);

router.put('/:id', 
  [
    validarJWT,
    check('nombre', 'El nombre del medico es necesario').not().isEmpty(),
    check('hospital', 'El hospitalId debe ser valido').isMongoId(),
    validarCampos
  ],
  actualizarMedico);

router.delete('/:id',
  [
    validarJWT
  ],
  borrarMedico);

module.exports = router;