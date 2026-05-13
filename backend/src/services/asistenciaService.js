const XLSX = require('xlsx');
const db = require('../config/db');

class AsistenciaService {
  static async importAsistenciaFromExcel(buffer, mes, anio) {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const results = { success: 0, errors: 0, details: [] };

    for (const sheetName of workbook.SheetNames) {
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (data.length === 0) continue;

      // 1. Detectar tipo de planilla y fila de encabezados
      let headerRowIndex = -1;
      let tipoPlanilla = sheetName.toUpperCase().includes('RESIDENTE') ? 'RESIDENTE' : 'MINISTERIAL';

      for (let i = 0; i < Math.min(data.length, 20); i++) {
        const row = data[i];
        if (row && row.some(cell => typeof cell === 'string' && (cell.includes('CEDULA IDENTIDAD') || cell.includes('C.I.')))) {
          headerRowIndex = i;
          break;
        }
      }

      if (headerRowIndex === -1) continue;

      const headers = data[headerRowIndex].map(h => (h || '').toString().toUpperCase().trim());
      const rows = data.slice(headerRowIndex + 1);

      // 2. Procesar filas
      for (const rowData of rows) {
        if (!rowData || rowData.length === 0) continue;

        const row = {};
        headers.forEach((header, index) => {
          row[header] = rowData[index];
        });

        try {
          const ciRaw = row['CEDULA IDENTIDAD'] || row['C.I.'] || row['CI'];
          if (!ciRaw) continue;

          const ci = ciRaw.toString().trim().split('.')[0];

          // Buscar personal_id en Postgres
          const { rows: personal } = await db.query('SELECT id FROM personal WHERE ci = $1', [ci]);
          
          if (personal.length === 0) {
            throw new Error(`Personal con CI ${ci} no encontrado en el sistema.`);
          }

          const personalId = personal[0].id;

          // Extraer totales
          const totalHoras = parseFloat(row['HORAS TRABAJADAS'] || row['TOTAL HRS. MES'] || 0);
          const totalAtrasos = parseInt(row['TOTAL MIN. ATRASADOS'] || 0);
          const observaciones = row['OBSERVACIONES'] || null;

          // 3. Insertar Consolidado Mensual (Upsert)
          const { rows: asistencia } = await db.query(`
            INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (personal_id, mes, anio, tipo_planilla) 
            DO UPDATE SET 
                total_horas = EXCLUDED.total_horas,
                total_atrasos_min = EXCLUDED.total_atrasos_min,
                observaciones = EXCLUDED.observaciones
            RETURNING id
          `, [personalId, mes, anio, totalHoras, totalAtrasos, observaciones, tipoPlanilla]);

          const asistenciaId = asistencia[0].id;

          // 4. Procesar Días (1 al 31)
          // Buscamos columnas que sean puramente números del 1 al 31
          for (let dia = 1; dia <= 31; dia++) {
            const headerDia = dia.toString();
            const colIndex = headers.indexOf(headerDia);
            
            if (colIndex !== -1) {
                const valorDia = rowData[colIndex];
                if (valorDia !== undefined && valorDia !== null && valorDia !== '') {
                    await db.query(`
                        INSERT INTO asistencia_diaria (asistencia_id, dia, valor)
                        VALUES ($1, $2, $3)
                    `, [asistenciaId, dia, valorDia.toString()]);
                }
            }
          }

          // 5. Procesar Rotación si es Residente
          if (tipoPlanilla === 'RESIDENTE') {
              const rotDe = row['ROTACION DE:'];
              const rotA = row['ROTACION A:'];
              if (rotDe || rotA) {
                  await db.query(`
                    INSERT INTO asistencia_rotaciones (personal_id, fecha_inicio, fecha_fin, rotacion_de, rotacion_a, tiempo_rotacion, observaciones)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                  `, [
                      personalId, 
                      this.parseExcelDate(row['FECHA INGRESO']), 
                      this.parseExcelDate(row['FECHA CULMINACION']),
                      rotDe,
                      rotA,
                      row['FECHA DE ROTACION'],
                      row['OBSERVACIONES']
                  ]);
              }
          }

          results.success++;
        } catch (error) {
          results.errors++;
          results.details.push({
            hoja: sheetName,
            ci: row['CEDULA IDENTIDAD'] || 'N/A',
            error: error.message
          });
        }
      }
    }

    return results;
  }

  static parseExcelDate(val) {
    if (!val) return null;
    if (typeof val === 'number') {
      const date = new Date(Math.round((val - 25569) * 86400 * 1000));
      return date.toISOString().split('T')[0];
    }
    return val.toString();
  }
}

module.exports = AsistenciaService;
