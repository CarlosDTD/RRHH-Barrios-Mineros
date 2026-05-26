const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UsuarioModel = require('../models/usuarioModel');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
    }

    const user = await UsuarioModel.findByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    if (!user.activo) {
      return res.status(401).json({ error: 'Cuenta desactivada' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    await UsuarioModel.updateLastAccess(user.id);

    const { rows: roles } = await require('../config/db').query(`
      SELECT r.nombre FROM roles r
      JOIN usuario_roles ur ON r.id = ur.rol_id WHERE ur.usuario_id = $1
    `, [user.id]);

    const tokenPayload = {
      id: user.id,
      username: user.username,
      personal_id: user.personal_id
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.json({
      token,
      usuario: {
        id: user.id,
        username: user.username,
        personal_id: user.personal_id,
        password_cambiado: user.password_cambiado,
        nombre_completo: [user.primer_nombre, user.segundo_nombre, user.apellido_paterno, user.apellido_materno].filter(Boolean).join(' '),
        ci: user.ci,
        cargo: user.cargo_actual,
        roles: roles.map(r => r.nombre)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const me = async (req, res) => {
  try {
    const user = await UsuarioModel.findById(req.usuario.id);

    const { rows: roles } = await require('../config/db').query(`
      SELECT r.nombre FROM roles r
      JOIN usuario_roles ur ON r.id = ur.rol_id WHERE ur.usuario_id = $1
    `, [req.usuario.id]);

    res.json({
      id: user.id,
      username: user.username,
      personal_id: user.personal_id,
      password_cambiado: user.password_cambiado,
      nombre_completo: [user.primer_nombre, user.segundo_nombre, user.apellido_paterno, user.apellido_materno].filter(Boolean).join(' '),
      ci: user.ci,
      cargo: user.cargo_actual,
      roles: roles.map(r => r.nombre)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const cambiarPassword = async (req, res) => {
  try {
    const { password_actual, password_nuevo } = req.body;

    if (!password_actual || !password_nuevo) {
      return res.status(400).json({ error: 'Contraseña actual y nueva requeridas' });
    }

    if (password_nuevo.length < 6) {
      return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' });
    }

    const user = await UsuarioModel.findById(req.usuario.id);
    const validPassword = await bcrypt.compare(password_actual, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Contraseña actual incorrecta' });
    }

    await UsuarioModel.updatePassword(req.usuario.id, password_nuevo);

    res.json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { login, me, cambiarPassword };
