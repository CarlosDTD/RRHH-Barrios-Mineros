const XLSX = require('xlsx');
const PersonalModel = require('../models/personalModel');
const db = require('../config/db');

class ImportService {
  static async importPersonalFromExcel(buffer) {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const results = { success: 0, errors: 0, details: [] };

    // Obtener catálogos para mapear nombres a IDs
    const { rows: expediciones } = await db.query('SELECT id, sigla FROM cat_expediciones');
    const { rows: profesiones } = await db.query('SELECT id, nombre_profesion FROM cat_profesiones');

    for (const row of data) {
      try {
        // Buscar ID de expedición por sigla (ej. "OR")
        const exp = expediciones.find(e => e.sigla === row['Expedición']);
        // Buscar ID de profesión por nombre
        const prof = profesiones.find(p => p.nombre_profesion === row['Profesión']);

        const personalData = {
          ci: row['CI']?.toString(),
          complemento: row['Complemento']?.toString() || null,
          exp_id: exp ? exp.id : null,
          apellido_paterno: row['Apellido Paterno'] || null,
          apellido_materno: row['Apellido Materno'] || null,
          apellido_casada: row['Apellido Casada'] || null,
          primer_nombre: row['Primer Nombre'] || null,
          segundo_nombre: row['Segundo Nombre'] || null,
          fecha_nacimiento: row['Fecha Nacimiento'] ? this.parseExcelDate(row['Fecha Nacimiento']) : null,
          profesion_id: prof ? prof.id : null,
          telefono: row['Teléfono']?.toString() || null,
        };

        if (!personalData.ci || !personalData.primer_nombre) {
          throw new Error('CI y Primer Nombre son obligatorios');
        }

        await PersonalModel.create(personalData);
        results.success++;
      } catch (error) {
        results.errors++;
        results.details.push({ ci: row['CI'] || 'N/A', error: error.message });
      }
    }

    return results;
  }

  // Utilidad para manejar diferentes formatos de fecha en Excel
  static parseExcelDate(val) {
    if (typeof val === 'number') {
      // Excel serial date
      const date = new Date((val - 25569) * 86400 * 1000);
      return date.toISOString().split('T')[0];
    }
    if (typeof val === 'string') {
      // Formato DD/MM/YYYY o YYYY-MM-DD
      const parts = val.split(/[-/]/);
      if (parts.length === 3) {
        if (parts[0].length === 4) return val; // YYYY-MM-DD
        return `${parts[2]}-${parts[1]}-${parts[0]}`; // DD/MM/YYYY -> YYYY-MM-DD
      }
    }
    return val;
  }
}

module.exports = ImportService;
