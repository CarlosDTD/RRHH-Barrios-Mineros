const ExcelJS = require('exceljs');

class ExcelService {
  static async exportPersonalToExcel(data) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Personal');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 8 },
      { header: 'CI', key: 'ci', width: 12 },
      { header: 'Complemento', key: 'complemento', width: 12 },
      { header: 'Expedición', key: 'expedicion', width: 12 },
      { header: 'Apellido Paterno', key: 'apellido_paterno', width: 20 },
      { header: 'Apellido Materno', key: 'apellido_materno', width: 20 },
      { header: 'Apellido Casada', key: 'apellido_casada', width: 20 },
      { header: 'Primer Nombre', key: 'primer_nombre', width: 20 },
      { header: 'Segundo Nombre', key: 'segundo_nombre', width: 20 },
      { header: 'Fecha Nacimiento', key: 'fecha_nacimiento', width: 18 },
      { header: 'Profesión', key: 'nombre_profesion', width: 25 },
      { header: 'Teléfono', key: 'telefono', width: 15 },
    ];

    data.forEach(item => {
      worksheet.addRow({
        ...item,
        fecha_nacimiento: item.fecha_nacimiento ? new Date(item.fecha_nacimiento).toLocaleDateString('es-BO') : ''
      });
    });

    // Estilo de encabezado
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1E293B' } // slate-800
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    return await workbook.xlsx.writeBuffer();
  }
}

module.exports = ExcelService;
