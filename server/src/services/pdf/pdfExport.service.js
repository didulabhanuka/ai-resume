const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

const generatePdf = async (letterText, candidateName = 'Candidate') => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size in points

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const { width, height } = page.getSize();
  const margin = 60;
  const lineHeight = 18;
  const maxWidth = width - margin * 2;

  let y = height - margin;

  // Header — candidate name
  page.drawText(candidateName, {
    x: margin,
    y,
    size: 16,
    font: boldFont,
    color: rgb(0.05, 0.1, 0.3),
  });

  y -= 24;

  // Date
  page.drawText(new Date().toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }), {
    x: margin,
    y,
    size: 10,
    font,
    color: rgb(0.5, 0.5, 0.5),
  });

  y -= 16;

  // Divider line
  page.drawLine({
    start: { x: margin, y },
    end: { x: width - margin, y },
    thickness: 0.5,
    color: rgb(0.8, 0.8, 0.8),
  });

  y -= 28;

  // Body text — word wrap each paragraph
  const paragraphs = letterText.split('\n');

  for (const paragraph of paragraphs) {
    if (!paragraph.trim()) {
      // Empty line between paragraphs
      y -= lineHeight;
      continue;
    }

    // Word wrap the paragraph
    const words = paragraph.trim().split(' ');
    let line = '';

    for (const word of words) {
      const testLine = line + word + ' ';
      const textWidth = font.widthOfTextAtSize(testLine, 11);

      if (textWidth > maxWidth && line !== '') {
        // Draw current line and move down
        page.drawText(line.trim(), {
          x: margin,
          y,
          size: 11,
          font,
          color: rgb(0.1, 0.1, 0.1),
        });

        y -= lineHeight;
        line = word + ' ';

        // Stop if we reach bottom margin
        if (y < margin) break;
      } else {
        line = testLine;
      }
    }

    // Draw remaining text in line
    if (line.trim() && y >= margin) {
      page.drawText(line.trim(), {
        x: margin,
        y,
        size: 11,
        font,
        color: rgb(0.1, 0.1, 0.1),
      });
      y -= lineHeight;
    }

    if (y < margin) break;
  }

  return await pdfDoc.save(); // returns Uint8Array
};

module.exports = { generatePdf };