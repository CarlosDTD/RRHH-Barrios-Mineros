require('dotenv').config({ path: './backend/.env' });
const fs = require('fs');
const AsistenciaService = require('./backend/src/services/asistenciaService');
const db = require('./backend/src/config/db');

async function testImport() {
    try {
        console.log('Iniciando prueba de importación a PostgreSQL...');
        
        const filePath = 'D:/RRHH-Barrios-Mineros/Statefolder/CONSOLIDADO DE ASISTENCIA MINISTERIALES ABR H.B.M..xlsx';
        const buffer = fs.readFileSync(filePath);
        
        // Mes 4 (Abril), Año 2026
        const results = await AsistenciaService.importAsistenciaFromExcel(buffer, 4, 2026);
        
        console.log('Resultados de la importación:', JSON.stringify(results, null, 2));
        
        // Verificar en la DB
        const { rows } = await db.query('SELECT COUNT(*) FROM asistencia_mensual');
        console.log(`Registros en asistencia_mensual: ${rows[0].count}`);
        
    } catch (error) {
        console.error('Error en la prueba:', error);
    } finally {
        process.exit();
    }
}

testImport();
