const { response } = require('express');
const Hospital = require('../models/hospital.model');

const getHospitales = async (req, res = response) => {
  const hospitales = await Hospital.find()
                                   .populate('usuario', 'nombre img');

  res.json({
    ok: true,
    hospitales
  });
}

const crearHospital = async (req, res = response) => {
  const uid = req.uid;
  const hospital = new Hospital({
    usuario: uid,
    ...req.body
  });

  try {
    const hospitalDb = await hospital.save();
   
    res.json({
      ok: true,
      hospital: hospitalDb
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    });
  }
}

const actualizarHospital = async (req, res = response) => {
  const hospitalId = req.params.id;
  const uid = req.uid;

  try {
    const hospitalDb = await Hospital.findById(hospitalId);
    
    if (!hospitalDb) {
      return res.status(404).json({
        ok: false,
        msg: 'Hospital no encontrado por Id',
      });
    }

    // hospitalDb.nombre = req.body.nombre;

    const cambiosHospital = { ...req.body, usuario: uid };
    const hospitalActualizado = await Hospital.findByIdAndUpdate(hospitalId, cambiosHospital, { new: true });
    
    res.json({
      ok: true,
      hospital: hospitalActualizado
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    });
  }

}

const borrarHospital = async (req, res = response) => {
  const hospitalId = req.params.id;

  try {
    const hospitalDb = await Hospital.findById(hospitalId);
    
    if (!hospitalDb) {
      return res.status(404).json({
        ok: false,
        msg: 'Hospital no encontrado por Id',
      });
    }

    await Hospital.findByIdAndDelete(hospitalId);
    
    res.json({
      ok: true,
      msg: 'Hospital eliminado'
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
  getHospitales,
  actualizarHospital,
  crearHospital,
  borrarHospital
}