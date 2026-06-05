const ZKLib = require('node-zklib');
const db = require('../config/db');

class BiometricoService {
  /**
   * Intenta conectar con el equipo biométrico
   */
  static async connectToDevice(ip, port, commsKey) {
    const options = { timeout: 10000, pollingInterval: 4000 };
    if (commsKey && commsKey !== '0') {
      options.commKey = parseInt(commsKey);
    }
    const device = new ZKLib(ip, port, options);
    try {
      await device.createSocket();
      return device;
    } catch (e) {
      console.error(`Error al conectar con biométrico en ${ip}:`, e);
      throw new Error(`No se pudo establecer conexión con el equipo ${ip}`);
    }
  }

  /**
   * Sincroniza los usuarios del biométrico con la tabla temporal o sugiere vinculaciones
   */
  static async syncUsers() {
    const { rows: config } = await db.query('SELECT * FROM biometrico_config LIMIT 1');
    if (config.length === 0) throw new Error('No hay configuración de biométrico');

    const device = await this.connectToDevice(config[0].ip_address, config[0].port);
    try {
      const users = await device.getUsers();
      // Nota: Aquí se podría implementar una tabla temporal de usuarios 
      // o simplemente devolver la lista para que el front permita el mapeo.
      
      await db.query('UPDATE biometrico_config SET ultimo_sync_usuarios = CURRENT_TIMESTAMP, estado = \'CONECTADO\' WHERE id = $1', [config[0].id]);
      
      return users.data;
    } finally {
      await device.disconnect();
    }
  }

  /**
   * Obtiene logs nuevos del equipo y los guarda en biometrico_logs_raw
   */
  static async syncLogs() {
    const { rows: config } = await db.query('SELECT * FROM biometrico_config LIMIT 1');
    if (config.length === 0) throw new Error('No hay configuración de biométrico');

    const device = await this.connectToDevice(config[0].ip_address, config[0].port);
    try {
      const logs = await device.getAttendances();
      let nuevosRegistros = 0;

      for (const log of logs.data) {
        try {
          await db.query(`
            INSERT INTO biometrico_logs_raw (biometrico_id, timestamp, verificacion_tipo, estado_asistencia, device_ip)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (biometrico_id, timestamp) DO NOTHING
          `, [
            log.deviceUserId, 
            log.recordTime, 
            log.verifyMethod, 
            log.attendanceState, 
            config[0].ip_address
          ]);
          nuevosRegistros++;
        } catch (e) {
          // Ignorar duplicados o errores menores en el loop
        }
      }

      await db.query('UPDATE biometrico_config SET ultimo_sync_logs = CURRENT_TIMESTAMP, estado = \'CONECTADO\' WHERE id = $1', [config[0].id]);
      
      return { totalRecibidos: logs.data.length, nuevosGuardados: nuevosRegistros };
    } finally {
      await device.disconnect();
    }
  }
}

module.exports = BiometricoService;
