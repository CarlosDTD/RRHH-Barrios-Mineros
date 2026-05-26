const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const { rows } = await db.query(`
      SELECT u.id, u.username, u.personal_id, u.password_cambiado, u.activo,
             p.ci, p.primer_nombre, p.segundo_nombre, p.apellido_paterno, p.apellido_materno,
             vl.cargo_actual
      FROM usuarios u
      LEFT JOIN personal p ON u.personal_id = p.id
      LEFT JOIN vinculos_laborales vl ON p.id = vl.personal_id
      WHERE u.id = $1 AND u.activo = true
    `, [decoded.id]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado o inactivo' });
    }

    const user = rows[0];

    const { rows: roles } = await db.query(`
      SELECT r.nombre FROM roles r
      JOIN usuario_roles ur ON r.id = ur.rol_id
      WHERE ur.usuario_id = $1
    `, [decoded.id]);

    const { rows: permisos } = await db.query(`
      SELECT DISTINCT p.codigo FROM permisos p
      JOIN rol_permisos rp ON p.id = rp.permiso_id
      JOIN usuario_roles ur ON rp.rol_id = ur.rol_id
      WHERE ur.usuario_id = $1
    `, [decoded.id]);

    req.usuario = {
      id: user.id,
      username: user.username,
      personal_id: user.personal_id,
      password_cambiado: user.password_cambiado,
      nombre_completo: [
        user.primer_nombre, user.segundo_nombre,
        user.apellido_paterno, user.apellido_materno
      ].filter(Boolean).join(' '),
      ci: user.ci,
      cargo: user.cargo_actual,
      roles: roles.map(r => r.nombre),
      permisos: permisos.map(p => p.codigo)
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    return res.status(401).json({ error: 'Token inválido' });
  }
};

const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ error: 'No autenticado' });
    }
    const hasRole = roles.some(role => req.usuario.roles.includes(role));
    if (!hasRole) {
      return res.status(403).json({ error: 'No tienes permisos para esta acción' });
    }
    next();
  };
};

const checkPermission = (codigo) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ error: 'No autenticado' });
    }
    if (req.usuario.roles.includes('ADMIN')) {
      return next();
    }
    if (!req.usuario.permisos.includes(codigo)) {
      return res.status(403).json({ error: 'No tienes permisos para esta acción' });
    }
    next();
  };
};

module.exports = { authMiddleware, checkRole, checkPermission };
