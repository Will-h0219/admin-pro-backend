const { response } = require('express');
const Medico = require('../models/medico.model');

const getMedicos = async (req, res = response) => {
  const medicos = await Medico.find()
                              .populate('usuario', 'nombre img')
                              .populate('hospital', 'nombre img');

  res.json({
    ok: true,
    msg: medicos
  })
}

const crearMedico = async (req, res = response) => {
  const uid = req.uid;
  const medico = new Medico({
    usuario: uid,
    ...req.body
  });

  try {
    const medicoDb = await medico.save();
    
    res.json({
      ok: true,
      medico: medicoDb
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    });
  }
}

const actualizarMedico = async (req, res = response) => {
  const medicoId = req.params.id;
  const uid = req.uid;

  try {
    const medicoDb = await Medico.findById(medicoId);

    if (!medicoDb) {
      return res.status(404).json({
        ok: false,
        msg: 'No se encontro medico por id'
      });
    }

    const cambiosMedico = { ...req.body, usuario: uid };
    const medicoActualizado = await Medico.findByIdAndUpdate(medicoId, cambiosMedico, { new: true });

    res.json({
      ok: true,
      medico: medicoActualizado
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    });
  }
}

const borrarMedico = async (req, res = response) => {
  const medicoId = req.params.id;

  try {
    const medicoDb = await Medico.findById(medicoId);

    if (!medicoDb) {
      return res.status(404).json({
        ok: false,
        msg: 'No se encontro medico por id'
      });
    }

    await Medico.findByIdAndDelete(medicoId);

    res.json({
      ok: true,
      msg: 'Medico eliminado'
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    });
  }
}

module.exports = {
  getMedicos,
  actualizarMedico,
  crearMedico,
  borrarMedico
}