const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario.model');
const { generarJWT } = require('../helpers/jwt.helper');

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
      return res.status(404).json( invalidCredentialResponse );
    }

    //  Verificar contraseña
    const validPassword = bcrypt.compareSync(password, usuarioDb.password);
    if (!validPassword) {
      return res.status(400).json( invalidCredentialResponse );
    }

    // Generar el TOKEN - JWT
    const token = await generarJWT(usuarioDb.id);

    res.json({
      ok: true,
      token
    })
  } catch (error) {
    console.log(error);
    response.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    });
  }
}

module.exports = {
  login
}