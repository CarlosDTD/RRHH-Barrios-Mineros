const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const stateFolder = path.join(__dirname, '..', 'Statefolder');
const file = '4 INVENTARIO PERSONAL HBM ABR 2026_.xlsx';

console.log(`\n--- Analizando: ${file} ---`);
try {
  const workbook = XLSX.readFile(path.join(stateFolder, file));
  workbook.SheetNames.forEach(sheetName => {
    console.log(`\nHoja: ${sheetName}`);
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    // Buscar la fila que parece ser el encabezado
    let headerRowIndex = -1;
    for (let i = 0; i < Math.min(data.length, 20); i++) {
      const row = data[i];
      if (row && row.some(cell => typeof cell === 'string' && (cell.includes('C.I.') || cell.includes('PATERNO') || cell.includes('NOMBRE')))) {
        headerRowIndex = i;
        break;
      }
    }

    if (headerRowIndex !== -1) {
      console.log(`Encabezados (Fila ${headerRowIndex}):`, data[headerRowIndex]);
      console.log(`Muestra (Fila ${headerRowIndex + 1}):`, data[headerRowIndex + 1]);
    } else {
      console.log('No se encontró fila de encabezados en las primeras 20 filas.');
      // Mostrar las primeras 5 filas para ver qué hay
      console.log('Primeras 5 filas:', data.slice(0, 5));
    }
  });
} catch (err) {
  console.error(`Error leyendo ${file}: ${err.message}`);
}
