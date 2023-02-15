const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario.model');
const { generarJWT } = require('../helpers/jwt.helper');
const { googleVerify } = require('../helpers/google-verify.helper');

const login = async (req, res = response) => {
  const { email, password } = req.body;
  const invalidCredentialResponse = {
    ok: false,
    msg: 'Credenciales invalidas'
  };

  try {
    const usuarioDb = await Usuario.findOne({ email });

    // Verificar email
    if (!usuarioDb) {
      return res.status(404).json(invalidCredentialResponse);
    }

    //  Verificar contraseña
    const validPassword = bcrypt.compareSync(password, usuarioDb.password);
    if (!validPassword) {
      return res.status(400).json(invalidCredentialResponse);
    }

    // Generar el TOKEN - JWT
    const token = await generarJWT(usuarioDb.id);

    res.json({
      ok: true,
      token
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    });
  }
}

const googleSignIn = async (req, res = response) => {
  try {
    const { email, name, picture } = await googleVerify(req.body.token);

    const usuarioDb = await Usuario.findOne({ email });
    let usuario;

    if (!usuarioDb) {
      usuario = new Usuario({
        nombre: name,
        email,
        password: '@@@',
        img: picture,
        google: true
      });
    } else {
      usuario = usuarioDb;
      usuario.google = true;
      // usuario.password = '@@@'; Restringir credenciales originales y solo permitir autenticación por google
    }

    // Guardar usuario
    await usuario.save();

    // Generar el TOKEN - JWT
    const token = await generarJWT(usuario.id);

    res.json({
      ok: true,
      email, name, picture,
      token
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      ok: false,
      msg: 'Token de google no es correcto'
    });
  }
}

module.exports = {
  login,
  googleSignIn
}