const AsistenciaService = require('../services/asistenciaService');
const db = require('../config/db');

class AsistenciaController {
  static async importAsistencia(req, res) {
    // ... (código existente)
  }

  static async getAsistencias(req, res) {
    try {
      const { mes, anio, buscar, tipo } = req.query;
      let query = `
        SELECT 
          am.id, 
          p.ci, 
          p.primer_nombre, 
          p.apellido_paterno, 
          p.apellido_materno,
          am.mes, 
          am.anio, 
          am.total_horas, 
          am.total_atrasos_min, 
          am.tipo_planilla,
          am.observaciones
        FROM asistencia_mensual am
        JOIN personal p ON am.personal_id = p.id
        WHERE 1=1
      `;
      const params = [];

      if (mes) {
        params.push(mes);
        query += ` AND am.mes = $${params.length}`;
      }
      if (anio) {
        params.push(anio);
        query += ` AND am.anio = $${params.length}`;
      }
      if (tipo) {
        params.push(tipo);
        query += ` AND am.tipo_planilla = $${params.length}`;
      }
      if (buscar) {
        params.push(`%${buscar}%`);
        query += ` AND (p.ci LIKE $${params.length} OR p.primer_nombre ILIKE $${params.length} OR p.apellido_paterno ILIKE $${params.length})`;
      }

      query += ` ORDER BY am.anio DESC, am.mes DESC, p.apellido_paterno ASC`;

      const { rows } = await db.query(query, params);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener asistencias' });
    }
  }

  static async deleteAsistencia(req, res) {
    try {
      const { id } = req.params;
      await db.query('DELETE FROM asistencia_mensual WHERE id = $1', [id]);
      res.json({ message: 'Registro eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar registro' });
    }
  }
}

module.exports = AsistenciaController;
