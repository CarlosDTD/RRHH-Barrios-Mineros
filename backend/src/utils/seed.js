const db = require('../config/db');

const seedData = async () => {
  try {
    // 1. Insertar Profesiones si no existen
    const profs = ['Médico General', 'Enfermera Licenciada', 'Auxiliar de Enfermería', 'Administrativo', 'Especialista'];
    for (const p of profs) {
      await db.query('INSERT INTO cat_profesiones (nombre_profesion) VALUES ($1) ON CONFLICT DO NOTHING', [p]);
    }

    // 2. Obtener IDs para relacionar
    const { rows: expediciones } = await db.query('SELECT id FROM cat_expediciones WHERE sigla = $1', ['OR']);
    const { rows: profesiones } = await db.query('SELECT id FROM cat_profesiones WHERE nombre_profesion = $1', ['Médico General']);
    
    if (expediciones.length > 0 && profesiones.length > 0) {
      const expId = expediciones[0].id;
      const profId = profesiones[0].id;

      // 3. Insertar Personal de ejemplo
      await db.query(`
        INSERT INTO personal (
          ci, exp_id, apellido_paterno, apellido_materno, primer_nombre, 
          fecha_nacimiento, profesion_id, telefono
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (ci) DO NOTHING
      `, ['1234567', expId, 'Pérez', 'Mamani', 'Juan Carlos', '1985-05-20', profId, '70012345']);

      console.log('Datos de ejemplo insertados con éxito');
    }
  } catch (error) {
    console.error('Error al insertar datos de ejemplo:', error);
  }
};

seedData();
