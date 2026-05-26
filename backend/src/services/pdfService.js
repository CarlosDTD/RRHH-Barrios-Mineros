const sharp = require('sharp');
const { PDFDocument } = require('pdf-lib');
const path = require('path');
const fs = require('fs');

const UPLOAD_DIR = path.join(__dirname, '../../uploads/correspondencia');

class PdfService {
  static async compressPDF(buffer, options = {}) {
    const quality = options.quality || 60;
    const maxWidth = options.maxWidth || 2000;

    try {
      const metadata = await sharp(buffer, { pages: -1 }).metadata();
      const pages = metadata.pages || 1;

      if (pages === 1) {
        const compressedJpeg = await sharp(buffer, { page: 0 })
          .resize({ width: maxWidth, withoutEnlargement: true })
          .jpeg({ quality })
          .toBuffer();

        const pdfDoc = await PDFDocument.create();
        const image = await pdfDoc.embedJpg(compressedJpeg);
        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
        return await pdfDoc.save();
      }

      const pdfDoc = await PDFDocument.create();
      for (let i = 0; i < pages; i++) {
        const pageJpeg = await sharp(buffer, { page: i })
          .resize({ width: maxWidth, withoutEnlargement: true })
          .jpeg({ quality })
          .toBuffer();
        const image = await pdfDoc.embedJpg(pageJpeg);
        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
      }
      return await pdfDoc.save();
    } catch (error) {
      console.error('Error comprimiendo PDF:', error.message);
      return buffer;
    }
  }

  static async saveFiles(correspondenciaId, gestion, originalBuffer) {
    const dir = path.join(UPLOAD_DIR, String(gestion), `HR-${String(correspondenciaId).padStart(4, '0')}`);
    fs.mkdirSync(dir, { recursive: true });

    const originalPath = path.join(dir, 'original.pdf');
    const compressedPath = path.join(dir, 'comprimido.pdf');

    fs.writeFileSync(originalPath, originalBuffer);

    try {
      const compressedBuffer = await this.compressPDF(originalBuffer);
      fs.writeFileSync(compressedPath, compressedBuffer);
    } catch (e) {
      console.error('Error en compresión, guardando original como comprimido:', e.message);
      fs.writeFileSync(compressedPath, originalBuffer);
    }

    return {
      pdf_original: originalPath,
      pdf_comprimido: compressedPath
    };
  }
}

module.exports = PdfService;
