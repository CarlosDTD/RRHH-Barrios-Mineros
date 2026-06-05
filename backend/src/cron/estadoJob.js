const cron = require('node-cron');
const db = require('../config/db');
const BiometricoService = require('../services/biometricoService');

function startEstadoJob() {
  cron.schedule('0 1 * * *', async () => {
    console.log('[CRON] Verificando contratos vencidos...');
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { rowCount } = await db.query(`
        UPDATE personal SET estado = 'INACTIVO', fecha_baja = $1
        WHERE id IN (
          SELECT p.id FROM personal p
          JOIN vinculos_laborales vl ON p.id = vl.personal_id
          WHERE p.estado = 'ACTIVO'
            AND vl.fecha_fin_contrato IS NOT NULL
            AND vl.fecha_fin_contrato < $1
        )
      `, [today]);

      if (rowCount > 0) {
        console.log(`[CRON] ${rowCount} personal marcado como INACTIVO por contrato vencido`);
      } else {
        console.log('[CRON] No hay contratos vencidos para procesar');
      }
    } catch (error) {
      console.error('[CRON] Error al procesar contratos vencidos:', error.message);
    }
  });

  cron.schedule('*/30 * * * *', async () => {
    console.log('[CRON] Sincronizando logs biométricos...');
    try {
      const { rows } = await db.query('SELECT * FROM biometrico_config LIMIT 1');
      if (rows.length === 0 || !rows[0].ip_address) {
        console.log('[CRON] Sin configuración biométrica: saltando sync');
        return;
      }

      const result = await BiometricoService.syncLogs();
      console.log(`[CRON] Sync biométrico: ${result.nuevosGuardados} nuevos registros de ${result.totalRecibidos}`);
    } catch (error) {
      console.error('[CRON] Error en sync biométrico:', error.message);
    }
  });

  console.log('[CRON] Jobs programados: verificación contratos (01:00), sync biométrico (c/30 min)');
}

module.exports = { startEstadoJob };
