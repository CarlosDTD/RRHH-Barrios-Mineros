const BiometricoService = require('../services/biometricoService');
const BiometricoImportService = require('../services/biometricoImportService');
const BiometricoMappingService = require('../services/biometricoMappingService');
const BiometricoAsistenciaService = require('../services/biometricoAsistenciaService');
const db = require('../config/db');

class BiometricoController {
  static async getConfig(req, res) {
    try {
      const { rows } = await db.query('SELECT * FROM biometrico_config LIMIT 1');
      res.json(rows[0] || {});
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener configuración' });
    }
  }

  static async updateConfig(req, res) {
    try {
      const { ip_address, port, comms_key } = req.body;
      const { rows } = await db.query(`
        INSERT INTO biometrico_config (id, ip_address, port, comms_key)
        VALUES (1, $1, $2, $3)
        ON CONFLICT (id) DO UPDATE SET 
            ip_address = EXCLUDED.ip_address,
            port = EXCLUDED.port,
            comms_key = EXCLUDED.comms_key
        RETURNING *
      `, [ip_address, port, comms_key]);
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar configuración' });
    }
  }

  static async syncLogs(req, res) {
    try {
      const result = await BiometricoService.syncLogs();
      res.json({ message: 'Sincronización exitosa', ...result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getUsers(req, res) {
    try {
      const users = await BiometricoService.syncUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getRawLogs(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 100;
      const offset = parseInt(req.query.offset) || 0;
      const { rows } = await db.query(`
        SELECT b.*, p.primer_nombre, p.apellido_paterno
        FROM biometrico_logs_raw b
        LEFT JOIN personal p ON b.biometrico_id = p.biometrico_id
        ORDER BY b.timestamp DESC
        LIMIT $1 OFFSET $2
      `, [limit, offset]);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener registros crudos' });
    }
  }

  // ============= IMPORTACIÓN =============

  static async importarEmpleados(req, res) {
    try {
      const ruta = req.body.ruta || req.query.ruta || process.env.ZKTIMENET_DB_PATH;
      if (!ruta) return res.status(400).json({ error: 'Ruta de ZKTimeNet.db no especificada' });

      const result = await BiometricoImportService.importarEmpleados(ruta);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async importarMarcaciones(req, res) {
    try {
      const ruta = req.body.ruta || req.query.ruta || process.env.ZKTIMENET_DB_PATH;
      if (!ruta) return res.status(400).json({ error: 'Ruta de ZKTimeNet.db no especificada' });

      const { desde, hasta } = req.body;
      const result = await BiometricoImportService.importarMarcaciones(ruta, desde, hasta);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getStatsImportacion(req, res) {
    try {
      const stats = await BiometricoImportService.getStatsImportacion();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // ============= MAPEO =============

  static async getSugerencias(req, res) {
    try {
      const sugerencias = await BiometricoMappingService.getSugerencias();
      res.json(sugerencias);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getNoVinculados(req, res) {
    try {
      const data = await BiometricoMappingService.getNoVinculados();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getVinculados(req, res) {
    try {
      const data = await BiometricoMappingService.getVinculados();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async vincular(req, res) {
    try {
      const { usuario_id, personal_id } = req.body;
      if (!usuario_id || !personal_id) return res.status(400).json({ error: 'usuario_id y personal_id requeridos' });

      const result = await BiometricoMappingService.vincular(usuario_id, personal_id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async desvincular(req, res) {
    try {
      const { personal_id } = req.body;
      if (!personal_id) return res.status(400).json({ error: 'personal_id requerido' });

      const result = await BiometricoMappingService.desvincular(personal_id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getPersonalSinBiometrico(req, res) {
    try {
      const data = await BiometricoMappingService.getPersonalSinBiometrico();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getResumenMapeo(req, res) {
    try {
      const data = await BiometricoMappingService.getResumen();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // ============= ASISTENCIA =============

  static async getAsistenciaMensual(req, res) {
    try {
      const mes = parseInt(req.query.mes) || new Date().getMonth() + 1;
      const anio = parseInt(req.query.anio) || new Date().getFullYear();

      const data = await BiometricoAsistenciaService.getResumenMensual(mes, anio);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getMarcacionesPorDia(req, res) {
    try {
      const personalId = parseInt(req.params.personalId);
      const mes = parseInt(req.query.mes) || new Date().getMonth() + 1;
      const anio = parseInt(req.query.anio) || new Date().getFullYear();

      const data = await BiometricoAsistenciaService.getMarcacionesPorDia(mes, anio, personalId);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getPersonasConAsistencia(req, res) {
    try {
      const mes = parseInt(req.query.mes) || new Date().getMonth() + 1;
      const anio = parseInt(req.query.anio) || new Date().getFullYear();

      const data = await BiometricoAsistenciaService.getPersonasConAsistencia(mes, anio);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getDepartamentos(req, res) {
    try {
      const { rows } = await db.query('SELECT DISTINCT dept_name, emp_dept_id FROM biometrico_usuarios WHERE dept_name IS NOT NULL ORDER BY dept_name');
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = BiometricoController;
