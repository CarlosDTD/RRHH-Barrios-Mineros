const XLSX = require('xlsx');
const PersonalModel = require('../models/personalModel');
const db = require('../config/db');

class ImportService {
  static async importPersonalFromExcel(buffer) {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const results = { success: 0, errors: 0, details: [] };

    // 1. Obtener catálogos para mapeo eficiente
    const { rows: expediciones } = await db.query('SELECT id, sigla FROM cat_expediciones');
    const { rows: profesiones } = await db.query('SELECT id, nombre_profesion FROM cat_profesiones');
    const { rows: fuentes } = await db.query('SELECT id, nombre_fuente FROM cat_fuentes_financiamiento');
    const { rows: tipos } = await db.query('SELECT id, nombre_tipo FROM cat_tipos_personal');
    const { rows: establecimientos } = await db.query('SELECT id, nombre_establecimiento FROM establecimientos');

    // Mapeo de Establecimiento por defecto (HBM)
    const defaultEst = establecimientos.find(e => e.nombre_establecimiento.includes('Barrios Mineros')) || establecimientos[0];

    for (const sheetName of workbook.SheetNames) {
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (data.length === 0) continue;

      // 2. Detectar fila de encabezados dinámicamente
      let headerRowIndex = -1;
      for (let i = 0; i < Math.min(data.length, 20); i++) {
        const row = data[i];
        if (row && row.some(cell => typeof cell === 'string' && (cell.includes('C.I.') || cell.includes('PATERNO')))) {
          headerRowIndex = i;
          break;
        }
      }

      if (headerRowIndex === -1) continue;

      const headers = data[headerRowIndex].map(h => (h || '').toString().toUpperCase().trim());
      const rows = data.slice(headerRowIndex + 1);

      // 3. Procesar filas
      for (const rowData of rows) {
        if (!rowData || rowData.length === 0) continue;

        // Convertir array de fila a objeto usando encabezados
        const row = {};
        headers.forEach((header, index) => {
          row[header] = rowData[index];
        });

        try {
          // Extraer CI (Limpiar si es necesario)
          const ciRaw = row['N° C.I.'] || row['C.I.'] || row['CI'];
          if (!ciRaw) continue; // Saltar filas vacías

          const ci = ciRaw.toString().trim();
          const primerNombre = row['1ER. NOMBRE'] || row['PRIMER NOMBRE'];

          if (!ci || !primerNombre) {
            throw new Error('Faltan datos obligatorios (CI o Primer Nombre)');
          }

          // Mapear IDs de Catálogos
          const expSigla = (row['EXP'] || '').toString().trim().toUpperCase();
          const exp = expediciones.find(e => e.sigla === expSigla);

          const profName = (row['PROFESION'] || row['PROFESIÓN'] || '').toString().trim();
          let prof = profesiones.find(p => p.nombre_profesion.toUpperCase() === profName.toUpperCase());

          // Si la profesión no existe, crearla dinámicamente
          if (!prof && profName) {
            const { rows: newProf } = await db.query(
              'INSERT INTO cat_profesiones (nombre_profesion) VALUES ($1) RETURNING id, nombre_profesion',
              [profName]
            );
            prof = newProf[0];
            profesiones.push(prof); // Actualizar cache local
          }

          const fuenteName = (row['FUENTE DE FINANCIAMIENTO'] || row['FUENTE DE\r\nFINANCIAMIENTO'] || '').toString().trim().toUpperCase();
          const fuente = fuentes.find(f => f.nombre_fuente === fuenteName);

          const tipoPersonal = (row['N° ITEM'] || row['ITEM']) ? 'ÍTEM' : (row['CONTRATO'] ? 'CONTRATO' : 'CONSULTORÍA');
          const tipo = tipos.find(t => t.nombre_tipo === tipoPersonal);

          const personalData = {
            ci: ci,
            complemento: (row['COMPLEMENTO'] || '').toString().trim() || null,
            exp_id: exp ? exp.id : null,
            apellido_paterno: row['APELLIDO PATERNO'] || null,
            apellido_materno: row['APELLIDO MATERNO'] || null,
            apellido_casada: row['APELLIDO DE CASADA'] || row['APELLIDO CASADA'] || null,
            primer_nombre: primerNombre.toString().trim(),
            segundo_nombre: row['2DO. NOMBRE'] || row['SEGUNDO NOMBRE'] || null,
            tercer_nombre: row['3ER. NOMBRE'] || row['TERCER NOMBRE'] || null,
            fecha_nacimiento: this.parseExcelDate(row['FECHA DE NACIMIENTO (DD/MM/AAAA)'] || row['FECHA DE NACIMIENTO  (DD/MM/AAAA)'] || row['FECHA DE NACIMIENTO \r\n(DD/MM/AAAA)']),
            profesion_id: prof ? prof.id : null,
            telefono: (row['TELEFONO'] || row['TELÉFONO'])?.toString() || null,
            // Datos Laborales
            establecimiento_id: defaultEst ? defaultEst.id : null,
            tipo_personal_id: tipo ? tipo.id : null,
            fuente_financiamiento_id: fuente ? fuente.id : null,
            identificador_laboral: (row['N° ITEM'] || row['ITEM'] || row['CONTRATO'])?.toString() || null,
            cargo_planilla: row['CARGO SEGÚN PLANILLA'] || row['CARGO S/G PLANILLAS/MEMORANDUM DE DESIGNACION '] || null,
            cargo_escala: row['CARGO SEGÚN ESCALA'] || null,
            nro_resumen_ejecutivo: row['N° RESUMEN EJECUTIVO'] || null,
            unidad_servicio: row['UNIDAD O SERVICIO DONDE TRABAJA '] || row['UNIDAD O SERVICIO\r\nDONDE TRABAJA'] || null,
            cargo_actual: row['CARGO ACTUAL QUE DESEMPEÑA EN LA INSTITUCION'] || row['CARGO ACTUAL QUE DESEMPEÑA EN LA INSTITUCIÓN'] || null,
            carga_horaria: row['CARGA HORARIA\r\nMT/TC'] || row['CARGA HORARIA MT/TC'] || null,
            fecha_ingreso: this.parseExcelDate(row['FECHA DE INGRESO A LA INSTITUCION CON ITEM (DD/MM/AAAA)'] || row['FECHA DE INGRESO AL SISTEMA DE SALUD (DD/MM/AAAA)']),
            fecha_institucionalizacion: this.parseExcelDate(row['FECHA DE INSTITUCIONALIZACION (DD/MM/AAAA)']),
            observaciones: row['OBSERV.'] || row['OBSERVACIONES'] || null
          };

          // Intentar insertar en la DB
          // Nota: Si el CI ya existe, PersonalModel.create lanzará un error por el constraint UNIQUE
          // Podríamos implementar un "upsert" pero por ahora seguimos el flujo de creación
          await PersonalModel.create(personalData);
          results.success++;
        } catch (error) {
          results.errors++;
          results.details.push({ 
            hoja: sheetName,
            ci: row['N° C.I.'] || row['C.I.'] || 'N/A', 
            error: error.message.includes('unique constraint') ? 'El CI ya existe en el sistema' : error.message 
          });
        }
      }
    }

    return results;
  }

  static parseExcelDate(val) {
    if (!val) return null;
    if (typeof val === 'number') {
      // Excel serial date
      const date = new Date(Math.round((val - 25569) * 86400 * 1000));
      return date.toISOString().split('T')[0];
    }
    if (typeof val === 'string') {
      const cleanVal = val.trim();
      if (!cleanVal) return null;
      // Formato DD/MM/YYYY o YYYY-MM-DD
      const parts = cleanVal.split(/[-/]/);
      if (parts.length === 3) {
        if (parts[0].length === 4) return cleanVal; // YYYY-MM-DD
        // DD/MM/YYYY -> YYYY-MM-DD
        const day = parts[0].padStart(2, '0');
        const month = parts[1].padStart(2, '0');
        const year = parts[2];
        return `${year}-${month}-${day}`;
      }
    }
    return null;
  }
}

module.exports = ImportService;
