const TurnoModel = require('../models/turnoModel');
const ExcelJS = require('exceljs');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

class TurnoService {
  static PRIORIDAD_FUENTE = { TGN: 1, HIPC: 2, MINISTERIO: 3, MUNICIPIO: 4 };

  static obtenerPrioridadFuente(nombreFuente) {
    return this.PRIORIDAD_FUENTE[nombreFuente] || 5;
  }

  static async generarPlanillaAuto(servicioId, mes, anio, usuarioId) {
    const roles = await TurnoModel.getRolesByServicio(servicioId);
    const primerDia = new Date(anio, mes - 1, 1);
    const ultimoDia = new Date(anio, mes, 0);
    const resultados = [];

    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
      const fecha = `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;

      for (const rol of roles) {
        const sugeridos = await TurnoModel.sugerirPersonal(rol.id, fecha);
        const asignar = sugeridos.slice(0, rol.cantidad_requerida);

        for (const item of asignar) {
          try {
            const nuevo = await TurnoModel.createPlanillaItem({
              servicio_id: servicioId,
              rol_turno_id: rol.id,
              personal_id: item.personal_id,
              tipo_turno_id: 1,
              fecha,
              es_guardia: false,
              observaciones: 'Generado automáticamente',
              created_by: usuarioId
            });
            resultados.push(nuevo);
          } catch (e) {
            if (!e.constraint || !e.constraint.includes('planilla_turnos')) throw e;
          }
        }
      }
    }
    return resultados;
  }

  static async exportToExcel(servicioId, mes, anio) {
    const planilla = await TurnoModel.getPlanilla({ servicio_id: servicioId, mes, anio });
    const servicios = await TurnoModel.getRolesByServicio(servicioId);
    const workbook = new ExcelJS.Workbook();
    const ws = workbook.addWorksheet(`Planilla ${mes}/${anio}`);

    const diasMes = new Date(anio, mes, 0).getDate();

    ws.columns = [
      { header: 'Rol de Turno', key: 'rol', width: 30 },
      ...Array.from({ length: diasMes }, (_, i) => ({
        header: `${i + 1}`, key: `d${i + 1}`, width: 18
      }))
    ];

    const rolesUnicos = [...new Set(planilla.map(p => p.rol_nombre))];

    for (const rolNombre of rolesUnicos) {
      const itemsRol = planilla.filter(p => p.rol_nombre === rolNombre);
      const fila = { rol: rolNombre };
      for (let d = 1; d <= diasMes; d++) {
        const asignados = itemsRol
          .filter(p => new Date(p.fecha).getDate() === d)
          .map(p => `${p.primer_nombre} ${p.apellido_paterno} (${p.turno_codigo})`);
        fila[`d${d}`] = asignados.join(', ') || '';
      }
      ws.addRow(fila);
    }

    ws.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }

  static async exportToPDF(servicioId, mes, anio) {
    const planilla = await TurnoModel.getPlanilla({ servicio_id: servicioId, mes, anio });

    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let page = pdfDoc.addPage([842, 595]);
    const { width, height } = page.getSize();
    let y = height - 50;

    page.drawText(`Planilla de Turnos - ${mes}/${anio}`, {
      x: 50, y, size: 16, font: fontBold, color: rgb(0.15, 0.38, 0.92)
    });
    y -= 30;
    page.drawText(`Servicio: ${planilla[0]?.nombre_unidad || 'N/A'}`, {
      x: 50, y, size: 10, font
    });
    y -= 20;

    const rolesUnicos = [...new Set(planilla.map(p => p.rol_nombre))];
    const tiposTurno = [...new Set(planilla.map(p => p.turno_codigo))];

    for (const rolNombre of rolesUnicos) {
      if (y < 80) {
        page = pdfDoc.addPage([842, 595]);
        y = height - 50;
      }

      page.drawText(rolNombre, {
        x: 50, y, size: 11, font: fontBold, color: rgb(0.1, 0.1, 0.1)
      });
      y -= 16;

      const itemsRol = planilla.filter(p => p.rol_nombre === rolNombre);
      const porFecha = {};
      for (const item of itemsRol) {
        const dia = new Date(item.fecha).getDate();
        if (!porFecha[dia]) porFecha[dia] = [];
        porFecha[dia].push(`${item.primer_nombre} ${item.apellido_paterno}`);
      }

      for (let d = 1; d <= 31; d++) {
        if (!porFecha[d] || porFecha[d].length === 0) continue;
        const texto = `Día ${d}: ${porFecha[d].join(', ')}`;
        page.drawText(texto, { x: 60, y, size: 8, font });
        y -= 13;
      }
      y -= 10;
    }

    return await pdfDoc.save();
  }
}

module.exports = TurnoService;
