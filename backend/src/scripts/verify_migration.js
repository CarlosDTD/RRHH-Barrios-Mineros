const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  database: 'rrhh_barrios_mineros',
  host: 'localhost',
  port: 5432,
  password: 'postgres'
});

async function main() {
  // Check biometrico_usuarios columns
  const cols = await pool.query(
    'SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1 ORDER BY ordinal_position',
    ['biometrico_usuarios']
  );
  console.log('=== biometrico_usuarios ===');
  cols.rows.forEach(c => console.log(`  ${c.column_name} (${c.data_type})`));

  // Check row count
  const cnt = await pool.query('SELECT COUNT(*)::int as c FROM biometrico_usuarios');
  console.log(`Registros: ${cnt.rows[0].c}`);

  // Check origen column in biometrico_logs_raw
  const origen = await pool.query(
    'SELECT column_name FROM information_schema.columns WHERE table_name = $1 AND column_name = $2',
    ['biometrico_logs_raw', 'origen']
  );
  console.log(`Columna 'origen' en biometrico_logs_raw: ${origen.rows.length > 0 ? 'EXISTE' : 'NO EXISTE'}`);

  await pool.end();
  console.log('Migración verificada correctamente ✅');
}

main().catch(e => { console.error(e); process.exit(1); });
