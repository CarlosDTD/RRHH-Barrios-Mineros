const db = require('../config/db');
const bcrypt = require('bcryptjs');

async function seed() {
  console.log('=== Sembrando datos de Correspondencia y Roles ===\n');

  // Roles
  const roles = [
    { nombre: 'ADMIN', descripcion: 'Administrador del sistema - acceso total' },
    { nombre: 'SECRETARIO', descripcion: 'Secretaría - registra y deriva correspondencia' },
    { nombre: 'DIRECTOR', descripcion: 'Director del hospital' },
    { nombre: 'JEFE_RRHH', descripcion: 'Jefe de Recursos Humanos' },
    { nombre: 'AUXILIAR', descripcion: 'Auxiliar de oficina' },
  ];

  console.log('Creando roles...');
  for (const r of roles) {
    await db.query(
      `INSERT INTO roles (nombre, descripcion) VALUES ($1, $2) ON CONFLICT (nombre) DO NOTHING`,
      [r.nombre, r.descripcion]
    );
  }

  // Permisos
  const permisos = [
    { codigo: 'correspondencia.ver', descripcion: 'Ver correspondencia', modulo: 'correspondencia' },
    { codigo: 'correspondencia.crear', descripcion: 'Registrar nueva correspondencia', modulo: 'correspondencia' },
    { codigo: 'correspondencia.editar', descripcion: 'Editar correspondencia', modulo: 'correspondencia' },
    { codigo: 'correspondencia.derivar', descripcion: 'Derivar correspondencia', modulo: 'correspondencia' },
    { codigo: 'correspondencia.responder', descripcion: 'Responder derivaciones', modulo: 'correspondencia' },
    { codigo: 'correspondencia.eliminar', descripcion: 'Eliminar correspondencia', modulo: 'correspondencia' },
    { codigo: 'usuarios.ver', descripcion: 'Ver usuarios del sistema', modulo: 'usuarios' },
    { codigo: 'usuarios.gestionar', descripcion: 'Gestionar usuarios y roles', modulo: 'usuarios' },
    { codigo: 'config.ver', descripcion: 'Ver configuración del sistema', modulo: 'config' },
    { codigo: 'config.editar', descripcion: 'Editar configuración del sistema', modulo: 'config' },
  ];

  console.log('Creando permisos...');
  for (const p of permisos) {
    await db.query(
      `INSERT INTO permisos (codigo, descripcion, modulo) VALUES ($1, $2, $3) ON CONFLICT (codigo) DO NOTHING`,
      [p.codigo, p.descripcion, p.modulo]
    );
  }

  // Asignar permisos a roles
  console.log('Asignando permisos a roles...');

  const { rows: dbRoles } = await db.query('SELECT id, nombre FROM roles');
  const { rows: dbPermisos } = await db.query('SELECT id, codigo FROM permisos');

  const roleMap = Object.fromEntries(dbRoles.map(r => [r.nombre, r.id]));
  const permMap = Object.fromEntries(dbPermisos.map(p => [p.codigo, p.id]));

  const rolePermMap = {
    ADMIN: Object.keys(permMap),
    SECRETARIO: ['correspondencia.ver', 'correspondencia.crear', 'correspondencia.editar',
                 'correspondencia.derivar', 'correspondencia.responder', 'correspondencia.eliminar'],
    DIRECTOR: ['correspondencia.ver', 'correspondencia.derivar', 'correspondencia.responder'],
    JEFE_RRHH: ['correspondencia.ver', 'correspondencia.derivar', 'correspondencia.responder'],
    AUXILIAR: ['correspondencia.ver', 'correspondencia.responder'],
  };

  for (const [roleName, permCodes] of Object.entries(rolePermMap)) {
    const roleId = roleMap[roleName];
    if (!roleId) continue;
    for (const code of permCodes) {
      const permId = permMap[code];
      if (permId) {
        await db.query(
          'INSERT INTO rol_permisos (rol_id, permiso_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [roleId, permId]
        );
      }
    }
  }

  // Catálogos de correspondencia
  console.log('Creando catálogos...');

  const tipos = [
    { codigo: 'REC', nombre: 'Recepcionada' },
    { codigo: 'INT', nombre: 'Interna' },
    { codigo: 'EMIT', nombre: 'Emitida' },
  ];
  for (const t of tipos) {
    await db.query(
      'INSERT INTO cat_tipos_correspondencia (codigo, nombre) VALUES ($1, $2) ON CONFLICT (codigo) DO NOTHING',
      [t.codigo, t.nombre]
    );
  }

  const clasificaciones = [
    { codigo: 'SOL', nombre: 'Solicitud' },
    { codigo: 'INF', nombre: 'Informe' },
    { codigo: 'MEM', nombre: 'Memorándum' },
    { codigo: 'OFI', nombre: 'Oficio' },
    { codigo: 'CIR', nombre: 'Circular' },
    { codigo: 'NOT', nombre: 'Nota' },
    { codigo: 'RES', nombre: 'Resolución' },
    { codigo: 'ACT', nombre: 'Acta' },
  ];
  for (const c of clasificaciones) {
    await db.query(
      'INSERT INTO cat_clasificaciones (codigo, nombre) VALUES ($1, $2) ON CONFLICT (codigo) DO NOTHING',
      [c.codigo, c.nombre]
    );
  }

  const etiquetas = [
    { nombre: 'Urgente', color: '#ef4444' },
    { nombre: 'Confidencial', color: '#dc2626' },
    { nombre: 'Reservado', color: '#f59e0b' },
    { nombre: 'RRHH', color: '#3b82f6' },
    { nombre: 'Dirección', color: '#8b5cf6' },
    { nombre: 'Secretaría', color: '#10b981' },
    { nombre: 'Administrativo', color: '#6366f1' },
    { nombre: 'Personal', color: '#ec4899' },
  ];
  for (const e of etiquetas) {
    await db.query(
      'INSERT INTO cat_etiquetas (nombre, color) VALUES ($1, $2) ON CONFLICT (nombre) DO NOTHING',
      [e.nombre, e.color]
    );
  }

  // Configuración CITE
  const currentYear = new Date().getFullYear();
  await db.query(`
    INSERT INTO configuracion_cite (id, hospital_sigla, separador, formato, gestion_actual, ultimo_numero)
    VALUES (1, 'HBM', '/', '{SIGLA}/{AREA}/{TIPO}/N° {NRO}/{GESTION}', $1, 0)
    ON CONFLICT (id) DO UPDATE SET gestion_actual = $1
  `, [currentYear]);

  // Crear usuario admin por defecto si no existe
  console.log('Creando usuario admin por defecto...');
  const { rows: existingAdmin } = await db.query("SELECT id FROM usuarios WHERE username = 'admin'");
  if (existingAdmin.length === 0) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('admin', salt);

    const { rows: adminUser } = await db.query(`
      INSERT INTO usuarios (username, password_hash, password_cambiado, email)
      VALUES ('admin', $1, false, 'admin@hospital.gob.bo')
      ON CONFLICT (username) DO NOTHING
      RETURNING id
    `, [hash]);

    if (adminUser.length > 0) {
      await db.query('INSERT INTO usuario_roles (usuario_id, rol_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [adminUser[0].id, roleMap['ADMIN']]);
      console.log('Usuario admin creado: admin / admin (CAMBIAR CONTRASEÑA EN PRIMER LOGIN)');
    }
  } else {
    console.log('Usuario admin ya existe');
  }

  console.log('\n=== Seed completado exitosamente ===');
}

seed().then(() => process.exit(0)).catch(e => {
  console.error('Error en seed:', e);
  process.exit(1);
});
