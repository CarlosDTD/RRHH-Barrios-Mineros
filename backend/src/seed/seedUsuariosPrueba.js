const db = require('../config/db');
const UsuarioModel = require('../models/usuarioModel');

async function seedUsuariosPrueba() {
  console.log('=== Creando usuarios de prueba para Correspondencia ===\n');

  // Seleccionar 5 registros de personal existentes
  const { rows: personal } = await db.query(`
    SELECT id, ci, primer_nombre, segundo_nombre, apellido_paterno, apellido_materno
    FROM personal ORDER BY id LIMIT 5
  `);

  if (personal.length < 5) {
    console.log('No hay suficientes registros de personal. Ejecuta seed_1000.sql primero.');
    process.exit(1);
  }

  // Mapeo de roles: a cada personal le asignamos un rol específico
  const asignaciones = [
    { idx: 0, roles: ['SECRETARIO'] },
    { idx: 1, roles: ['DIRECTOR'] },
    { idx: 2, roles: ['JEFE_RRHH'] },
    { idx: 3, roles: ['AUXILIAR'] },
    { idx: 4, roles: ['AUXILIAR'] },
  ];

  const { rows: rolesDb } = await db.query('SELECT id, nombre FROM roles');
  const roleMap = Object.fromEntries(rolesDb.map(r => [r.nombre, r.id]));

  for (const asig of asignaciones) {
    const p = personal[asig.idx];
    const nombreCompleto = [p.primer_nombre, p.segundo_nombre, p.apellido_paterno, p.apellido_materno].filter(Boolean).join(' ');

    // Verificar si ya existe usuario con este personal_id
    const { rows: existentes } = await db.query(
      'SELECT id FROM usuarios WHERE personal_id = $1', [p.id]
    );

    let usuarioId;
    if (existentes.length > 0) {
      usuarioId = existentes[0].id;
      console.log(`  Usuario ya existe para ${nombreCompleto} (${p.ci}), actualizando roles...`);
    } else {
      const user = await UsuarioModel.createFromPersonal(p.id, p.ci);
      usuarioId = user.id;
      console.log(`  Creado usuario: ${nombreCompleto} (user: ${p.ci} / pass: ${p.ci})`);
    }

    // Asignar roles específicos
    const roleIds = asig.roles.map(r => roleMap[r]).filter(Boolean);
    await UsuarioModel.updateRoles(usuarioId, roleIds);
    console.log(`    Roles asignados: ${asig.roles.join(', ')}`);
  }

  console.log('\n=== Usuarios de prueba creados exitosamente ===');
  console.log('\nResumen de credenciales:');
  console.log('  Usuario: CI del empleado / Contraseña: CI del empleado');
  console.log('  (Deben cambiar contraseña en el primer inicio de sesión)\n');
}

seedUsuariosPrueba().then(() => process.exit(0)).catch(e => {
  console.error('Error:', e);
  process.exit(1);
});
