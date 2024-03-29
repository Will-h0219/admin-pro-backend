/*
 Ruta: /api/uploads/
*/

const { Router } = require('express');
const expressFileUpload = require('express-fileupload');

const { validarJWT } = require('../middlewares/validar-jwt.middleware');
const { fileUpload, retornaImagen } = require('../controllers/uploads.controller');

const router = Router();

router.use(expressFileUpload());

router.put('/:tipo/:id', validarJWT, fileUpload);
router.get('/:tipo/:foto', validarJWT, retornaImagen);

module.exports = router;