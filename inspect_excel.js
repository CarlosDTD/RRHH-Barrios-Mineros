const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const stateFolder = path.join(__dirname, 'Statefolder');
const files = fs.readdirSync(stateFolder).filter(f => f.endsWith('.xlsx'));

files.forEach(file => {
  console.log(`\n--- Analizando: ${file} ---`);
  try {
    const workbook = XLSX.readFile(path.join(stateFolder, file));
    workbook.SheetNames.forEach(sheetName => {
      console.log(`Hoja: ${sheetName}`);
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      if (data.length > 0) {
        console.log('Encabezados:', data[0]);
        console.log('Fila 1 (Muestra):', data[1]);
      } else {
        console.log('Hoja vacía');
      }
    });
  } catch (err) {
    console.error(`Error leyendo ${file}: ${err.message}`);
  }
});
