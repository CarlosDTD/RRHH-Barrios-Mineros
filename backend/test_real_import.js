const fs = require('fs');
const path = require('path');
const ImportService = require('./src/services/importService');
const db = require('./src/config/db');

async function testImport() {
  const filePath = path.join(__dirname, '..', 'Statefolder', '4 INVENTARIO PERSONAL HBM ABR 2026_.xlsx');
  
  if (!fs.existsSync(filePath)) {
    console.error('Archivo no encontrado:', filePath);
    process.exit(1);
  }

  console.log('--- Iniciando Prueba de Importación Real ---');
  const buffer = fs.readFileSync(filePath);

  try {
    const results = await ImportService.importPersonalFromExcel(buffer);
    console.log('\nResultados:');
    console.log(`- Exitosos: ${results.success}`);
    console.log(`- Errores: ${results.errors}`);
    
    if (results.details.length > 0) {
      console.log('\nDetalle de errores (Primeros 10):');
      results.details.slice(0, 10).forEach(d => {
        console.log(`  [Hoja: ${d.hoja}] CI: ${d.ci} -> Error: ${d.error}`);
      });
    }

    // Verificar en la DB
    const { rows } = await db.query('SELECT COUNT(*) FROM personal');
    const { rows: vl } = await db.query('SELECT COUNT(*) FROM vinculos_laborales');
    console.log(`\nTotal en DB 'personal': ${rows[0].count}`);
    console.log(`Total en DB 'vinculos_laborales': ${vl[0].count}`);

  } catch (error) {
    console.error('Error fatal durante la prueba:', error);
  } finally {
    process.exit(0);
  }
}

testImport();
