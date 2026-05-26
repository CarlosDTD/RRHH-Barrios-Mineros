const UsuarioModel = require('../models/usuarioModel');
const db = require('../config/db');

const getAll = async (req, res) => {
  try {
    const usuarios = await UsuarioModel.getAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRoles = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM roles ORDER BY id');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPermisos = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM permisos ORDER BY modulo, codigo');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateRoles = async (req, res) => {
  try {
    const { id } = req.params;
    const { role_ids } = req.body;
    await UsuarioModel.updateRoles(id, role_ids);
    res.json({ mensaje: 'Roles actualizados' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const toggleActivo = async (req, res) => {
  try {
    const result = await UsuarioModel.toggleActivo(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { personal_id, ci } = req.body;
    if (!personal_id || !ci) {
      return res.status(400).json({ error: 'personal_id y ci requeridos' });
    }
    const user = await UsuarioModel.createFromPersonal(personal_id, ci);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UsuarioModel.findById(id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const userPersonal = await UsuarioModel.findByUsername(user.username);
    await UsuarioModel.updatePassword(id, user.username);

    const salt = await require('bcryptjs').genSalt(10);
    const hash = await require('bcryptjs').hash(user.username, salt);
    await db.query(
      'UPDATE usuarios SET password_hash = $1, password_cambiado = false, updated_at = NOW() WHERE id = $2',
      [hash, id]
    );

    res.json({ mensaje: 'Contraseña reseteada al CI del empleado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAll, getRoles, getPermisos, updateRoles, toggleActivo, createUser, resetPassword };
